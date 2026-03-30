"""
Transform raw EFCC conviction data to API-compatible format.
"""

import pandas as pd
import re
import os


def clean_column_names(df):
    """Clean column names by removing newlines."""
    df.columns = df.columns.str.replace('\n', ' ').str.strip()
    return df


def extract_fine_from_sentence(sentence):
    """Extract fine amount from sentence string."""
    if not sentence or pd.isna(sentence):
        return None
def parse_sentence(sentence_str):
    """
    Parses sentence strings to extract prison term in months and fine amount.
    Handles formats like '10 YEARS/10,000', '6 MONTHS', or '300000'.
    """
    if pd.isna(sentence_str):
        return None, None
    
    sentence = str(sentence).upper()
    text = str(sentence_str).upper().replace('\n', ' ')
    months = 0
    fine = None
    
    # Look for patterns like "N500,000" or "N100,000.00"
    match = re.search(r'N[\d,]+(?:\.\d+)?', sentence)
    if match:
        fine_str = match.group(0).replace('N', '').replace(',', '')
        try:
            return str(int(float(fine_str)))
        except:
            return None
    # Extract Years -> Months
    years_match = re.search(r'(\d+)\s*YEAR', text)
    if years_match:
        months += int(years_match.group(1)) * 12
        
    # Extract Months
    months_match = re.search(r'(\d+)\s*MONTH', text)
    if months_match:
        months += int(months_match.group(1))
        
    # Extract Fine: look for currency N, /, or explicit 'FINE' keyword
    fine_match = re.search(r'(?:/|N|FINE)\s*([\d,]+)', text)
    if fine_match:
        fine = fine_match.group(1).replace(',', '')
    elif text.replace(',', '').strip().isdigit():
        # Handle rows where sentence is just a number
        fine = text.replace(',', '').strip()
        
    return months if months > 0 else None, fine

def transform_data():
    input_csv = "efcc_convictions_merge.csv"
    output_csv = "efcc_convictions.csv"
    
    return None
    if not os.path.exists(input_csv):
        print(f"Error: {input_csv} not found.")
        return


def extract_prison_term(sentence):
    """Extract prison term from sentence string."""
    if not sentence or pd.isna(sentence):
        return "NOT SPECIFIED"
    # Peek to find the actual header row (skipping CSV merge comments)
    df_peek = pd.read_csv(input_csv, header=None, nrows=15, encoding='utf-8', errors='ignore')
    header_idx = df_peek[df_peek.apply(lambda r: r.str.contains('NAME OF CONVICT', na=False).any(), axis=1)].index[0]
    
    sentence = str(sentence).strip()
    # Load the data starting from the identified header
    df = pd.read_csv(input_csv, skiprows=header_idx)
    
    # Handle various sentence formats
    if not sentence or sentence.upper() in ['CONVICTED', 'N/A', '', 'NIL']:
        return "NOT SPECIFIED"
    # Clean rows: keep only valid records where S/N is a number (removes junk/sub-headers)
    df = df[pd.to_numeric(df['S/N'], errors='coerce').notnull()]
    
    # Extract prison term (everything before "FINE" or "OR")
    prison_match = re.match(r'([^(FINE)(OR)]+)', sentence, re.IGNORECASE)
    if prison_match:
        term = prison_match.group(1).strip()
        if term:
            return term
    # Standardize data into the schema used by main.py
    transformed = pd.DataFrame()
    transformed['name'] = df['NAME OF CONVICT (S)'].str.strip().str.upper()
    transformed['offense'] = df['OFFENCES CHARGED FOR'].str.replace('\n', ' ', regex=True).str.strip().str.upper()
    transformed['court'] = df['COURT CHARGED IN'].str.replace('\n', ' ', regex=True).str.strip().str.upper()
    
    return sentence
    # Process Sentence strings into structured data for statistics and filtering
    sentence_parsed = df['SENTENCE: CUSTODIAL/ FINE'].apply(parse_sentence)
    transformed['prison_term_months'] = [x[0] for x in sentence_parsed]
    transformed['fine'] = [x[1] for x in sentence_parsed]
    transformed['restitution'] = None # Data not explicitly separate in this raw format
    
    # Save to the standardized file location
    transformed.to_csv(output_csv, index=False)
    print(f"[TRANSFORM] SUCCESS: Processed {len(transformed)} records into {output_csv}")


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
if __name__ == "__main__":
    transform_data()
