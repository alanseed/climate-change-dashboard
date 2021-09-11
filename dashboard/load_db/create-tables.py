# script to load the database into postgresql 
import pandas as pd
from sqlalchemy import create_engine
from api_keys import pg_key

# local connection
url = f"postgresql://postgres:{pg_key}@localhost:5432/Test_DB" 
engine = create_engine(url) 
conn = engine.connect() 

sql_1 = open("db_script.sql")
sql_1_string = sql_1.read() 
conn.execute(sql_1_string)