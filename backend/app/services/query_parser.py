import re
from decimal import Decimal


def extract_max_price(query: str) -> Decimal | None:
    patterns = [
        r"(?:under|below|less than|max(?:imum)?|up to)\s*\$?\s*(\d+(?:\.\d{1,2})?)",
        r"\$?\s*(\d+(?:\.\d{1,2})?)\s*(?:or less|maximum|max)",
    ]

    lowered_query = query.lower()

    for pattern in patterns:
        match = re.search(pattern, lowered_query)

        if match:
            return Decimal(match.group(1))

    return None
