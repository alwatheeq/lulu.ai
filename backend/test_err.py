import traceback
import sys
from fastapi.testclient import TestClient
from app.main import app

try:
    c = TestClient(app)
    c.post('/api/users/', json={'email':'testnew@a.com', 'password':'pw', 'role':'user', 'full_name':'test'})
except Exception as e:
    traceback.print_exc()
