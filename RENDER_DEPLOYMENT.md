# Deploying to Render

This guide walks you through deploying your kashfdigitex e-commerce application to Render.

## Prerequisites

1. **GitHub Repository** - Your code is already on GitHub at `https://github.com/saadmehsud313/v0-fabric-e-commerce-ui`
2. **Render Account** - Create a free account at https://render.com
3. **Supabase Project** - You already have this set up with environment variables configured

## Step-by-Step Deployment

### 1. Connect Your GitHub Repository to Render

1. Go to https://dashboard.render.com/
2. Click **"New +"** in the top right
3. Select **"Web Service"**
4. Under "Connect a repository", click **"Connect account"** or select your existing GitHub account
5. Search for and select `v0-fabric-e-commerce-ui`
6. Click **"Connect"**

### 2. Configure Your Web Service

1. **Name**: kashfdigitex-ecommerce (or your preferred name)
2. **Environment**: Node
3. **Region**: Choose closest to your users
4. **Branch**: main
5. **Build Command**: `pnpm install && pnpm run build`
6. **Start Command**: `pnpm start`
7. **Plan**: Free (or Starter/Pro if you need better uptime)

### 3. Add Environment Variables

In the Render dashboard, scroll down to "Environment Variables" and add:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

You can find these values in your Supabase project:
- Go to Settings → API
- Copy the URL and anon key
- For service role key, go to Settings → API → Service Role Key (scroll down)

### 4. Deploy

1. Click **"Create Web Service"**
2. Render will automatically start building your application
3. Watch the build logs in the "Logs" tab
4. Once deployed successfully, you'll see a green "Live" status

Your app will be available at: `https://kashfdigitex-ecommerce.onrender.com`

## Important Notes for Render

### Builds
- **Free plan rebuilds** happen when you push to GitHub
- **Cold starts** may be slower on free tier (first request after inactivity takes a few seconds)
- Build times are typically 2-5 minutes

### Environment
- Render provides Node.js with pnpm pre-installed
- Your app runs in a containerized environment
- Environment variables are injected at runtime

### Custom Domain (Optional)
1. In Render dashboard, go to your service
2. Click **"Settings"** → **"Custom Domain"**
3. Add your domain and follow the DNS configuration instructions

### Monitoring
- Check service health: Dashboard → your service
- View logs: **"Logs"** tab in the service
- Monitor resources: **"Metrics"** tab

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure environment variables are correctly set
- View build logs for specific errors

### Application Won't Start
- Check "Start Command" is correct: `pnpm start`
- Verify environment variables are set
- Check application logs for runtime errors

### Slow Performance
- This is normal on free tier
- Consider upgrading to Starter plan
- Render's free tier has limited resources

## Database Setup on First Deployment

After deployment, you still need to set up your database tables:

1. Go to your Supabase dashboard
2. SQL Editor
3. Run the SQL from `scripts/001_init_schema.sql`
4. Create your admin account using the credentials provided

## Redeploy Your Application

To redeploy after making changes:
1. Push your changes to GitHub
2. Render automatically detects the push and rebuilds
3. New deployment goes live automatically (zero downtime)

## Auto-Deploy from GitHub

Your Render service is configured to auto-deploy whenever you push to the main branch. To prevent auto-deploy, go to service Settings and disable "Auto-Deploy".

## SSL/HTTPS

Render automatically provides free SSL certificates for all domains (including onrender.com subdomains). Your site is secure by default!

## Next Steps

1. Complete the database setup in Supabase (run the schema SQL)
2. Test your application at the deployed URL
3. Create an admin account and test login/checkout flows
4. Monitor the deployment for any issues

For more help: https://render.com/docs
