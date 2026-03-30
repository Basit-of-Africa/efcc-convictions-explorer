"""
Update efcc_convictions.csv with cleaned data from efcc_convictions_merge.csv
"""

import pandas as pd
from data_cleaning import process_efcc_data


def parse_sentence(sentence):
    """
    Parse sentence string to extract prison term and fine.
    Format: "10 YEARS/10,000" or "1 YEAR/300,000" or just "300000"
    """
    prison_term = None
    fine = None
    
    if pd.isna(sentence) or sentence is None:
        return prison_term, fine
    
    sentence_str = str(sentence).strip()
    
    if not sentence_str:
        return prison_term, fine
    
    # Check if there's a "/" separator
    if "/" in sentence_str:
        parts = sentence_str.split("/")
        prison_term = parts[0].strip() if parts[0].strip() else None
        fine = parts[1].strip() if len(parts) > 1 and parts[1].strip() else None
    else:
        # If no separator, try to determine if it's a prison term or fine
        # Prison terms usually contain YEAR/MONTH/DAY, fines are just numbers
        if any(unit in sentence_str.upper() for unit in ["YEAR", "MONTH", "DAY", "WEEK", "YR", "MO"]):
            prison_term = sentence_str
        else:
            # Assume it's a fine
            fine = sentence_str
    
    return prison_term, fine


# Read the merge CSV (skip metadata rows)
print("Reading efcc_convictions_merge.csv...")
df = pd.read_csv('efcc_convictions_merge.csv', skiprows=4)

# Map columns to expected format
print("Processing data...")
processed_data = []

for idx, row in df.iterrows():
    # Parse sentence to get prison_term and fine
    prison_term, fine = parse_sentence(row.get('SENTENCE: CUSTODIAL/ FINE'))
    
    record = {
        'name': row.get('NAME OF CONVICT (S)', ''),
        'offense': row.get('OFFENCES CHARGED FOR', ''),
        'court': row.get('COURT CHARGED IN', ''),
        'prison_term': prison_term,
        'fine': fine,
        'restitution': None  # Not available in merge data
    }
    processed_data.append(record)
    
    if (idx + 1) % 1000 == 0:
        print(f"  Processed {idx + 1} records...")

print(f"Total raw records: {len(processed_data)}")

# Apply cleaning pipeline
print("Applying cleaning pipeline...")
cleaned_data = process_efcc_data(processed_data)

print(f"Total cleaned records after deduplication and splitting: {len(cleaned_data)}")

# Convert to DataFrame and save
output_df = pd.DataFrame(cleaned_data)

# Select only the columns that should be in the output
output_columns = ['name', 'offense', 'court', 'prison_term', 'fine', 'restitution']
output_df = output_df[output_columns]

# Save to CSV (use temporary file then rename)
import os
temp_file = 'efcc_convictions_updated.csv'
output_df.to_csv(temp_file, index=False)

print(f"✅ Saved {len(output_df)} records to {temp_file}")
print("\nNote: The file is currently locked. To replace the original:")
print("  1. Close the file in any open editors")
print("  2. Run: python -c \"import os; os.remove('efcc_convictions.csv'); os.rename('efcc_convictions_updated.csv', 'efcc_convictions.csv')\"")

# Preview
print("\nPreview of updated data:")
print(output_df.head(10))
