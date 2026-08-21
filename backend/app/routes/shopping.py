from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import ShoppingItem, Product

router = APIRouter()

@router.get("/")
def get_shopping_list(db: Session = Depends(get_db)):
    items = db.query(ShoppingItem).all()
    
    # Let's categorize them for the frontend
    products = {p.name: p.category for p in db.query(Product).all()}
    
    categorized = {}
    for item in items:
        cat = products.get(item.product_name)
        if not cat:
            name_lower = item.product_name.lower()
            if any(word in name_lower for word in ["cheese", "butter", "yogurt", "cream", "milk"]):
                cat = "Dairy"
            elif any(word in name_lower for word in ["apple", "banana", "tomato", "potato", "onion", "fruit", "veg"]):
                cat = "Produce"
            elif any(word in name_lower for word in ["bread", "bun", "cake", "pastry"]):
                cat = "Bakery"
            elif any(word in name_lower for word in ["soap", "paste", "shampoo", "brush", "wash"]):
                cat = "Personal Care"
            elif any(word in name_lower for word in ["chips", "biscuit", "cookie", "snack"]):
                cat = "Snacks"
            elif any(word in name_lower for word in ["cleaner", "detergent", "paper"]):
                cat = "Household"
            else:
                cat = "Uncategorized"
                
        if cat not in categorized:
            categorized[cat] = []
        categorized[cat].append({
            "id": item.id,
            "name": item.product_name,
            "quantity": item.quantity,
            "status": item.status
        })
        
    return {"items": categorized}

@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(ShoppingItem).filter(ShoppingItem.id == item_id).first()
    if item:
        db.delete(item)
        db.commit()
        return {"message": "Deleted"}
    return {"message": "Not found"}
