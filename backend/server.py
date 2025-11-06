from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, date
from bson import ObjectId

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Pydantic Models
class UserCreate(BaseModel):
    name: str
    phone_or_email: Optional[str] = None

class User(BaseModel):
    id: str
    name: str
    phone_or_email: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PreferencesCreate(BaseModel):
    user_id: str
    primary_deity: str
    secondary_deities: List[str] = []
    reminder_time: str = "06:30"
    soundscape_default_on: bool = True
    soundscape_type: str = "temple_bells"
    weekday_mapping_enabled: bool = True

class Preferences(PreferencesCreate):
    pass

class StreakInfo(BaseModel):
    user_id: str
    current_streak: int = 0
    longest_streak: int = 0
    last_completed_date: Optional[str] = None
    grace_used_in_window: bool = False
    window_start_date: Optional[str] = None

class RitualHistoryCreate(BaseModel):
    user_id: str
    date: str
    completed: bool = True
    steps_completed: int = 5
    deity_used: str
    soundscape_on: bool
    duration_sec: int

class RitualHistory(RitualHistoryCreate):
    id: str

class Blessing(BaseModel):
    id: str
    deity: Optional[str] = None
    text_en: str
    tone: str
    active: bool = True

# Weekday to deity mapping
WEEKDAY_DEITY_MAP = {
    0: "shiva",      # Monday
    1: "hanuman",    # Tuesday
    2: "ganesha",    # Wednesday
    4: "durga",      # Friday
    6: "krishna"     # Sunday
}

# Helper function to convert ObjectId to string
def serialize_doc(doc):
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

# Routes
@api_router.get("/")
async def root():
    return {"message": "Sri Mandir API"}

@api_router.post("/users", response_model=User)
async def create_user(user: UserCreate):
    user_dict = user.dict()
    user_dict["created_at"] = datetime.utcnow()
    result = await db.users.insert_one(user_dict)
    user_dict["id"] = str(result.inserted_id)
    return User(**user_dict)

@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**serialize_doc(user))

@api_router.post("/preferences", response_model=Preferences)
async def create_preferences(prefs: PreferencesCreate):
    prefs_dict = prefs.dict()
    # Check if preferences already exist
    existing = await db.preferences.find_one({"user_id": prefs.user_id})
    if existing:
        # Update existing preferences
        await db.preferences.update_one(
            {"user_id": prefs.user_id},
            {"$set": prefs_dict}
        )
    else:
        await db.preferences.insert_one(prefs_dict)
    return Preferences(**prefs_dict)

@api_router.get("/preferences/{user_id}", response_model=Preferences)
async def get_preferences(user_id: str):
    prefs = await db.preferences.find_one({"user_id": user_id})
    if not prefs:
        raise HTTPException(status_code=404, detail="Preferences not found")
    if "_id" in prefs:
        del prefs["_id"]
    return Preferences(**prefs)

@api_router.put("/preferences/{user_id}", response_model=Preferences)
async def update_preferences(user_id: str, prefs: PreferencesCreate):
    prefs_dict = prefs.dict()
    await db.preferences.update_one(
        {"user_id": user_id},
        {"$set": prefs_dict}
    )
    return Preferences(**prefs_dict)

@api_router.post("/streaks/init", response_model=StreakInfo)
async def init_streak(user_id: str):
    streak_dict = {
        "user_id": user_id,
        "current_streak": 0,
        "longest_streak": 0,
        "last_completed_date": None,
        "grace_used_in_window": False,
        "window_start_date": None
    }
    existing = await db.streaks.find_one({"user_id": user_id})
    if not existing:
        await db.streaks.insert_one(streak_dict)
    return StreakInfo(**streak_dict)

@api_router.get("/streaks/{user_id}", response_model=StreakInfo)
async def get_streak(user_id: str):
    streak = await db.streaks.find_one({"user_id": user_id})
    if not streak:
        # Initialize if not exists
        return await init_streak(user_id)
    if "_id" in streak:
        del streak["_id"]
    return StreakInfo(**streak)

@api_router.post("/rituals/complete")
async def complete_ritual(ritual: RitualHistoryCreate):
    # Save ritual history
    ritual_dict = ritual.dict()
    result = await db.ritual_history.insert_one(ritual_dict)
    ritual_dict["id"] = str(result.inserted_id)
    
    # Update streak
    streak = await db.streaks.find_one({"user_id": ritual.user_id})
    if not streak:
        streak = {
            "user_id": ritual.user_id,
            "current_streak": 0,
            "longest_streak": 0,
            "last_completed_date": None,
            "grace_used_in_window": False,
            "window_start_date": None
        }
        await db.streaks.insert_one(streak)
    
    today = ritual.date
    last_completed = streak.get("last_completed_date")
    
    # Check if already completed today
    if last_completed == today:
        return {"message": "Already completed today", "streak": streak["current_streak"]}
    
    # Calculate new streak
    if last_completed:
        last_date = datetime.strptime(last_completed, "%Y-%m-%d")
        current_date = datetime.strptime(today, "%Y-%m-%d")
        days_diff = (current_date - last_date).days
        
        if days_diff == 1:
            # Consecutive day
            new_streak = streak["current_streak"] + 1
        elif days_diff == 0:
            # Same day (shouldn't happen, but handle it)
            new_streak = streak["current_streak"]
        else:
            # Gap - reset streak
            new_streak = 1
    else:
        new_streak = 1
    
    # Update streak
    longest_streak = max(streak.get("longest_streak", 0), new_streak)
    await db.streaks.update_one(
        {"user_id": ritual.user_id},
        {"$set": {
            "current_streak": new_streak,
            "longest_streak": longest_streak,
            "last_completed_date": today
        }}
    )
    
    return {
        "message": "Ritual completed",
        "streak": new_streak,
        "longest_streak": longest_streak,
        "milestone": new_streak in [3, 7, 21, 40]
    }

@api_router.get("/rituals/history/{user_id}")
async def get_ritual_history(user_id: str, limit: int = 100):
    history = await db.ritual_history.find({"user_id": user_id}).sort("date", -1).limit(limit).to_list(limit)
    for item in history:
        if "_id" in item:
            item["id"] = str(item["_id"])
            del item["_id"]
    return history

@api_router.get("/blessings/random")
async def get_random_blessing(deity: Optional[str] = None):
    # Get a random blessing
    query = {"active": True}
    if deity:
        query["$or"] = [{"deity": deity}, {"deity": None}]
    
    blessings = await db.blessings.find(query).to_list(100)
    if not blessings:
        # Return default blessing
        return {
            "text_en": "May divine grace guide and protect you throughout your day.",
            "tone": "calm",
            "deity": deity
        }
    
    import random
    blessing = random.choice(blessings)
    if "_id" in blessing:
        blessing["id"] = str(blessing["_id"])
        del blessing["_id"]
    return blessing

@api_router.get("/weekday-deity")
async def get_weekday_deity():
    # Get current weekday (0=Monday, 6=Sunday)
    today = datetime.now().weekday()
    deity = WEEKDAY_DEITY_MAP.get(today)
    return {
        "weekday": today,
        "deity": deity,
        "message": f"Today is a day of devotion to {deity}" if deity else "Continue your devotion today"
    }

# Seed blessings on startup
@app.on_event("startup")
async def seed_blessings():
    count = await db.blessings.count_documents({})
    if count == 0:
        blessings_data = [
            {"deity": "ganesha", "text_en": "May clarity and new beginnings guide your path today.", "tone": "calm", "active": True},
            {"deity": "ganesha", "text_en": "May obstacles dissolve and wisdom illuminate your journey.", "tone": "clarity", "active": True},
            {"deity": "hanuman", "text_en": "May courage and strength protect you through every challenge.", "tone": "strength", "active": True},
            {"deity": "hanuman", "text_en": "May devotion and fearlessness empower your actions today.", "tone": "strength", "active": True},
            {"deity": "shiva", "text_en": "May peace and inner strength bring you tranquility today.", "tone": "calm", "active": True},
            {"deity": "shiva", "text_en": "May detachment and wisdom guide your choices today.", "tone": "calm", "active": True},
            {"deity": "durga", "text_en": "May resilience and confidence empower you in all you do.", "tone": "strength", "active": True},
            {"deity": "durga", "text_en": "May divine protection surround you with grace and strength.", "tone": "strength", "active": True},
            {"deity": "krishna", "text_en": "May joy and compassion fill your heart today.", "tone": "joy", "active": True},
            {"deity": "krishna", "text_en": "May love and wisdom guide your every action today.", "tone": "joy", "active": True},
            {"deity": None, "text_en": "May divine grace guide and protect you throughout your day.", "tone": "calm", "active": True},
            {"deity": None, "text_en": "May your actions today bring harmony and positive outcomes.", "tone": "calm", "active": True},
            {"deity": None, "text_en": "May peace and clarity be with you in every moment.", "tone": "calm", "active": True},
        ]
        await db.blessings.insert_many(blessings_data)
        logger.info("Seeded blessings data")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
