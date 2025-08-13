# 🎮 Minecraft Skin Studio - Testing Instructions for Olive

Hey Olive! 👋 Your dad has set up the Minecraft Skin Studio for you to test! Here are two ways you can access it:

## Option 1: Live Development Version (Recommended for Testing)
**This version updates automatically as changes are made**

### On the same computer:
- Open your web browser (Chrome, Firefox, Edge, etc.)
- Go to: `http://localhost:5173`

### From another computer on the same network:
- Open your web browser
- Go to: `http://192.168.2.4:5173`

## Option 2: Production Build (Stable Version)
**If you want to use a more stable version**

1. Open Command Prompt or PowerShell
2. Navigate to: `D:\dev\codex-minecraft-skin-studio\minecraft-skin-studio\`
3. Double-click `start-production.bat` or run it from command line
4. Open browser and go to: `http://localhost:3000` or `http://192.168.2.4:3000`

## 🧪 What to Test

### Primary Test Cases:
1. **Template Selection Test**:
   - Click the "🎨 Templates" button
   - Try selecting different character outfits
   - Verify that:
     - ✅ The canvas updates with the new skin
     - ✅ The 3D model on the right updates to match
     - ✅ You can select multiple different templates in a row

2. **AI Generation Test**:
   - Try the AI assistant to generate a skin
   - Verify the auto-generation works properly

3. **Drawing Tools Test**:
   - Use the pencil, fill, eraser tools
   - Draw on the skin and see if 3D model updates

### Things to Look For:
- ❌ **BUG**: If 3D model doesn't update when you change outfits
- ❌ **BUG**: If canvas doesn't update after first selection
- ✅ **SUCCESS**: Everything updates properly
- ✅ **SUCCESS**: App feels smooth and responsive

## 🐛 Bug Reporting

If you find any issues, tell dad:
1. What you were doing when it broke
2. What you expected to happen
3. What actually happened
4. Any error messages you see

## 🎨 Have Fun!

This is **Production Test #1** - you're the first real user! Create some cool Minecraft skins and let us know how it works!

---

**Tech Details for Dad:**
- Development server running on: `http://192.168.2.4:5173`
- Production build available via: `start-production.bat`
- Console logging enabled for debugging
- Recent fixes applied for template selection and 3D model updates