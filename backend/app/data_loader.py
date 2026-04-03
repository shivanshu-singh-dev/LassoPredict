import pandas as pd
import json
import io

def load_data(file_content: bytes, filename: str) -> pd.DataFrame:
    """Loads a dataset into a pandas DataFrame based on the extension."""
    if filename.endswith(".csv"):
        return pd.read_csv(io.BytesIO(file_content))
    elif filename.endswith(".xlsx") or filename.endswith(".xls"):
        return pd.read_excel(io.BytesIO(file_content))
    elif filename.endswith(".json"):
        # Expecting JSON as a list of records or orient='records'
        return pd.read_json(io.BytesIO(file_content))
    elif filename.endswith(".txt"):
        # Expecting tab or comma separated text
        return pd.read_csv(io.BytesIO(file_content), sep=None, engine='python')
    else:
        raise ValueError("Unsupported file format")

def parse_manual_data(data: list[dict]) -> pd.DataFrame:
    """Parses manual M x N entry data."""
    df = pd.DataFrame(data)
    return df
