from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    category: str
    brand: Optional[str] = None
    price: float
    available: bool = True

class Product(ProductBase):
    id: int
    class Config:
        from_attributes = True

class ShoppingItemBase(BaseModel):
    product_name: str
    quantity: int = 1

class ShoppingItemCreate(ShoppingItemBase):
    pass

class ShoppingItem(ShoppingItemBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

class VoiceCommand(BaseModel):
    text: str
    language: Optional[str] = "en"

class PhoneNumberRequest(BaseModel):
    phone_number: str

class OTPVerifyRequest(BaseModel):
    phone_number: str
    otp: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: int
