from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import ShoppingHistory, ShoppingItem, Product
import json
import datetime
import random

router = APIRouter()

@router.get("/")
def get_recommendations(db: Session = Depends(get_db)):
    # 1. Frequently purchased (History)
    # Count how many times each product was bought
    frequent = db.query(ShoppingHistory.product_name, func.count(ShoppingHistory.product_name).label('total'))\
        .group_by(ShoppingHistory.product_name)\
        .order_by(func.count(ShoppingHistory.product_name).desc())\
        .all()
        
    # Get current items in the cart
    current_cart_items = [item.product_name for item in db.query(ShoppingItem.product_name).all()]
    
    history_recs = []
    
    for f in frequent:
        is_in_cart = f.product_name in current_cart_items
        if f.total >= 2 and not is_in_cart:
            history_recs.append({
                "name": f.product_name, 
                "reason": "running_low",
                "message": f"It looks like you're running low on {f.product_name}"
            })
        elif not is_in_cart:
            history_recs.append({
                "name": f.product_name, 
                "reason": "history",
                "message": "Based on your previous shopping history"
            })
            
    # Limit to top 5 combined history/running_low
    history_recs = history_recs[:5]
    
    # 2. Seasonal (Mocking "Autumn")
    seasonal_recs = []
    current_month = datetime.datetime.now().month
    # Naive season mapping
    if 3 <= current_month <= 5:
        active_season = "Spring"
    elif 6 <= current_month <= 8:
        active_season = "Summer"
    elif 9 <= current_month <= 11:
        active_season = "Autumn"
    else:
        active_season = "Winter"
        
    try:
        with open("../data/seasonal_products.json", "r") as f:
            seasonal_data = json.load(f)
            season_products = next((s["products"] for s in seasonal_data if s["season"] == active_season), [])
            # Filter out things already in cart
            season_products = [p for p in season_products if p not in current_cart_items]
            
            seasonal_recs = [{
                "name": p, 
                "reason": "seasonal",
                "message": f"In season for {active_season}"
            } for p in season_products[:3]]
    except:
        pass
        
    # 3. On Sale Recommendations
    on_sale_products = ["Bread", "Eggs", "Apples", "Milk", "Coffee"]
    sale_recs = []
    # randomly select 2 products to be on sale
    random.shuffle(on_sale_products)
    for p in on_sale_products:
        if p not in current_cart_items:
            sale_recs.append({
                "name": p,
                "reason": "on_sale",
                "message": f"{p} is currently on sale!"
            })
    sale_recs = sale_recs[:2]
    
    # 4. Substitutes
    substitutes_map = {
        "Milk": "Almond Milk",
        "Regular Milk": "Almond Milk",
        "Sugar": "Honey",
        "White Bread": "Whole Wheat Bread",
        "Butter": "Margarine"
    }
    substitute_recs = []
    for item in current_cart_items:
        for key, sub in substitutes_map.items():
            if key.lower() in item.lower():
                if sub not in current_cart_items:
                    substitute_recs.append({
                        "name": sub,
                        "reason": "substitute",
                        "message": f"Since you have {item}, you might prefer {sub} as a substitute."
                    })

    return {
        "history": history_recs,
        "seasonal": seasonal_recs,
        "on_sale": sale_recs,
        "substitutes": substitute_recs
    }
