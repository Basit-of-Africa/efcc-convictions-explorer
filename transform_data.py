"""
Transform raw EFCC conviction data to API-compatible format.
"""

import pandas as pd
import re


def clean_column_names(df):
    """Clean column names by removing newlines."""
    df.columns = df.columns.str.replace('\n', ' ').str.strip()
    return df


def extract_fine_from_sentence(sentence):
    """Extract fine amount from sentence string."""
    if not sentence or pd.isna(sentence):
        return None
    
    sentence = str(sentence).upper()
    
    # Look for patterns like "N500,000" or "N100,000.00"
    match = re.search(r'N[\d,]+(?:\.\d+)?', sentence)
    if match:
        fine_str = match.group(0).replace('N', '').replace(',', '')
        try:
            return str(int(float(fine_str)))
        except:
            return None
    
    return None


def extract_prison_term(sentence):
    """Extract prison term from sentence string."""
    if not sentence or pd.isna(sentence):
        return "NOT SPECIFIED"
    
    sentence = str(sentence).strip()
    
    # Handle various sentence formats
    if not sentence or sentence.upper() in ['CONVICTED', 'N/A', '', 'NIL']:
        return "NOT SPECIFIED"
    
    # Extract prison term (everything before "FINE" or "OR")
    prison_match = re.match(r'([^(FINE)(OR)]+)', sentence, re.IGNORECASE)
    if prison_match:
        term = prison_match.group(1).strip()
        if term:
            return term
    
    return sentence


# Load raw data
print("Loading raw conviction data...")
df = pd.read_csv('efcc_convictions_raw.csv', skiprows=1)

# Clean column names
df = clean_column_names(df)

# Select and rename columns
output_df = pd.DataFrame()
output_df['name'] = df['NAME OF CONVICT (S)'].fillna('UNKNOWN')
output_df['offense'] = df['OFFENCES CHARGED FOR'].fillna('UNSPECIFIED')
output_df['court'] = df['COURT CHARGED IN'].fillna('UNSPECIFIED')
output_df['prison_term'] = df['SENTENCE: CUSTODIAL/ FINE'].apply(extract_prison_term)
output_df['fine'] = df['SENTENCE: CUSTODIAL/ FINE'].apply(extract_fine_from_sentence)
output_df['restitution'] = None  # Not available in source data

# Remove rows with invalid names
output_df = output_df[output_df['name'] != 'UNKNOWN']
output_df = output_df[output_df['name'].str.strip() != '']

# Display stats
print(f"\n📊 Data Transformation Summary:")
print(f"  Original records: {len(df)}")
print(f"  Valid records: {len(output_df)}")
print(f"  Records removed: {len(df) - len(output_df)}")

print(f"\n🏢 Courts in dataset: {output_df['court'].nunique()}")
print(f"📋 Offense types: {output_df['offense'].nunique()}")

print(f"\n💰 Records with fines: {output_df['fine'].notna().sum()}")
print(f"⏳ Records with prison terms: {output_df['prison_term'].notna().sum()}")

# Show top offenses
print(f"\n🔝 Top 10 Offenses:")
top_offenses = output_df['offense'].value_counts().head(10)
for offense, count in top_offenses.items():
    print(f"   {count:3d} × {offense}")

# Save in API-compatible format
output_df.to_csv('efcc_convictions.csv', index=False)
print(f"\n✅ Saved to efcc_convictions.csv")
