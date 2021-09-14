# script to load the database into postgresql 
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy_utils import database_exists, create_database
from config import pg_key 

# local connection
url = f"postgresql://postgres:{pg_key}@localhost:5432/Climate_DB" 
engine = create_engine(url) 

if database_exists(engine.url):
  print(database_exists(engine.url))
  conn = engine.connect() 
  dat = open("drop_all_tables.sql")
  dat_string = dat.read() 
  conn.execute(dat_string) 
  dat.close()
    
else:     
  create_database(engine.url)
  conn = engine.connect() 

crt = open("create_raw_tables.sql")
crt_string = crt.read() 
conn.execute(crt_string) 
crt.close()

df_1 = pd.read_csv("../data/hurs15_aus-station_r1i1p1_CSIRO-MnCh-wrt-1986-2005-Scl_v1_mon_seasavg-clim.csv") 
conn.execute("DROP TABLE humidity_15hours_raw") 
df_1.to_sql('humidity_15hours_raw', engine) 

df_2 = pd.read_csv("../data/hurs9_aus-station_r1i1p1_CSIRO-MnCh-wrt-1986-2005-Scl_v1_mon_seasavg-clim.csv" ) 
conn.execute("DROP TABLE humidity_09hours_raw") 
df_2.to_sql('humidity_09hours_raw', engine) 

df_3 = pd.read_csv("../data/tas_aus-station_r1i1p1_CSIRO-MnCh-wrt-1986-2005-Scl_v1_mon_seasavg-clim_1.csv" ) 
conn.execute("DROP TABLE mean_temperatures_raw") 
df_3.to_sql('mean_temperatures_raw', engine) 

df_4 = pd.read_csv("../data/tasmax_aus-station_r1i1p1_CSIRO-MnCh-wrt-1986-2005-Scl_v1_mon_seasavg-clim.csv" ) 
conn.execute("DROP TABLE maximum_temperatures_raw") 
df_4.to_sql('maximum_temperatures_raw', engine) 

df_5 = pd.read_csv("../data/tasmin_aus-station_r1i1p1_CSIRO-MnCh-wrt-1986-2005-Scl_v1_mon_seasavg-clim.csv" ) 
conn.execute("DROP TABLE minimum_temperatures_raw") 
df_5.to_sql('minimum_temperatures_raw', engine) 

df_6 = pd.read_csv("../data/NRM_fire_proj_summary.csv" ) 
conn.execute("DROP TABLE nrm_fire_projection_summary_raw") 
df_6.to_sql('nrm_fire_projection_summary_raw', engine) 

crtt = open("create_ref_tables.sql")
crtt_string = crtt.read() 
conn.execute(crtt_string) 
crtt.close()

prt = open("pop_ref_tables.sql")
prt_string = prt.read() 
# print(prt_string)
conn.execute(prt_string) 
prt.close()

ctt = open("create_tra_tables.sql")
ctt_string = ctt.read() 
conn.execute(ctt_string) 
ctt.close() 

ptt = open("pop_tra_tables.sql")
ptt_string = ptt.read() 
conn.execute(ptt_string) 
ptt.close()



