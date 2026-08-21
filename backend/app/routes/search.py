from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Product

router = APIRouter()

@router.get("/")
def search_products(q: str = "", max_price: float = None, db: Session = Depends(get_db)):
    query = db.query(Product)
    if q:
        query = query.filter(Product.name.ilike(f"%{q}%") | Product.category.ilike(f"%{q}%"))
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
        
    results = query.all()
    return {"results": results}
