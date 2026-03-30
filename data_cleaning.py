"""
Data cleaning and preprocessing utilities for EFCC convictions data.
"""

import re
import pandas as pd
from typing import Any, Optional


def clean_text(text: str) -> str:
    """
    Clean and standardize text fields.
    Converts to uppercase and strips whitespace.
    
    Args:
        text: Raw text input
        
    Returns:
        Cleaned text in uppercase
    """
    if not isinstance(text, str):
        return ""
    return text.strip().upper()


def clean_monetary_value(value: Any) -> Optional[str]:
    """
    Clean monetary values by removing ₦ symbols, commas, and spaces.
    
    Args:
        value: Raw monetary value (can be string or number)
        
    Returns:
        Cleaned numeric string or None if empty
    """
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return None
    
    if isinstance(value, (int, float)):
        return str(int(value))
    
    if not isinstance(value, str):
        return None
    
    # Remove currency symbols and commas
    cleaned = value.replace("₦", "").replace(",", "").strip()
    
    # Keep only digits
    digits_only = re.sub(r'\D', '', cleaned)
    
    return digits_only if digits_only else None


def parse_prison_term(term: Any) -> tuple[str, Optional[int]]:
    """
    Parse prison term and convert to standardized format and months.
    
    Args:
        term: Raw prison term (e.g., "5 YEARS", "24 MONTHS", "LIFE")
        
    Returns:
        Tuple of (standardized_format: str, months: Optional[int])
    """
    if term is None or (isinstance(term, float) and pd.isna(term)):
        return "NOT SPECIFIED", None
    
    term_str = str(term).strip().upper()
    
    if not term_str or term_str == "":
        return "NOT SPECIFIED", None
    
    # Handle LIFE sentence
    if "LIFE" in term_str:
        return "LIFE", None
    
    # Extract number and unit (e.g., "5 YEARS" -> 5, "YEARS")
    match = re.match(r'(\d+(?:\.\d+)?)\s*(YEAR|MONTH|WEEK|DAY|YR|MO|M|W|D)?S?', term_str)
    
    if not match:
        return term_str, None
    
    value = float(match.group(1))
    unit = match.group(2) if match.group(2) else "YEAR"
    
    # Normalize unit
    unit = unit.upper()
    if unit in ("YR", "YEAR"):
        units_normalized = "YEARS"
        months = int(value * 12)
    elif unit in ("MO", "M", "MONTH"):
        units_normalized = "MONTHS"
        months = int(value)
    elif unit in ("W", "WEEK"):
        units_normalized = "WEEKS"
        months = int(value * 0.25)  # Approximate conversion
    elif unit in ("D", "DAY"):
        units_normalized = "DAYS"
        months = int(value / 30)  # Approximate conversion
    else:
        units_normalized = unit + "S" if not unit.endswith("S") else unit
        months = None
    
    standardized = f"{int(value)} {units_normalized}"
    return standardized, months


def split_defendants(name: str) -> list[str]:
    """
    Split multiple defendants into separate names.
    
    Handles patterns like:
    - "X & ANOR" -> ["X"]
    - "X AND Y" -> ["X", "Y"]
    - "X AND ANOR(S)" -> ["X"]
    
    Args:
        name: Raw defendant name(s)
        
    Returns:
        List of individual defendant names
    """
    if not isinstance(name, str) or not name.strip():
        return []
    
    # Clean the name
    name = name.strip().upper()
    
    # Handle "& ANOR" and "AND ANOR" patterns (means "and another")
    if "&" in name or " AND " in name:
        # Remove " ANOR" and " ANORS" patterns
        name = re.sub(r'\s+AND\s+ANOR(S)?\s*$', '', name)
        name = re.sub(r'\s*&\s*ANOR(S)?\s*$', '', name)
        
        # Now split by & or AND
        parts = re.split(r'\s*&\s*|\s+AND\s+', name)
        
        # Clean and filter each part
        defendants = [part.strip() for part in parts if part.strip()]
        return defendants if defendants else [name]
    
    return [name]


def process_efcc_data(data: list[dict]) -> list[dict]:
    """
    Process raw EFCC conviction records.
    
    Performs:
    - Text cleaning and uppercasing
    - Splitting multiple defendants
    - Monetary value cleaning
    - Prison term standardization
    - Handles missing values
    - Removes duplicates
    
    Args:
        data: List of raw conviction records (dicts)
        
    Returns:
        List of cleaned and processed records
    """
    if not data:
        return []
    
    # Convert to DataFrame for easier processing
    df = pd.DataFrame(data)
    
    processed_records = []
    
    for _, row in df.iterrows():
        # Extract and clean name
        raw_name = row.get('name', '')
        
        # Split if multiple defendants
        defendant_names = split_defendants(raw_name)
        
        if not defendant_names:
            continue
        
        # Clean other fields
        offense = clean_text(row.get('offense', 'UNSPECIFIED'))
        court = clean_text(row.get('court', 'UNSPECIFIED'))
        
        # Parse prison term
        raw_term = row.get('prison_term')
        prison_term, prison_term_months = parse_prison_term(raw_term)
        
        # Clean monetary fields
        fine = clean_monetary_value(row.get('fine'))
        restitution = clean_monetary_value(row.get('restitution'))
        
        # Create a record for each defendant
        for defendant in defendant_names:
            if defendant:
                record = {
                    'name': defendant,
                    'offense': offense,
                    'prison_term': prison_term,
                    'prison_term_months': prison_term_months,
                    'fine': fine,
                    'restitution': restitution,
                    'court': court,
                }
                processed_records.append(record)
    
    # Convert to DataFrame and remove duplicates
    if processed_records:
        df_clean = pd.DataFrame(processed_records)
        df_clean = df_clean.drop_duplicates(subset=['name', 'offense', 'court'], keep='first')
        processed_records = df_clean.to_dict(orient='records')
        
        # Convert NaN values back to None for proper Pydantic validation
        for record in processed_records:
            for key, value in record.items():
                if isinstance(value, float) and pd.isna(value):
                    record[key] = None
    
    return processed_records
