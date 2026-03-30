import pandas as pd
import re
import os

def parse_sentence(sentence_str):
    """
    Parses sentence strings to extract prison term in months and fine amount.
    Handles formats like '10 YEARS/10,000', '6 MONTHS', or '300000'.
    """
    if pd.isna(sentence_str):
        return None, None
    
    text = str(sentence_str).upper().replace('\n', ' ')
    months = 0
    fine = None
    
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
    
    if not os.path.exists(input_csv):
        print(f"Error: {input_csv} not found.")
        return

    # Peek to find the actual header row (skipping CSV merge comments)
    df_peek = pd.read_csv(input_csv, header=None, nrows=15, encoding='utf-8', errors='ignore')
    header_idx = df_peek[df_peek.apply(lambda r: r.str.contains('NAME OF CONVICT', na=False).any(), axis=1)].index[0]
    
    # Load the data starting from the identified header
    df = pd.read_csv(input_csv, skiprows=header_idx)
    
    # Clean rows: keep only valid records where S/N is a number (removes junk/sub-headers)
    df = df[pd.to_numeric(df['S/N'], errors='coerce').notnull()]
    
    # Standardize data into the schema used by main.py
    transformed = pd.DataFrame()
    transformed['name'] = df['NAME OF CONVICT (S)'].str.strip().str.upper()
    transformed['offense'] = df['OFFENCES CHARGED FOR'].str.replace('\n', ' ', regex=True).str.strip().str.upper()
    transformed['court'] = df['COURT CHARGED IN'].str.replace('\n', ' ', regex=True).str.strip().str.upper()
    
    # Process Sentence strings into structured data for statistics and filtering
    sentence_parsed = df['SENTENCE: CUSTODIAL/ FINE'].apply(parse_sentence)
    transformed['prison_term_months'] = [x[0] for x in sentence_parsed]
    transformed['fine'] = [x[1] for x in sentence_parsed]
    transformed['restitution'] = None # Data not explicitly separate in this raw format
    
    # Save to the standardized file location
    transformed.to_csv(output_csv, index=False)
    print(f"[TRANSFORM] SUCCESS: Processed {len(transformed)} records into {output_csv}")

if __name__ == "__main__":
    transform_data()