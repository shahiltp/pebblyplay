# GitHub Repository Setup Guide

## Step 1: Create Private Repository on GitHub

1. Go to https://github.com/new
2. Fill in the details:
   - **Repository name**: `pebblyplay` (or your preferred name)
   - **Description**: "INR-first toy e-commerce platform built with Next.js 15, Prisma, and Auth.js"
   - **Visibility**: Select **Private** ✅
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
3. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the repo, GitHub will show you commands. Use these:

```bash
# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/pebblyplay.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Or if you prefer SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/pebblyplay.git
git branch -M main
git push -u origin main
```

## Step 3: Manage Repository Access

### Add Collaborators (Give Access):

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Click **Collaborators** in the left sidebar
4. Click **Add people**
5. Enter the GitHub username or email of the person you want to add
6. Choose their permission level:
   - **Read**: Can view code only
   - **Write**: Can push code and create branches
   - **Admin**: Full access (can manage settings)
7. Click **Add [username] to this repository**

### Repository Settings (Private):

- **Private repositories** are only visible to:
  - Repository owner
  - Explicitly added collaborators
  - Organization members (if part of an org)

### Additional Security:

- **Branch Protection**: Settings → Branches → Add rule
- **Secrets**: Settings → Secrets and variables → Actions (for CI/CD)
- **Deploy Keys**: Settings → Deploy keys (for server deployments)

## Step 4: Verify

After pushing, verify:
- ✅ Code is on GitHub
- ✅ Repository is marked as Private
- ✅ You can see all files
- ✅ README.md displays correctly

## Notes

- The `.env` file is already in `.gitignore` (won't be pushed)
- Sensitive credentials stay local
- Collaborators will need to create their own `.env` file
- Consider creating a `.env.example` template for team members
