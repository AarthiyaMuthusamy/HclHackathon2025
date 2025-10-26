from pydantic import BaseModel, EmailStr,Field,constr
from typing import Optional
from uuid import uuid4
import datetime

class UserCreate(BaseModel):
    full_name: str = Field(...,min_length=2)
    email: EmailStr
    phone_number: str= Field(...,min_length=10,max_length=15)
    password: str= Field(...,min_length=6)

class UserResponse(BaseModel):
    id: str
    full_name: str
    email: str
    phone_number: str
    kyc_status: str
    kyc_document_type: Optional[str] = None
    kyc_document_path: Optional[str] = None

class KYCUpload(BaseModel):
    kyc_document_type: str



class Account(BaseModel):
    account_number: str
    user_email: str
    account_type: constr(to_lower=True)  # savings, current, fd
    balance: float
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

class AccountCreate(BaseModel):
    user_email: str
    account_type: constr(to_lower=True)
    initial_deposit: float