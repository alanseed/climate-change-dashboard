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
  response = "<p>Usage:</p><p> /list \"table\" Where table = stations, models, rcp</p> \n"\
    "<p> /humidity \"station_name\"</p>" 
  return response

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

  # function to make the SQL needed to get humidity data for a station 
def get_hum(station_name):
  sql = 'SELECT st.station_name_short, st.lat, st.lon,'\
      'rc.rcp_id, md.model_id,'\
      'cy.climatology_year_range, hum.annual,'\
      'hum.january, hum.february, hum.march, hum.april, hum.may, hum.june,'\
      'hum.july, hum.august, hum.september, hum.october, hum.november, hum.december '\
  'FROM public.cl_humidity_09hours AS hum '\
  'JOIN public.cl_stations As st '\
  'ON hum.station_id = st.station_id '\
  'JOIN public.cl_models As md '\
  'ON hum.model_id = md.model_id '\
  'JOIN public.cl_rcp As rc '\
  'ON hum.rcp_id = rc.rcp_id '\
  'JOIN public.cl_climatology_years As cy '\
  'ON hum.climatology_year = cy.climatology_year '\
  'WHERE st.station_name_short = \'' + station_name + '\'' 

  data = [ ]
  results = conn.execute(sql)
  for rec in results:
    rec = { 
      "variable": "humidity at 9AM",
      "station_name": rec[0],
      "coord": {"lat":float(rec[1]), "lon":float(rec[2]) },
      "rcp_id":rec[3], 
      "model_id":rec[4],
      "climatology_year_range":rec[5],
      "annual":float(rec[6]),
      "january":float(rec[7]), 
      "february":float(rec[8]), 
      "march":float(rec[9]), 
      "april":float(rec[10]), 
      "may":float(rec[11]),     
      "june":float(rec[12]),
      "july":float(rec[13]), 
      "august":float(rec[14]), 
      "september":float(rec[15]), 
      "october":float(rec[16]), 
      "november":float(rec[17]), 
      "december":float(rec[18])
    }
    data.append(json.dumps(rec))
  return data

@app.route("/humidity <name>")
def humidity(name):
  output = get_hum(name)
  return {"results":output}