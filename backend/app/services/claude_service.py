import httpx
import json
import base64
from app.core.config import settings
import re

ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"
MODEL_NAME = "claude-3-haiku-20240307"

NANO_PROMPT = """
You are a 'Nano Scanner' for food, a highly advanced nutritionist AI.
Analyze this meal image with extreme precision.
Identify every visible ingredient and estimate its portion size.
Provide a detailed nutritional breakdown including:
1. Total Calories
2. Macronutrients (Protein, Carbs, Fats) in grams
3. Micronutrients (Vitamins, Minerals) if significant
4. A list of ingredients detected.
5. A brief, 1-sentence health tip.

Return the response strictly as a JSON object with this structure:
{
    "name": "Food Name",
    "calories": 0,
    "macros": {
        "protein": 0,
        "carbs": 0,
        "fats": 0
    },
    "ingredients": [
        {"name": "Ingredient 1", "amount": "approx quantity"}
    ],
    "micronutrients": ["Vitamin A", "Iron"],
    "health_tip": "..."
}
"""

CHAT_PROMPT = """
You are Lulu, a warm, motivating, and highly knowledgeable wellness coach.
Your goal is to help the user with nutrition, workouts, and mental well-being.
Keep your answers concise (under 3 sentences unless asked for a plan), encouraging, and actionable.
Use emojis sparingly but effectively.
"""

def get_media_type(image_bytes: bytes) -> str:
    if image_bytes.startswith(b'\xff\xd8'): return 'image/jpeg'
    elif image_bytes.startswith(b'\x89PNG\r\n\x1a\n'): return 'image/png'
    elif image_bytes.startswith(b'GIF87a') or image_bytes.startswith(b'GIF89a'): return 'image/gif'
    elif image_bytes[8:12] == b'WEBP': return 'image/webp'
    return 'image/jpeg'

async def analyze_food_image(image_bytes: bytes):
    try:
        media_type = get_media_type(image_bytes)
        base64_image = base64.b64encode(image_bytes).decode('utf-8')
        
        headers = {
            "x-api-key": settings.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
        
        payload = {
            "model": MODEL_NAME,
            "max_tokens": 1000,
            "system": NANO_PROMPT,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type,
                                "data": base64_image
                            }
                        },
                        {
                            "type": "text", 
                            "text": "Analyze the nutritional content of this food image. Return only the JSON."
                        }
                    ]
                }
            ]
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(ANTHROPIC_URL, headers=headers, json=payload, timeout=30.0)
            
            if response.status_code != 200:
                print(f"Anthropic API Error: {response.text}")
                raise Exception(f"API Error {response.status_code}")
                
            data = response.json()
            text = data.get("content", [{}])[0].get("text", "")
            
            clean = text.replace("```json", "").replace("```", "").strip()
            
            if '{' in clean and '}' in clean:
                start = clean.find('{')
                end = clean.rfind('}') + 1
                clean = clean[start:end]
                
            return json.loads(clean)
            
    except Exception as e:
        print(f"Anthropic Analysis Error: {str(e)}")
        raise Exception(f"AI Analysis Failed: {str(e)}")

async def chat_with_lulu(message: str, history: list = []):
    try:
        headers = {
            "x-api-key": settings.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
        
        payload = {
            "model": MODEL_NAME,
            "max_tokens": 300,
            "system": CHAT_PROMPT,
            "messages": [{"role": "user", "content": message}]
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(ANTHROPIC_URL, headers=headers, json=payload, timeout=20.0)
            if response.status_code == 200:
                data = response.json()
                return data.get("content", [{}])[0].get("text", "")
            return "I'm having a little trouble connecting to my brain right now. 🧠💤 Let's try again in a moment!"
            
    except Exception as e:
        print(f"Anthropic Chat Error: {str(e)}")
        return "I'm having a little trouble connecting to my brain right now. 🧠💤 Let's try again in a moment!"

async def ask_claude(prompt: str, max_tokens: int = 4000):
    try:
        headers = {
            "x-api-key": settings.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
        payload = {
            "model": MODEL_NAME,
            "max_tokens": max_tokens,
            "messages": [{"role": "user", "content": prompt}]
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(ANTHROPIC_URL, headers=headers, json=payload, timeout=40.0)
            if response.status_code == 200:
                data = response.json()
                return data.get("content", [{}])[0].get("text", "")
            raise Exception(f"API Error {response.status_code}")
    except Exception as e:
        raise Exception(f"Claude Ask Error: {str(e)}")
