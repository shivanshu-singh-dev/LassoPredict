import pandas as pd
import numpy as np

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """Basic cleaning, handle missing values and return only numeric columns."""
    # Drop rows where all values are missing
    df = df.dropna(how='all')
    
    # Select only numeric columns
    numeric_df = df.select_dtypes(include=[np.number])
    
    if numeric_df.empty:
        raise ValueError("No numeric columns found in the dataset.")
        
    # Fill missing numeric values with the mean of the column
    numeric_df = numeric_df.fillna(numeric_df.mean())
    
    return numeric_df
