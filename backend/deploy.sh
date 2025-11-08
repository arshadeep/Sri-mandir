#!/bin/bash

# Cloud Run Deployment Script for Sri Mandir Backend
# This script helps deploy the FastAPI backend to Google Cloud Run

# Configuration - Update these values
PROJECT_ID="sri-mandir-9a76d"
SERVICE_NAME="sri-mandir-backend"
REGION="us-central1"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

#mongodb
MONGO_URL="mongodb+srv://arshu111as_db_user:AXm8XfUdiG3AH0DP@cluster0.0fslpnp.mongodb.net/?retryWrites=true&w=majority"
DB_NAME="sri_mandir"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting deployment to Cloud Run...${NC}"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Set the project
echo -e "${YELLOW}Setting GCP project...${NC}"
gcloud config set project ${PROJECT_ID}

# Build the container image
echo -e "${YELLOW}Building container image...${NC}"
gcloud builds submit --tag ${IMAGE_NAME}

# Deploy to Cloud Run
echo -e "${YELLOW}Deploying to Cloud Run...${NC}"
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --set-env-vars "MONGO_URL=${MONGO_URL},DB_NAME=${DB_NAME}" \
  --min-instances 0 \
  --max-instances 10 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 300 \
  --port 8080 \
  --cpu-boost

echo -e "${GREEN}Deployment complete!${NC}"
echo -e "${YELLOW}Service URL:${NC}"
gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format 'value(status.url)'
