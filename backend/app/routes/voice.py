from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import VoiceCommand
from ..services.nlp_service import nlp_service
from ..models import ShoppingItem, Product, ShoppingHistory
from fastapi import File, UploadFile
from ..services.audio_service import audio_service

router = APIRouter()

@router.post("/command/audio")
async def process_audio_command(audio: UploadFile = File(...), db: Session = Depends(get_db)):
    # Read the audio bytes
    audio_bytes = await audio.read()
    
    # Use our new audio service to transcribe it
    text = audio_service.transcribe_audio(audio_bytes, audio.filename)
    
    if not text:
        return {
            "intent": "unknown",
            "item": "",
            "quantity": 1,
            "message": "Sorry, I couldn't understand the audio. Please try speaking clearly.",
            "parsed_data": {}
        }
        
    # Now we just reuse the text-based logic
    return _process_text_command(text, db)


@router.post("/command")
def process_voice_command(command: VoiceCommand, db: Session = Depends(get_db)):
    return _process_text_command(command.text, db)


def _process_text_command(text: str, db: Session):
    parsed_data = nlp_service.parse_command(text)
    
    intent = parsed_data.get("intent")
    item_name = parsed_data.get("item")
    quantity = parsed_data.get("quantity")
    
    import difflib

    # We match the item_name to our product database to get canonical name
    products = db.query(Product).all()
    matched_product = None
    item_clean = item_name.lower().strip()
    
    # 1. Exact match on name or aliases
    for p in products:
        if item_clean == p.name.lower():
            matched_product = p
            break
        if p.aliases:
            aliases = [a.strip().lower() for a in p.aliases.split(",")]
            if item_clean in aliases:
                matched_product = p
                break

    # 2. All-words match on name or aliases
    if not matched_product and item_clean:
        item_words = set(item_clean.split())
        best_score = 0
        best_match = None
        for p in products:
            names_to_check = [p.name.lower()]
            if p.aliases:
                names_to_check.extend([a.strip().lower() for a in p.aliases.split(",")])
            
            for name_variant in names_to_check:
                p_words = set(name_variant.split())
                if item_words.issubset(p_words) and len(p_words) > 0:
                    score = len(item_words) / len(p_words)
                    if score > best_score:
                        best_score = score
                        best_match = p
        if best_match:
            matched_product = best_match

    # 3. Fuzzy Match via difflib on names and aliases
    if not matched_product and item_clean:
        name_to_product = {}
        for p in products:
            name_to_product[p.name.lower()] = p
            if p.aliases:
                for a in p.aliases.split(","):
                    name_to_product[a.strip().lower()] = p
        
        all_possible_names = list(name_to_product.keys())
        matches = difflib.get_close_matches(item_clean, all_possible_names, n=1, cutoff=0.6)
        if matches:
            matched_product = name_to_product[matches[0]]
    canonical_name = matched_product.name if matched_product else item_name

    message = f"Processed intent: {intent}"
    
    if intent == "add_item":
        if matched_product and not matched_product.available:
            substitute = db.query(Product).filter(Product.category == matched_product.category, Product.available == True, Product.id != matched_product.id).first()
            if substitute:
                message = f"{matched_product.name} is currently unavailable. Would you like to add {substitute.name} as an alternative?"
            else:
                message = f"Sorry, {matched_product.name} is currently out of stock."
        else:
            # Check for preferred alternatives even if available
            substitutes_map = {
                "milk": "almond milk",
                "regular milk": "almond milk",
                "sugar": "honey",
                "white bread": "whole wheat bread"
            }
            suggestion = ""
            for key, sub in substitutes_map.items():
                if key in canonical_name.lower():
                    suggestion = f" We also suggest trying {sub} as a great alternative."
                    break

            # Add to DB
            new_item = ShoppingItem(user_id=1, product_name=canonical_name, quantity=quantity)
            db.add(new_item)
            db.commit()
            db.refresh(new_item)
            
            # also add to history
            history_item = ShoppingHistory(user_id=1, product_name=canonical_name, quantity=quantity)
            db.add(history_item)
            db.commit()
            
            message = f"Added {quantity} {canonical_name}(s) to your list.{suggestion}"
        
    elif intent == "remove_item":
        item_to_remove = db.query(ShoppingItem).filter(ShoppingItem.product_name.ilike(f"%{canonical_name}%")).first()
        if item_to_remove:
            db.delete(item_to_remove)
            db.commit()
            message = f"Removed {canonical_name} from your list."
        else:
            message = f"{canonical_name} not found in your list."
            
    elif intent == "search":
        message = f"Searching for {canonical_name}..."

    else:
        message = "I didn't understand that command. Try 'Add milk'."

    return {
        "intent": intent,
        "item": canonical_name,
        "quantity": quantity,
        "message": message,
        "parsed_data": parsed_data
    }
