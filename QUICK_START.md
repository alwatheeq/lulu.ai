# Quick Start - Claude AI Scanner

## 3-Step Setup

### 1. Get API Key
→ Visit: https://console.anthropic.com/
→ Create account & generate API key

### 2. Configure Backend
```bash
cd backend
# Edit .env file and add your key:
ANTHROPIC_API_KEY=sk-ant-api03-YOUR-KEY-HERE

pip install -r requirements.txt
python main.py
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
```

## Test It!
1. Open http://localhost:5173
2. Go to Scanner page
3. Upload food photo
4. Get instant nutrition analysis!

## Endpoints
- Scanner: `POST http://localhost:8000/scan/nano`
- Chat: `POST http://localhost:8000/chat`

## Cost
~$0.005 per food scan (half a cent)

---
See CLAUDE_SETUP.md for detailed documentation
