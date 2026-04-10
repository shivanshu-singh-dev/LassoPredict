import pandas as pd
import numpy as np

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """Basic cleaning, handle missing values and return only numeric columns."""
    df = df.dropna(how='all')
    
    numeric_df = df.select_dtypes(include=[np.number])
    
    if numeric_df.empty:
        raise ValueError("No numeric columns found in the dataset.")
        
    numeric_df = numeric_df.fillna(numeric_df.mean())
    
    return numeric_df
