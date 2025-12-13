# 🚀 GitHub Pages Deployment Instructions

This document explains how to enable GitHub Pages for the Find the Flag app.

## ✅ What's Been Done

This PR includes:
1. ✅ GitHub Actions workflow for automated deployment (`.github/workflows/deploy.yml`)
2. ✅ Updated README with deployment information
3. ✅ Base path configuration already set in `vite.config.ts`

## 📋 Required Setup Steps

After merging this PR, you need to configure GitHub Pages in your repository settings:

### Step 1: Merge This PR
1. Review and merge this pull request to the `main` branch

### Step 2: Enable GitHub Pages
1. Go to your repository on GitHub: https://github.com/mvmser/find-the-flag
2. Click on **Settings** (top navigation)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Click **Save** (if there's a save button)

### Step 3: Wait for Deployment
1. Go to the **Actions** tab in your repository
2. You should see a workflow run called "Deploy to GitHub Pages"
3. Wait for it to complete (usually takes 1-2 minutes)
4. Once complete, your app will be live! 🎉

### Step 4: Access Your App
Your app will be accessible at:
**https://mvmser.github.io/find-the-flag/**

You can test it on your phone by visiting this URL!

## 🔄 Future Deployments

Once set up, the app will automatically deploy whenever you push changes to the `main` branch. No manual steps required!

## 🛠️ Manual Deployment (Optional)

If you ever need to manually trigger a deployment:
1. Go to **Actions** tab
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow** button
4. Select the `main` branch
5. Click **Run workflow**

## ❓ Troubleshooting

If the deployment doesn't work:

1. **Check the Actions tab** - Look for error messages in the workflow logs
2. **Verify GitHub Pages is enabled** - Make sure "Source" is set to "GitHub Actions"
3. **Check repository visibility** - Public repositories work best with GitHub Pages
4. **Review permissions** - The workflow needs `pages: write` and `id-token: write` permissions

## 📱 Testing on Mobile

Once deployed, you can:
1. Open your phone's browser
2. Navigate to: https://mvmser.github.io/find-the-flag/
3. Add to home screen for a native app-like experience!

## 🎮 Enjoy!

Your Find the Flag game is now accessible from anywhere! Share the link with friends and family to test their geography knowledge.
