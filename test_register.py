from backend.main import register, UserCreate

# Test the register function
user = UserCreate(username="testuser", email="test@example.com", password="testpass")
try:
    result = register(user)
    print("Success:", result)
except Exception as e:
    print("Error:", e)