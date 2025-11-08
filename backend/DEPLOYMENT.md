# Deploying Sri Mandir Backend to Google Cloud Run

This guide will help you deploy the FastAPI backend to Google Cloud Run.

## Prerequisites

1. **Google Cloud Account**: Create one at [cloud.google.com](https://cloud.google.com)
2. **Google Cloud SDK**: Install from [cloud.google.com/sdk](https://cloud.google.com/sdk/docs/install)
3. **Docker** (optional): For local testing

## Step 1: Setup Google Cloud Project

```bash
# Install gcloud CLI if not already installed
# Follow: https://cloud.google.com/sdk/docs/install

# Login to Google Cloud
gcloud auth login

# Create a new project (or use existing)
gcloud projects create YOUR_PROJECT_ID --name="Sri Mandir"

# Set the project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

## Step 2: Configure Environment Variables

You'll need to set these environment variables in Cloud Run:
- `MONGO_URL`: Your MongoDB connection string
- `DB_NAME`: Your database name (default: sri_mandir)

## Step 3: Deploy Using gcloud CLI

### Option A: Quick Deploy (Recommended)

```bash
# Navigate to backend directory
cd backend

# Deploy directly (gcloud will build and deploy)
gcloud run deploy sri-mandir-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MONGO_URL="your-mongodb-url",DB_NAME="sri_mandir" \
  --min-instances 0 \
  --max-instances 10 \
  --memory 512Mi \
  --cpu 1
```

### Option B: Build Then Deploy

```bash
# Set variables
export PROJECT_ID="your-gcp-project-id"
export SERVICE_NAME="sri-mandir-backend"
export REGION="us-central1"

# Build the container
gcloud builds submit --tag gcr.io/${PROJECT_ID}/${SERVICE_NAME}

# Deploy to Cloud Run
gcloud run deploy ${SERVICE_NAME} \
  --image gcr.io/${PROJECT_ID}/${SERVICE_NAME} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --set-env-vars MONGO_URL="your-mongodb-url",DB_NAME="sri_mandir" \
  --min-instances 0 \
  --max-instances 10 \
  --memory 512Mi \
  --cpu 1
```

### Option C: Using the Deployment Script

```bash
# Edit deploy.sh and update the configuration variables
# - PROJECT_ID
# - MONGO_URL (set as environment variable before running)
# - DB_NAME (set as environment variable before running)

# Make script executable
chmod +x deploy.sh

# Export environment variables
export MONGO_URL="your-mongodb-connection-string"
export DB_NAME="sri_mandir"

# Run deployment
./deploy.sh
```

## Step 4: Configure Environment Variables via Console

Alternatively, you can set environment variables through the GCP Console:

1. Go to [Cloud Run Console](https://console.cloud.google.com/run)
2. Click on your service
3. Click "Edit & Deploy New Revision"
4. Go to "Variables & Secrets" tab
5. Add environment variables:
   - `MONGO_URL`: Your MongoDB connection string
   - `DB_NAME`: sri_mandir
6. Click "Deploy"

## Step 5: Test Your Deployment

```bash
# Get your service URL
gcloud run services describe sri-mandir-backend \
  --region us-central1 \
  --format 'value(status.url)'

# Test the API
curl https://your-service-url/api/health
```

## Important Security Notes

1. **Environment Variables**: Never commit `.env` files with sensitive data
2. **MongoDB Access**: Ensure your MongoDB cluster allows connections from Cloud Run IPs
3. **CORS**: Update CORS settings in `server.py` if needed for production
4. **Authentication**: Consider adding authentication for production use

## MongoDB Atlas Configuration

If using MongoDB Atlas:

1. Go to your MongoDB Atlas cluster
2. Click "Network Access"
3. Click "Add IP Address"
4. Click "Allow Access from Anywhere" (0.0.0.0/0) for Cloud Run
   - Or whitelist specific Cloud Run IP ranges for your region

## Cost Considerations

Cloud Run pricing:
- **Free Tier**: 2 million requests/month
- **Pay per use**: Only charged when handling requests
- **Recommended settings**:
  - Min instances: 0 (no cost when idle)
  - Max instances: 10 (adjust based on needs)
  - Memory: 512Mi (can increase if needed)
  - CPU: 1 (sufficient for most use cases)

## Continuous Deployment (Optional)

Set up automatic deployments from GitHub:

1. Connect your repository to Cloud Build
2. Create a trigger for the main branch
3. Use `cloudbuild.yaml` for build configuration

```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/sri-mandir-backend', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/sri-mandir-backend']
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'sri-mandir-backend'
      - '--image'
      - 'gcr.io/$PROJECT_ID/sri-mandir-backend'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
```

## Monitoring and Logs

View logs:
```bash
gcloud run services logs read sri-mandir-backend --region us-central1
```

Or use the [Cloud Console](https://console.cloud.google.com/run) to view logs and metrics.

## Troubleshooting

**Issue: Build fails**
- Check Dockerfile syntax
- Ensure all dependencies are in requirements.txt

**Issue: Service crashes on startup**
- Check environment variables are set correctly
- View logs: `gcloud run services logs read sri-mandir-backend`

**Issue: Can't connect to MongoDB**
- Verify MongoDB Atlas network access settings
- Check MONGO_URL format is correct

**Issue: CORS errors**
- Update CORS configuration in server.py
- Add your frontend domain to allowed origins

## Updating the Service

To deploy updates:

```bash
# Option 1: Quick update
gcloud run deploy sri-mandir-backend --source .

# Option 2: Build new image and deploy
gcloud builds submit --tag gcr.io/${PROJECT_ID}/sri-mandir-backend
gcloud run deploy sri-mandir-backend --image gcr.io/${PROJECT_ID}/sri-mandir-backend
```

## Connecting Frontend

Update your frontend environment variable:
```env
EXPO_PUBLIC_BACKEND_URL=https://your-service-url
```

Replace `your-service-url` with the URL from Cloud Run.
