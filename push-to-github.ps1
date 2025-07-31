# Script untuk push ke GitHub
# Ganti URL_REPOSITORY_ANDA dengan URL GitHub repository yang baru dibuat

Write-Host "🚀 Pushing Mitra Garage to GitHub..." -ForegroundColor Green

# Contoh URL (ganti dengan URL repository Anda):
# $GITHUB_URL = "https://github.com/username/mitra-garage.git"

Write-Host "📝 Langkah-langkah:" -ForegroundColor Yellow
Write-Host "1. Buat repository baru di GitHub dengan nama 'mitra-garage'" -ForegroundColor White
Write-Host "2. Copy URL repository (https://github.com/username/mitra-garage.git)" -ForegroundColor White
Write-Host "3. Jalankan command berikut:" -ForegroundColor White
Write-Host ""
Write-Host "git remote add origin https://github.com/USERNAME/mitra-garage.git" -ForegroundColor Cyan
Write-Host "git branch -M main" -ForegroundColor Cyan
Write-Host "git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ganti USERNAME dengan username GitHub Anda" -ForegroundColor Yellow

# Uncomment dan edit baris di bawah setelah membuat repository GitHub:
# git remote add origin https://github.com/USERNAME/mitra-garage.git
# git branch -M main  
# git push -u origin main

Write-Host ""
Write-Host "✅ Repository sudah di-commit dan siap untuk push!" -ForegroundColor Green
Write-Host "📊 Total: 75 files, 19,737 lines of code" -ForegroundColor Cyan
