import os
import re

class NLPService:
    def __init__(self):
        self.add_patterns = [r"add", r"buy", r"need", r"put", r"get", r"bring"]
        self.remove_patterns = [r"remove", r"delete", r"take off", r"drop", r"cancel"]
        self.search_patterns = [r"find", r"search", r"look for", r"where is"]
        
        self.number_mapping = {
            "a": 1, "an": 1, "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
            "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
            "couple": 2, "few": 3, "some": 2, "dozen": 12
        }
        
        self.stop_words = {
            "of", "to", "my", "list", "from", "the", "can", "could", "you", 
            "please", "i", "want", "would", "like", "for", "me", "cart", "basket",
            "bottles", "bottle", "packets", "packet", "kg", "grams", "liters", "liter",
            "pieces", "piece", "boxes", "box", "packs", "pack", "bunch", "gallons", "gallon"
        }

    def parse_command(self, command: str) -> dict:
        command_lower = command.lower()
        
        # 1. Intent Detection
        intent = "unknown"
        if any(re.search(r'\b' + p + r'\b', command_lower) for p in self.search_patterns):
            intent = "search"
        elif any(re.search(r'\b' + p + r'\b', command_lower) for p in self.remove_patterns):
            intent = "remove_item"
        elif any(re.search(r'\b' + p + r'\b', command_lower) for p in self.add_patterns):
            intent = "add_item"
            
        # Tokenize by keeping alphanumeric words
        words = re.findall(r'\b\w+\b', command_lower)
        
        # 2. Basic Entity Extraction
        quantity = 1
        item_words = []
        
        skip_next = False
        for i, word in enumerate(words):
            if skip_next:
                skip_next = False
                continue
                
            # Check quantity
            if word.isdigit():
                quantity = int(word)
                continue
            elif word in self.number_mapping:
                quantity = self.number_mapping[word]
                # if phrase was "a couple of", skip "of"
                if word == "couple" and i + 1 < len(words) and words[i+1] == "of":
                    skip_next = True
                continue
                
            # Filter stop words and intent verbs
            is_intent_verb = any(word == p for p in self.add_patterns + self.remove_patterns + self.search_patterns)
            if word not in self.stop_words and not is_intent_verb:
                item_words.append(word)

        item = " ".join(item_words).strip()
        
        # Simple singularization
        if item.endswith("ies") and len(item) > 3:
            item = item[:-3] + "y"
        elif item.endswith("s") and len(item) > 3 and not item.endswith("ss"):
            item = item[:-1]

        return {
            "intent": intent,
            "item": item,
            "quantity": quantity
        }

nlp_service = NLPService()
