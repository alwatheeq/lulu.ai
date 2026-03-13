# Claude AI Integration Setup Guide

## Overview
Your lulu.ai project now uses **Claude 3.5 Sonnet** for AI-powered food image analysis. The integration is complete and ready to use!

## Features
- **AI Calorie Scanner**: Upload food photos for instant macro analysis
- **Coach Lulu**: AI-powered chat assistant for health advice
- Advanced nutritional breakdown with ingredients detection

## Quick Start

### 1. Get Your Claude API Key

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to **API Keys** section
4. Click **Create Key**
5. Copy your API key (starts with `sk-ant-...`)

### 2. Configure Backend

Navigate to the backend directory:
```bash
cd "C:\Users\ASUS\OneDrive\Attachments\Desktop\lulu.ai\backend"
```

Edit the `.env` file and add your API key:
```env
DATABASE_URL=sqlite:///./sql_app.db
SECRET_KEY=YOUR_SUPER_SECRET_KEY_123

ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
```

**IMPORTANT**: Replace `sk-ant-api03-your-actual-key-here` with your actual Claude API key!

### 3. Install Dependencies

Install the Python packages (including the Anthropic SDK):
```bash
pip install -r requirements.txt
```

### 4. Start the Backend

```bash
python main.py
```

The backend will start on `http://localhost:8000`

### 5. Start the Frontend

Open a new terminal and navigate to the frontend:
```bash
cd "C:\Users\ASUS\OneDrive\Attachments\Desktop\lulu.ai\frontend"
npm run dev
```

The frontend will start on `http://localhost:5173`

### 6. Test the Scanner

1. Open your browser to `http://localhost:5173`
2. Navigate to the **Scanner** page
3. Upload a food image
4. Click **Reveal Nutrition**
5. Claude AI will analyze the image and return:
   - Calories
   - Macros (Protein, Carbs, Fats)
   - Detected ingredients
   - Health tips

## API Endpoints

### Scanner Endpoints

#### Option 1: Simple Scan (Currently Used)
```
POST http://localhost:8000/scan/nano
```
- No authentication required
- Accepts: multipart/form-data with 'file' field
- Returns: JSON with nutrition data

#### Option 2: Authenticated Scan (New - More Secure)
```
POST http://localhost:8000/api/meals/scan
```
- Requires authentication token
- Accepts: multipart/form-data with 'file' field
- Validates file type and size (max 5MB)
- Returns: `{ "success": true, "data": {...} }`

### Chat Endpoint
```
POST http://localhost:8000/chat
Body: { "message": "your question" }
```
- Chat with Lulu AI coach
- Get personalized health advice

## Response Format

The Claude AI scanner returns data in this format:

```json
{
  "name": "Grilled Chicken Salad",
  "calories": 450,
  "macros": {
    "protein": 35,
    "carbs": 25,
    "fats": 18
  },
  "ingredients": [
    {"name": "Chicken breast", "amount": "~150g"},
    {"name": "Mixed greens", "amount": "~100g"},
    {"name": "Olive oil", "amount": "~1 tbsp"}
  ],
  "micronutrients": ["Vitamin A", "Iron", "Vitamin C"],
  "health_tip": "Great protein source! Add more colorful veggies for extra antioxidants."
}
```

## File Structure

```
backend/
├── app/
│   ├── services/
│   │   └── claude_service.py      # Claude AI integration
│   ├── api/
│   │   └── meals.py                # Meal endpoints (includes /scan)
│   └── core/
│       └── config.py               # Configuration settings
├── .env                            # API keys (DO NOT COMMIT!)
└── requirements.txt                # Python dependencies
```

## Troubleshooting

### "ANTHROPIC_API_KEY" not found
- Make sure you've added your API key to the `.env` file
- Restart the backend server after updating `.env`

### "Invalid API key"
- Verify your key is correct (starts with `sk-ant-`)
- Check you have credits available in your Anthropic account

### "Failed to analyze image"
- Ensure image is under 5MB
- Supported formats: JPEG, PNG, GIF, WEBP
- Check backend logs for detailed error messages

### Backend won't start
```bash
# Reinstall dependencies
pip install -r requirements.txt

# Check Python version (requires 3.9+)
python --version
```

## Pricing & Usage

Claude API pricing (as of 2024):
- **Claude 3.5 Sonnet**: ~$3 per million input tokens, ~$15 per million output tokens
- Each food scan uses approximately:
  - Image: ~1,000 tokens
  - Response: ~300 tokens
  - **Cost per scan**: ~$0.005 (half a cent)

Track your usage at: [console.anthropic.com](https://console.anthropic.com/settings/usage)

## Security Best Practices

1. **Never commit `.env` file** to version control
2. Add `.env` to `.gitignore`:
   ```
   # .gitignore
   .env
   *.pyc
   __pycache__/
   ```
3. Use environment variables in production
4. Rotate API keys regularly
5. Set spending limits in Anthropic Console

## Next Steps

- **Improve Prompts**: Edit `NANO_PROMPT` in `claude_service.py` to customize analysis
- **Add Authentication**: Use the `/api/meals/scan` endpoint for authenticated users
- **Save to Database**: Automatically save scanned meals to user's daily log
- **Batch Analysis**: Allow multiple image uploads at once
- **Voice Mode**: Integrate with speech-to-text for meal logging

## Support

- **Claude API Docs**: https://docs.anthropic.com/
- **Lulu.ai Issues**: Check your project README
- **Claude Console**: https://console.anthropic.com/

---

**Ready to scan!** Upload a food photo and let Claude AI do the magic! 🍽️✨
