from sqlalchemy import create_engine 
from sqlalchemy.orm import Session
import json 
from api_keys import pg_key
from flask import Flask

url = f"postgresql://postgres:{pg_key}@localhost:5432/Climate_DB" 
engine = create_engine(url) 
conn = engine.connect()

# set up the routes 
app = Flask(__name__)
@app.route("/")
def hello_world():
  return "<p>Usage: /list table</p> <p>Where table = stations, models, rcp</p>" 

# return the stations with their names and locations 
@app.route("/list <table>")
def list(table):
  output = []
  if table == "stations":
    output.clear()
    results = conn.execute("SELECT * FROM cl_stations")
    for station in results:
      rec = {"station_id": station[0],
      "station_name_long":station[1], 
      "station_name_short":station[2], 
      "coord":{"lat":float(station[3]), "lon":float(station[4])} }
      output.append(json.dumps(rec))
    
  if table == "models":
    output.clear()
    results = conn.execute("SELECT * FROM cl_models")
    for model in results:
      rec = {"model_id":model[0], 
      "model_description":model[1]}
      output.append(json.dumps(rec))

  if table == "rcp":
      output.clear()
      results = conn.execute("SELECT * FROM cl_rcp")
      for rcp in results:
        rec = {"rcp_id":rcp[0], 
        "rcp_description":rcp[1]}
        output.append(json.dumps(rec))

  return {"results":output}