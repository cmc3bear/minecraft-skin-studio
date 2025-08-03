#!/bin/bash

# Minecraft Skin Studio - Deployment Script

echo "🚀 Minecraft Skin Studio Deployment Helper"
echo "========================================"

# Check if git remote exists
if git remote get-url origin > /dev/null 2>&1; then
    echo "✅ Git remote 'origin' already configured"
    git remote -v
else
    echo "⚠️  No git remote found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/minecraft-skin-studio.git"
    exit 1
fi

echo ""
echo "📦 Building production bundle..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📊 Build Stats:"
    du -sh dist/
    echo ""
    echo "🎯 Next Steps:"
    echo "1. Push to GitHub: git push -u origin master"
    echo "2. Deploy to hosting:"
    echo "   - Vercel: npx vercel --prod"
    echo "   - Netlify: Drag 'dist' folder to netlify.app"
    echo "   - GitHub Pages: Use gh-pages branch"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi