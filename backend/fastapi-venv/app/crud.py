from app.config import users_collection,account_collection
from passlib.context import CryptContext
from app.models import Account, AccountCreate
from uuid import uuid4
from bson.objectid import ObjectId
import random
import string
from fastapi import HTTPException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    password_bytes = password.encode("utf-8")[:72]  # truncate safely
    return pwd_context.hash(password_bytes)


def create_user(user_data: dict):
    # Check if email already exists
    existing_user = users_collection.find_one({"email": {"$regex": f"^{user_data['email']}$", "$options": "i"}})
    if existing_user:
        return None
    
    user = {
        "id": str(uuid4()),
        "full_name": user_data["full_name"],
        "email": user_data["email"],
        "phone_number": user_data["phone_number"],
        "password_hash": hash_password(user_data["password"]),
        "kyc_status": "pending",
        "kyc_document_type": None,
        "kyc_document_path": None,
    }
    users_collection.insert_one(user)
    return user

def get_user_by_email(email: str):
    return users_collection.find_one({"email": {"$regex": f"^{email}$", "$options": "i"}})

def get_user_by_name(full_name: str):
    # Case-insensitive search
    return users_collection.find_one({"full_name": {"$regex": f"^{full_name}$", "$options": "i"}})


def update_kyc(user_id: str, kyc_type: str, file_path: str):
    result = users_collection.update_one(
        {"id": user_id},
        {"$set": {
            "kyc_status": "uploaded",
            "kyc_document_type": kyc_type,
            "kyc_document_path": file_path
        }}
    )
    if result.matched_count == 0:
        return None
    user = users_collection.find_one({"id": user_id}, {"_id": 0})
    return user

def update_kyc_by_email(email: str, kyc_document_type: str, file_path: str):
    
    # Update the user record
    result = users_collection.update_one(
        {"email": {"$regex": f"^{email}$", "$options": "i"}},  # Case-insensitive match
        {"$set": {
            "kyc_status": "uploaded",
            "kyc_document_type": kyc_document_type,
            "kyc_document_path": file_path
        }}
    )

    if result.matched_count == 0:
        return None  # No user found

    # Return the updated document
    updated_user = users_collection.find_one(
        {"email": {"$regex": f"^{email}$", "$options": "i"}}
    )
    return updated_user    



async def generate_account_number() -> str:
    """Generate a unique 10-digit account number"""
    while True:
        acc_num = ''.join(random.choices(string.digits, k=10))
        existing = await account_collection.find_one({"account_number": acc_num})
        if not existing:
            return acc_num

async def create_account(account_data: AccountCreate) -> dict:
    # Validate initial deposit based on account type
    min_deposit = {"savings": 500, "current": 1000, "fd": 5000}
    if account_data.initial_deposit < min_deposit.get(account_data.account_type, 0):
        raise HTTPException(
            status_code=400,
            detail=f"Initial deposit for {account_data.account_type} must be at least {min_deposit[account_data.account_type]}"
        )

    account_number = await generate_account_number()
    account = Account(
        account_number=account_number,
        user_email=account_data.user_email,
        account_type=account_data.account_type,
        balance=account_data.initial_deposit
    )
    await account_collection.insert_one(account.dict())
    return account.dict()

async def get_accounts_by_user(email: str) -> list:
    accounts = []
    cursor = account_collection.find({"user_email": email})
    async for acc in cursor:
        acc["_id"] = str(acc["_id"])
        accounts.append(acc)
    return accounts

async def get_account_by_number(account_number: str) -> dict:
    account = await account_collection.find_one({"account_number": str(account_number)})
    if account:
        account["_id"] = str(account["_id"])
        return account
    return None