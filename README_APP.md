# Sri Mandir - Devotional Morning Ritual App

A beautiful mobile app for daily morning devotional rituals (darshan) with deity personalization, soundscapes, streak tracking, and push notifications.

## 🙏 App Overview

Sri Mandir helps users establish a daily morning ritual habit through:
- **Personalized deity selection** (Ganesha, Hanuman, Shiva, Durga, Krishna)
- **Guided 3-4 minute morning darshan** with timed breathing and meditation
- **Daily blessings** customized based on selected deity
- **Streak tracking** with milestone celebrations (Days 3, 7, 21, 40)
- **Push notifications** for daily reminders
- **Weekday deity mapping** for multi-deity devotion

## ✨ Key Features

### 1. Onboarding Flow
- **Welcome Screen**: Beautiful temple imagery with warm devotional design
- **Deity Selection**: Choose primary deity and up to 3 secondary deities
- **Reminder Setup**: Set daily notification time (with temple soundscape option)

### 2. Daily Ritual Flow (Strict 3-4 Minutes)
- **Prepare**: Transition to devotional mindset with soundscape toggle
- **Breathing & Chant (30s)**: Guided breathing animation with visual cues
- **Darshan (60s)**: View deity image with devotional message
- **Blessing**: Receive personalized daily blessing based on deity
- **Closure**: Complete ritual with diya animation and streak update

### 3. Home Dashboard
- Display primary deity with beautiful imagery
- Current streak count
- Daily reminder time
- Weekday deity message (if applicable)
- Quick access to ritual flow

### 4. Streaks & Milestones
- Calendar view of completed rituals
- Current streak and longest streak display
- Next milestone indicator
- Celebration alerts at milestones (3, 7, 21, 40 days)

### 5. Settings
- Update reminder time (5:00 AM - 9:00 AM)
- Toggle temple soundscape
- Manage deity preferences
- View weekday devotion mapping

## 🏗️ Technical Architecture

### Frontend (Expo/React Native)
```
/frontend
├── app/                          # Expo Router file-based routing
│   ├── index.tsx                 # Entry point / loader
│   ├── _layout.tsx               # Root layout with navigation
│   ├── onboarding/               # Onboarding flow (3 screens)
│   │   ├── welcome.tsx
│   │   ├── deity-selection.tsx
│   │   └── reminder-setup.tsx
│   ├── home.tsx                  # Main dashboard
│   ├── ritual/                   # 5-step ritual flow
│   │   ├── prepare.tsx
│   │   ├── breathing.tsx         # 30s timer (strict)
│   │   ├── darshan.tsx           # 60s timer (strict)
│   │   ├── blessing.tsx
│   │   └── closure.tsx
│   ├── streaks.tsx               # Calendar & streak view
│   └── settings/                 # Settings screens
│       ├── index.tsx
│       ├── reminder.tsx
│       └── deity-preferences.tsx
├── store/                        # Zustand state management
│   └── userStore.ts
├── services/                     # API client
│   └── api.ts
├── utils/                        # Constants & helpers
│   └── constants.ts
└── components/                   # Reusable components
```

**Key Libraries:**
- `expo-router`: File-based routing
- `zustand`: Lightweight state management
- `expo-notifications`: Push notifications
- `expo-av`: Audio playback (future)
- `react-native-calendars`: Streak calendar
- `@react-native-async-storage/async-storage`: Local persistence
- `axios`: HTTP client
- `date-fns`: Date formatting

### Backend (FastAPI/Python)
```
/backend
└── server.py                     # Complete API server
```

**API Endpoints:**
- `POST /api/users` - Create user
- `GET /api/users/{user_id}` - Get user
- `POST /api/preferences` - Create/update preferences
- `GET /api/preferences/{user_id}` - Get preferences
- `POST /api/streaks/init` - Initialize streak
- `GET /api/streaks/{user_id}` - Get streak info
- `POST /api/rituals/complete` - Complete ritual & update streak
- `GET /api/rituals/history/{user_id}` - Get ritual history
- `GET /api/blessings/random` - Get random blessing
- `GET /api/weekday-deity` - Get current weekday deity

### Database (MongoDB)
**Collections:**
- `users` - User profiles
- `preferences` - User deity & notification preferences
- `streaks` - Current and longest streak tracking
- `ritual_history` - Log of completed rituals
- `blessings` - Pool of deity-specific blessings (pre-seeded)

## 🎨 Design System

### Color Palette
- Primary: `#FF6B35` (Devotional orange/saffron)
- Background: `#FFF8F0` (Warm cream)
- Text Primary: `#2C1810` (Deep brown)
- Text Secondary: `#6B4423` (Medium brown)
- Text Tertiary: `#8B6F47` (Light brown)
- Borders: `#FFE4D6` (Soft peach)
- Accents: `#FFF3ED` (Very light orange)

### Typography
- Title: 32-36px, Bold (700)
- Subtitle: 16-18px, Regular (400)
- Body: 14-16px, Regular (400)
- Button: 18px, Semi-Bold (600)

### Spacing
- Consistent 8pt grid: 8px, 16px, 24px, 32px
- Card padding: 16-24px
- Screen padding: 24px

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ and Yarn
- Python 3.9+
- MongoDB running on localhost:27017

### Backend Setup
```bash
cd /app/backend
pip install -r requirements.txt
# Backend runs on port 8001
python server.py
```

### Frontend Setup
```bash
cd /app/frontend
yarn install
yarn start
# Expo runs on port 3000
```

### Environment Variables
Frontend `.env`:
```
EXPO_PUBLIC_BACKEND_URL=https://<your-domain>.preview.emergentagent.com
EXPO_PACKAGER_HOSTNAME=https://<app-name>.preview.emergentagent.com
```

Backend `.env`:
```
MONGO_URL=mongodb://localhost:27017/
DB_NAME=sri_mandir
```

## 📱 Testing

### Web Preview
Access at: `https://srimandir.preview.emergentagent.com`

### Mobile Testing (Expo Go)
1. Install Expo Go app on iOS/Android
2. Scan QR code from terminal
3. App will load on your device

### Backend Testing
```bash
# Test API health
curl http://localhost:8001/api/

# Create user
curl -X POST http://localhost:8001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User"}'

# Get random blessing
curl http://localhost:8001/api/blessings/random?deity=ganesha
```

## 🎯 User Flow

1. **First Time User:**
   - Welcome → Deity Selection → Reminder Setup → Home

2. **Daily Ritual:**
   - Home → Prepare (toggle soundscape) → Breathing (30s) → Darshan (60s) → Blessing → Closure → Home

3. **Streak Tracking:**
   - Home → View Streaks → Calendar with completed days

4. **Settings:**
   - Home → Settings → Update reminder time or deity preferences

## 📊 Streak Logic

- Ritual marks as complete when user finishes all 5 steps
- Streak increments only for consecutive days
- Milestone celebrations at Days 3, 7, 21, 40
- Calendar shows visual history with marked dates

## 🔔 Notifications

- Daily reminder at user-configured time
- Uses Expo's local notifications
- Notification content: "Time for Morning Darshan - Begin your peaceful morning ritual"
- Repeats daily at set time

## 🛠️ Future Enhancements

### Audio Features (MVP+1)
- [ ] Add pre-recorded temple bells soundscape
- [ ] Add deity-specific chants/mantras
- [ ] Background audio playback during ritual

### Enhanced Features (MVP+2)
- [ ] User authentication & cloud sync
- [ ] Multiple language support (Hindi, English)
- [ ] Custom blessing creation
- [ ] Share streak achievements
- [ ] Meditation timer customization
- [ ] Grace days for missed rituals

### Analytics (MVP+3)
- [ ] Track completion rate
- [ ] Most popular deities
- [ ] Average ritual completion time
- [ ] Retention metrics

## 🐛 Known Limitations

1. **Audio**: Soundscape toggle present but audio files not implemented (placeholders)
2. **Notifications**: Local notifications only (no server-side push)
3. **Offline**: Basic offline support via AsyncStorage (full sync needs cloud)
4. **Images**: Using Unsplash deity images (limited specific deity options)

## 📄 License

This is a devotional app created for spiritual practice and personal growth.

---

**Built with ❤️ for morning devotion and spiritual growth**
