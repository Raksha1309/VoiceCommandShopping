from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=True)
    language = Column(String, default="en")
    phone_number = Column(String, unique=True, index=True)
    otp = Column(String, nullable=True)
    otp_expiry = Column(DateTime, nullable=True)

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String, index=True)
    brand = Column(String)
    price = Column(Float)
    available = Column(Boolean, default=True)
    aliases = Column(String, nullable=True)

class ShoppingItem(Base):
    __tablename__ = "shopping_items"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_name = Column(String, index=True)
    quantity = Column(Integer, default=1)
    status = Column(String, default="pending") # pending, purchased
    created_at = Column(DateTime, default=datetime.utcnow)

class ShoppingHistory(Base):
    __tablename__ = "shopping_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_name = Column(String, index=True)
    quantity = Column(Integer)
    purchased_at = Column(DateTime, default=datetime.utcnow)
