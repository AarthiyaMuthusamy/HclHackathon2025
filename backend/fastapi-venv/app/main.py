from fastapi import FastAPI
from app.routes import users
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="User Registration & KYC Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],          # or ["*"] to allow all
    allow_credentials=True,
    allow_methods=["*"],            # GET, POST, PUT, DELETE, OPTIONS
    allow_headers=["*"],
)
app.include_router(users.router, prefix="/users", tags=["Users"])

@app.get("/")
def root():
    return {"message": "User Registration & KYC Service running"}
