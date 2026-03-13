FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for psycopg2 and gunicorn
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first for better caching
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend source code
COPY backend/ .

# Ensure the app runs on the port assigned by Railway
ENV PORT 8000

# Start the application using Gunicorn
CMD ["sh", "-c", "gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app -b 0.0.0.0:$PORT"]
