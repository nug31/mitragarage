# Deployment Script for Mitra Garage
# PowerShell script to prepare for deployment

Write-Host "🚀 Preparing Mitra Garage for Deployment..." -ForegroundColor Green

# Step 1: Clean previous builds
Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "✅ Cleaned dist folder" -ForegroundColor Green
}

# Step 2: Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Step 3: Build for production
Write-Host "🔨 Building for production..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Step 4: Check build output
Write-Host "📊 Build output:" -ForegroundColor Yellow
if (Test-Path "dist") {
    Get-ChildItem "dist" -Recurse | Measure-Object -Property Length -Sum | ForEach-Object {
        $size = [math]::Round($_.Sum / 1MB, 2)
        Write-Host "   Total size: $size MB" -ForegroundColor Cyan
    }
    Write-Host "✅ Build files ready in 'dist' folder" -ForegroundColor Green
} else {
    Write-Host "❌ Build folder not found" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Deployment preparation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Deploy backend to Railway with database credentials" -ForegroundColor White
Write-Host "2. Get Railway backend URL" -ForegroundColor White
Write-Host "3. Update VITE_API_URL in Netlify environment variables" -ForegroundColor White
Write-Host "4. Deploy frontend to Netlify from this repository" -ForegroundColor White
Write-Host ""
Write-Host "📖 See DEPLOYMENT.md for detailed instructions" -ForegroundColor Cyan
