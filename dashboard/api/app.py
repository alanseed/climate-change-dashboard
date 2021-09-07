from sqlalchemy import create_engine
from api_keys import pg_key
from flask import Flask, request, render_template

url = f"postgresql://postgres:{pg_key}@localhost:5432/Climate_DB"
engine = create_engine(url)
conn = engine.connect()

# set up the routes
app = Flask(__name__)

# generate the usage page
@app.route("/")
def usage():
    return render_template("climatedb.html")

# get the stations with their names and locations
@app.route("/list", methods=['GET'])
def list():
	if request.method == 'GET':
		table = request.args.get("table")
		output = []
		if table == "stations":
			output.clear()
			results = conn.execute("SELECT * FROM cl_stations")
			for station in results:
				rec = {
					"station_id": station[0],
					"station_name_long": station[1],
					"station_name_short": station[2],
					"coord": {"lat": float(station[3]), "lon": float(station[4])}}
			output.append(rec)

		if table == "models":
			output.clear()
			results = conn.execute("SELECT * FROM cl_models")
			for model in results:
				rec = {"model_id": model[0],
								"model_description": model[1]}
				output.append(rec)

		if table == "rcp":
			output.clear()
			results = conn.execute("SELECT * FROM cl_rcp")
			for rcp in results:
				rec = {"rcp_id": rcp[0],
								"rcp_description": rcp[1]}
				output.append(rec)

	return {"results": output}

# function to make the SQL needed to get humidity data for a station
def get_hum(station_id):
	sql = 'SELECT st.station_id, st.station_name_short, st.lat, st.lon,'\
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
			'WHERE st.station_id = ' + station_id

	data = []
	results = conn.execute(sql)
	for rec in results:
		rec = {
			"variable": "humidity at 9AM",
			"station_id": rec[0],
			"station_name": rec[1],
			"coord": {"lat": float(rec[2]), "lon": float(rec[3])},
			"rcp_id": rec[4],
			"model_id": rec[5],
			"climatology_year_range": rec[6],
			"annual": float(rec[7]),
			"january": float(rec[8]),
			"february": float(rec[9]),
			"march": float(rec[10]),
			"april": float(rec[11]),
			"may": float(rec[12]),
			"june": float(rec[13]),
			"july": float(rec[14]),
			"august": float(rec[15]),
			"september": float(rec[16]),
			"october": float(rec[17]),
			"november": float(rec[18]),
			"december": float(rec[19])
		}
		data.append(rec)
	return data

# get the humidity data for a station_id
@app.route("/humidity", methods=['GET'])
def humidity():
	station_id = request.args.get("station_id")
	output = get_hum(station_id)
	return {"results": output}

# function to make the SQL needed to get temp data for a station
def get_temp(station_id):
  sql = 'SELECT 	st.station_name_short, st.lat, st.lon,'\
		'rc.rcp_id, md.model_id,'\
		'cy.climatology_year_range, tm.annual,'\
		'tm.january, tm.february, tm.march, tm.april, tm.may, tm.june,'\
		'tm.july, tm.august, tm.september, tm.october, tm.november, tm.december '\
    'FROM public.cl_mean_temperatures AS tm '\
    'JOIN public.cl_stations As st '\
    'ON tm.station_id = st.station_id '\
    'JOIN public.cl_models As md '\
    'ON tm.model_id = md.model_id '\
    'JOIN public.cl_rcp As rc '\
    'ON tm.rcp_id = rc.rcp_id '\
    'JOIN public.cl_climatology_years As cy '\
    'ON tm.climatology_year = cy.climatology_year '\
    'WHERE	st.station_id =' + str(station_id) 
  data = [] 
  results = conn.execute(sql)
  for res in results: 
    row = {
      "variable": "mean temperature",
      "station_name": res[0],
      "coord": {"lat":float(res[1]), "lon":float(res[2]) },
      "rcp_id":res[3], 
      "model_id":res[4],
      "climatology_year_range":res[5],
      "annual":float(res[6]),
      "january":float(res[7]), 
      "february":float(res[8]), 
      "march":float(res[9]), 
      "april":float(res[10]), 
      "may":float(res[11]),     
      "june":float(res[12]),
      "july":float(res[13]), 
      "august":float(res[14]), 
      "september":float(res[15]), 
      "october":float(res[16]), 
      "november":float(res[17]), 
      "december":float(res[18])
    }
    data.append(row)
  return data

# get the temp data for a station_id
@app.route("/temp", methods=['GET'])
def temp():
	station_id = request.args.get("station_id")
	output = get_temp(station_id)
	return {"results": output}

if __name__ == '__main__':
    # run app in debug mode on port 5000
    app.run(debug=True, port=5000)