import json
import os
import sys

# Define categories and products similar to Blinkit
blinkit_catalog = {
    "Vegetables & Fruits": [
        "Onion", "Potato", "Tomato", "Garlic", "Ginger", "Green Chilli", "Lemon",
        "Coriander Leaves", "Mint Leaves", "Cucumber", "Carrot", "Capsicum", "Cauliflower",
        "Cabbage", "Spinach", "Apple", "Banana", "Papaya", "Pomegranate", "Watermelon"
    ],
    "Dairy & Breakfast": [
        "Amul Taaza Milk", "Amul Gold Milk", "Mother Dairy Milk", "Nandini Milk",
        "Amul Butter", "Amul Cheese Slices", "Paneer", "Curd", "Eggs (6 pack)",
        "Britannia Brown Bread", "Harvest White Bread", "Oats", "Corn Flakes", "Muesli"
    ],
    "Munchies": [
        "Lay's Classic Salted", "Lay's Magic Masala", "Kurkure", "Bingo Mad Angles",
        "Haldiram's Bhujia", "Haldiram's Moong Dal", "Doritos", "Pringles",
        "Popcorn", "Roasted Peanuts"
    ],
    "Cold Drinks & Juices": [
        "Coca Cola", "Pepsi", "Sprite", "Thums Up", "Fanta", "Maaza", "Slice",
        "Tropicana Mixed Fruit", "Real Orange Juice", "Red Bull", "Monster Energy"
    ],
    "Instant & Frozen Food": [
        "Maggi 2-Minute Noodles", "Yippee Noodles", "Top Ramen", "McCain French Fries",
        "McCain Smiles", "Saffola Oats", "MTR Poha", "Frozen Green Peas"
    ],
    "Tea, Coffee & Health Drinks": [
        "Brooke Bond Red Label Tea", "Tata Tea Gold", "Taj Mahal Tea",
        "Nescafe Classic Coffee", "Bru Gold Coffee", "Bournvita", "Horlicks", "Complan"
    ],
    "Bakery & Biscuits": [
        "Parle-G", "Britannia Good Day", "Britannia Marie Gold", "Oreo",
        "Hide & Seek", "Dark Fantasy", "Rusk", "Pav", "Burger Buns"
    ],
    "Atta, Rice & Dal": [
        "Aashirvaad Atta", "Fortune Chakki Fresh Atta", "India Gate Basmati Rice",
        "Kohinoor Basmati Rice", "Tata Sampann Toor Dal", "Moong Dal", "Chana Dal", "Urad Dal"
    ],
    "Dry Fruits, Masala & Oil": [
        "Almonds", "Cashews", "Raisins", "Walnuts", "Fortune Sunflower Oil",
        "Saffola Gold Oil", "Mustard Oil", "Everest Garam Masala", "MDH Chana Masala",
        "Catch Turmeric Powder", "Catch Red Chilli Powder", "Catch Coriander Powder", 
        "Everest Cumin Powder", "MDH Meat Masala", "Everest Pav Bhaji Masala",
        "Tata Salt", "Catch Black Pepper"
    ],
    "Personal Care": [
        "Colgate Toothpaste", "Pepsodent", "Oral-B Toothbrush", "Listerine Mouthwash",
        "Dettol Soap", "Dove Soap", "Pears Soap", "Head & Shoulders Shampoo",
        "Pantene Shampoo", "Gillette Mach 3", "Whisper Ultra Clean Pads", "Stayfree Pads",
        "Nivea Body Lotion", "Vaseline", "Veet Wax Strips", "V Wash Plus"
    ],
    "Pharma & Wellness": [
        "Dettol Liquid", "Savlon Liquid", "Hand Sanitizer", "Vicks Vaporub", "Vicks Cough Drops",
        "Band-Aid", "Eno", "Pudin Hara", "Crocin"
    ],
    "Cleaning Essentials": [
        "Surf Excel Matic", "Ariel", "Tide", "Vim Liquid", "Pril",
        "Domex", "Harpic", "Lizol", "Colin", "Comfort Fabric Conditioner",
        "Scotch Brite Scrub Pad", "Garbage Bags"
    ]
}

products = []
product_id = 1

# Generate product entries
for category, items in blinkit_catalog.items():
    for item in items:
        # Generate a mock price (not real, but relative)
        price = 50.0  # Default base price
        if "Milk" in item: price = 30.0
        elif "Atta" in item or "Rice" in item or "Oil" in item: price = 200.0
        elif "Masala" in item or "Salt" in item: price = 40.0
        elif "Tea" in item or "Coffee" in item: price = 150.0
        elif "Soap" in item or "Toothpaste" in item: price = 60.0
        elif "Shampoo" in item: price = 180.0
        elif "Almonds" in item or "Cashews" in item: price = 400.0
        elif "Apple" in item: price = 120.0
        elif "Vegetables" in category: price = 40.0
        
        products.append({
            "id": product_id,
            "name": item,
            "category": category,
            "brand": "Generic" if "Vegetables" in category else item.split()[0], # Naive brand extraction
            "price": price,
            "available": True,
            "aliases": [item.lower(), item.split()[-1].lower()]
        })
        product_id += 1

# Path to data folder
data_path = os.path.join(os.path.dirname(__file__), "../data/products.json")

with open(data_path, "w") as f:
    json.dump(products, f, indent=2)

print(f"Generated {len(products)} Blinkit-like products in products.json")

# Now we need to update the database
from app.database import SessionLocal, engine, Base
from app.models import Product, ShoppingItem, ShoppingHistory

# Drop existing tables and recreate them to clear old data
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

db = SessionLocal()
for p in products:
    db_product = Product(
        id=p["id"],
        name=p["name"],
        category=p["category"],
        brand=p["brand"],
        price=p["price"],
        available=p["available"]
    )
    db.add(db_product)
db.commit()

print("Database cleared and seeded with new Blinkit catalog.")
