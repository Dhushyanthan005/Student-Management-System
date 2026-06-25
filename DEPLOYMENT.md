# Deployment Guide - EduTrack on Vercel

## ✅ Prerequisites
- MongoDB Atlas IP whitelist set to `0.0.0.0/0` (allow all)
- Vercel account (free): https://vercel.com/signup

## 🚀 Deploy to Vercel

### Method 1: Via Git (Recommended)

1. **Create a Git repository:**
   ```bash
   cd "c:\student management new"
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub:**
   - Create new repo at https://github.com/new
   - Follow the instructions to push your code

3. **Deploy on Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Set **Root Directory** to `frontend`
   - Add environment variables (see below)
   - Click **Deploy**

### Method 2: Via Vercel CLI

1. **Login to Vercel:**
   ```bash
   cd "c:\student management new\frontend"
   npx vercel login
   ```

2. **Deploy:**
   ```bash
   npx vercel
   ```
   - Follow prompts
   - Select "frontend" as root directory
   - Add environment variables after deployment in Vercel dashboard

3. **Deploy to production:**
   ```bash
   npx vercel --prod
   ```

## 🔐 Environment Variables

Add these in Vercel Dashboard → Your Project → Settings → Environment Variables:

```
MONGO_URI=mongodb+srv://Dhushyanthan2004:Dhushyanthan%402004@cluster0.tkqlk7r.mongodb.net/student_management?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_jwt_secret_key_here_make_this_random_and_secure
CLIENT_URL=https://your-app-name.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
NEXT_PUBLIC_API_URL=/api
```

**Important:** 
- Replace `CLIENT_URL` with your actual Vercel URL after first deployment
- Generate a strong JWT_SECRET (e.g., use https://randomkeygen.com/)
- For email to work, enable "2-Step Verification" in Google and generate an App Password

## 📝 Post-Deployment

1. **Create Admin Account:**
   - Visit https://your-app.vercel.app/register
   - Click "🛡️ Admin" tab
   - Create your admin account

2. **Login:**
   - Go to https://your-app.vercel.app/login
   - Use your admin credentials

3. **Add Faculty:**
   - Navigate to Admin Dashboard → Faculty
   - Click "Add Faculty"
   - Faculty will receive setup email (if EMAIL config is set)

## ⚡ Local Development

Run the Next.js app locally:
```bash
cd "c:\student management new\frontend"
npm run dev
```

Access at http://localhost:3000

## 🔧 Troubleshooting

**MongoDB connection fails:**
- Ensure Atlas Network Access allows `0.0.0.0/0`
- Verify MONGO_URI in Vercel environment variables

**Login fails:**
- Check JWT_SECRET is set in Vercel
- Clear browser localStorage and try again

**Email not sending:**
- Optional feature - faculty can still be created without email
- Check Gmail App Password is correct

## 🎉 Done!

Your Student Management System is now live on Vercel with:
- ✅ MongoDB Atlas backend
- ✅ Next.js serverless API routes
- ✅ Secure authentication
- ✅ Admin, Faculty, and Student roles
