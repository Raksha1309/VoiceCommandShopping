import sys
import os
from app.database import SessionLocal
from app.models import Product

db = SessionLocal()

new_products = [
    {"name": "Sanitary Pads", "category": "Personal Care", "brand": "Whisper", "price": 4.5, "available": True},
    {"name": "Regular Milk", "category": "Dairy", "brand": "Local", "price": 2.0, "available": True},
    {"name": "Almond Milk", "category": "Dairy Alternatives", "brand": "Silk", "price": 3.5, "available": True},
    {"name": "White Bread", "category": "Bakery", "brand": "Wonder", "price": 1.5, "available": True},
    {"name": "Whole Wheat Bread", "category": "Bakery", "brand": "Nature's Own", "price": 2.5, "available": True},
    {"name": "Sugar", "category": "Pantry", "brand": "Domino", "price": 2.0, "available": True},
    {"name": "Honey", "category": "Pantry", "brand": "Local", "price": 5.0, "available": True},
    {"name": "Butter", "category": "Dairy", "brand": "Amul", "price": 1.5, "available": True},
    {"name": "Margarine", "category": "Dairy Alternatives", "brand": "Flora", "price": 1.2, "available": True},
    {"name": "Milk", "category": "Dairy", "brand": "Local", "price": 2.0, "available": True},
    # Medical Needs
    {"name": "Hand Sanitizer", "category": "Medical Needs", "brand": "Purell", "price": 3.0, "available": True},
    {"name": "Savlon Antiseptic Liquid", "category": "Medical Needs", "brand": "Savlon", "price": 4.0, "available": True},
    {"name": "Dettol Antiseptic Liquid", "category": "Medical Needs", "brand": "Dettol", "price": 4.5, "available": True},
    {"name": "V Wash Plus", "category": "Medical Needs", "brand": "V Wash", "price": 5.5, "available": True},
    {"name": "Vicks VapoRub", "category": "Medical Needs", "brand": "Vicks", "price": 3.5, "available": True},
    # Personal Care
    {"name": "Veet Hair Removal Wax", "category": "Personal Care", "brand": "Veet", "price": 8.0, "available": True},
    # Food Items (Masalas)
    {"name": "Garam Masala", "category": "Food Items", "brand": "Everest", "price": 2.5, "available": True},
    {"name": "Turmeric Powder", "category": "Food Items", "brand": "MDH", "price": 1.8, "available": True},
    {"name": "Red Chilli Powder", "category": "Food Items", "brand": "Everest", "price": 2.0, "available": True},
    {"name": "Coriander Powder", "category": "Food Items", "brand": "Catch", "price": 1.5, "available": True},
]

added = 0
for p in new_products:
    if not db.query(Product).filter_by(name=p["name"]).first():
        db.add(Product(**p))
        added += 1

db.commit()
print(f"Added {added} new products")
