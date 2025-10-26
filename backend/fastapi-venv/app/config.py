# app/config.py
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_DETAILS = "mongodb://localhost:27017"
DATABASE_NAME = "auth_kyc_db"

# Connect to MongoDB
client = AsyncIOMotorClient(MONGO_DETAILS)
db = client[DATABASE_NAME]   


# Collections
users_collection = db.get_collection("users")
account_collection = db.get_collection("accounts")  # ✅ no NoneType now
