import sys
import os
import json
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine, Base
from app.models import Product

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if we already have products
    if db.query(Product).count() > 0:
        print("Database already seeded")
        return
        
    products_path = os.path.join(os.path.dirname(__file__), "../../data/products.json")
    if os.path.exists(products_path):
        with open(products_path, "r") as f:
            products = json.load(f)
            for p in products:
                db_product = Product(
                    id=p["id"],
                    name=p["name"],
                    category=p["category"],
                    brand=p["brand"],
                    price=p["price"],
                    available=p["available"],
                    aliases=",".join(p.get("aliases", []))
                )
                db.add(db_product)
        db.commit()
        print("Database seeded with products")
    else:
        print("products.json not found")

if __name__ == "__main__":
    seed_db()
