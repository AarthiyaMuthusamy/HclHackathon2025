from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.models import UserCreate, UserResponse,AccountCreate
from app.crud import create_user, get_user_by_email,get_user_by_name,update_kyc_by_email,create_account, get_accounts_by_user, get_account_by_number,generate_account_number
from app.config import users_collection,account_collection
import os
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from bson import ObjectId
import datetime


router = APIRouter()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate):
    try:
        new_user = create_user(user.dict())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    if new_user is None:
        raise HTTPException(status_code=400, detail="Email already Registered")

    return new_user


  
@router.post("/upload-kyc", response_model=UserResponse)
async def upload_kyc(email: str = Form(...), kyc_document_type: str = Form(...), file: UploadFile = File(...)):
    # Find user by email
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Save file
    file_location = os.path.join(UPLOAD_FOLDER, f"{user['id']}_{file.filename}")
    with open(file_location, "wb") as f:
        f.write(await file.read())
    
    # Update MongoDB
    updated_user = update_kyc_by_email(email, kyc_document_type, file_location)
    return updated_user

  
    
   
@router.post("/accounts/")
async def open_account(account_data: AccountCreate):
    new_account_number = await generate_account_number()
    account_doc = {
        "account_number": new_account_number,
        "user_email": account_data.user_email,
        "account_type": account_data.account_type,
        "balance": account_data.initial_deposit,
        "created_at": datetime.datetime.utcnow()
    }
    await account_collection.insert_one(account_doc)
    return {"account_number": new_account_number} 

@router.get("/accounts/{email}")
async def user_accounts(email: str):
    accounts = await get_accounts_by_user(email)
    return {"accounts": accounts}

@router.get("/account/{account_number}")
async def account_details(account_number: str):
    account = await account_collection.find_one({"account_number": account_number})
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    # Convert MongoDB types to JSON-friendly
    account["_id"] = str(account["_id"])
    account["created_at"] = account["created_at"].isoformat()
    return account