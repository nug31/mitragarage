# Netlify Deployment Script untuk Mitra Garage
# Jalankan script ini setelah install Netlify CLI

Write-Host "🚀 Netlify Deployment Script - Mitra Garage" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan

# Step 1: Check if Netlify CLI is installed
Write-Host "🔍 Checking Netlify CLI..." -ForegroundColor Yellow
try {
    $netlifyVersion = netlify --version
    Write-Host "✅ Netlify CLI installed: $netlifyVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Netlify CLI not found. Installing..." -ForegroundColor Red
    Write-Host "📦 Installing Netlify CLI globally..." -ForegroundColor Yellow
    npm install -g netlify-cli
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Netlify CLI installed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install Netlify CLI" -ForegroundColor Red
        exit 1
    }
}

# Step 2: Build the project
Write-Host "🔨 Building project for production..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Step 3: Login to Netlify (manual step)
Write-Host ""
Write-Host "🔐 Next steps:" -ForegroundColor Yellow
Write-Host "1. Run: netlify login" -ForegroundColor White
Write-Host "2. Run: netlify init" -ForegroundColor White
Write-Host "3. Run: netlify deploy --prod" -ForegroundColor White
Write-Host ""
Write-Host "Or use manual deployment:" -ForegroundColor Yellow
Write-Host "1. Go to https://netlify.com" -ForegroundColor White
Write-Host "2. Drag and drop the 'dist' folder" -ForegroundColor White
Write-Host ""
Write-Host "Environment Variables to set in Netlify:" -ForegroundColor Cyan
Write-Host "VITE_API_URL=https://mitragarage-production.up.railway.app" -ForegroundColor White
Write-Host "VITE_API_BASE_URL=https://mitragarage-production.up.railway.app/api" -ForegroundColor White
Write-Host "VITE_APP_NAME=Mitra Garage" -ForegroundColor White
Write-Host "VITE_APP_VERSION=1.0.0" -ForegroundColor White
Write-Host "NODE_ENV=production" -ForegroundColor White

Write-Host ""
Write-Host "✅ Build ready in 'dist' folder!" -ForegroundColor Green
