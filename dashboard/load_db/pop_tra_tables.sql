TRUNCATE cl_humidity_09hours;

-- Insert data
INSERT INTO cl_humidity_09hours(
	station_id, rcp_id, model_id, climatology_year, 
	annual, djf, mam, jja, son, ndjfma, mjjaso, 
	january, february, march, april, may, june, 
	july, august, september, october, november, december)

SELECT st.station_id, rcp.rcp_id, mo.model_id, cy.climatology_year, 
	hum."Annual", hum."DJF", hum."MAM", hum."JJA", hum."SON", hum."NDJFMA", hum."MJJASO", 
	hum."January", hum."February", hum."March", hum."April", hum."May", hum."June", 
	hum."July", hum."August", hum."September", hum."October", hum."November", hum."December"

FROM humidity_09hours_raw AS hum

JOIN cl_stations AS st
ON	hum."STN_ID" = st.station_id

JOIN cl_rcp AS rcp
ON	UPPER(hum."RCP")  = rcp.rcp_id

JOIN cl_models AS MO
ON	hum."MODEL"  = mo.model_id

JOIN cl_climatology_years AS cy
ON	SUBSTRING(hum."CLIMATOLOGY",1,4)::integer = cy.climatology_year;

-- =======================================================================
-- -----------------------------------------------------------------------
-- Humidity 15 hours table
-- Delete data before inserting
TRUNCATE cl_humidity_15hours;

-- Insert data
INSERT INTO cl_humidity_15hours(
	station_id, rcp_id, model_id, climatology_year, 
	annual, djf, mam, jja, son, ndjfma, mjjaso, 
	january, february, march, april, may, june, 
	july, august, september, october, november, december)

SELECT st.station_id, rcp.rcp_id, mo.model_id, cy.climatology_year, 
	hum."Annual", hum."DJF", hum."MAM", hum."JJA", hum."SON", hum."NDJFMA", hum."MJJASO", 
	hum."January", hum."February", hum."March", hum."April", hum."May", hum."June", 
	hum."July", hum."August", hum."September", hum."October", hum."November", hum."December"

FROM humidity_15hours_raw AS hum

JOIN cl_stations AS st
ON	hum."STN_ID" = st.station_id

JOIN cl_rcp AS rcp
ON	UPPER(hum."RCP")  = rcp.rcp_id

JOIN cl_models AS MO
ON	hum."MODEL"  = mo.model_id

JOIN cl_climatology_years AS cy
ON	SUBSTRING(hum."CLIMATOLOGY",1,4)::integer = cy.climatology_year;


-- =======================================================================
-- -----------------------------------------------------------------------
-- Maximum Temperatures table
-- Delete data before inserting
TRUNCATE cl_maximum_temperatures;

-- Insert data
INSERT INTO cl_maximum_temperatures(
	station_id, rcp_id, model_id, climatology_year, 
	annual, djf, mam, jja, son, ndjfma, mjjaso, 
	january, february, march, april, may, june, 
	july, august, september, october, november, december)

SELECT st.station_id, rcp.rcp_id, mo.model_id, cy.climatology_year, 
	tm."Annual", tm."DJF", tm."MAM", tm."JJA", tm."SON", tm."NDJFMA", tm."MJJASO", 
	tm."January", tm."February", tm."March", tm."April", tm."May", tm."June", 
	tm."July", tm."August", tm."September", tm."October", tm."November", tm."December"

FROM maximum_temperatures_raw AS tm

JOIN cl_stations AS st
ON	tm."STN_ID" = st.station_id

JOIN cl_rcp AS rcp
ON	UPPER(tm."RCP")  = rcp.rcp_id

JOIN cl_models AS MO
ON	tm."MODEL"  = mo.model_id

JOIN cl_climatology_years AS cy
ON	SUBSTRING(tm."CLIMATOLOGY",1,4)::integer = cy.climatology_year;

-- =======================================================================
-- -----------------------------------------------------------------------
-- Mean Temperatures table
-- Delete data before inserting
TRUNCATE cl_mean_temperatures;

-- Insert data
INSERT INTO cl_mean_temperatures(
	station_id, rcp_id, model_id, climatology_year, 
	annual, djf, mam, jja, son, ndjfma, mjjaso, 
	january, february, march, april, may, june, 
	july, august, september, october, november, december)

SELECT st.station_id, rcp.rcp_id, mo.model_id, cy.climatology_year, 
	tm."Annual", tm."DJF", tm."MAM", tm."JJA", tm."SON", tm."NDJFMA", tm."MJJASO", 
	tm."January", tm."February", tm."March", tm."April", tm."May", tm."June", 
	tm."July", tm."August", tm."September", tm."October", tm."November", tm."December"

FROM mean_temperatures_raw AS tm

JOIN cl_stations AS st
ON	tm."STN_ID" = st.station_id

JOIN cl_rcp AS rcp
ON	UPPER(tm."RCP")  = rcp.rcp_id

JOIN cl_models AS MO
ON	tm."MODEL"  = mo.model_id

JOIN cl_climatology_years AS cy
ON	SUBSTRING(tm."CLIMATOLOGY",1,4)::integer = cy.climatology_year;

-- =======================================================================
-- -----------------------------------------------------------------------
-- Minimum Temperatures table
-- Delete data before inserting
TRUNCATE cl_minimum_temperatures;

-- Insert data
INSERT INTO cl_minimum_temperatures(
	station_id, rcp_id, model_id, climatology_year, 
	annual, djf, mam, jja, son, ndjfma, mjjaso, 
	january, february, march, april, may, june, 
	july, august, september, october, november, december)

SELECT st.station_id, rcp.rcp_id, mo.model_id, cy.climatology_year, 
	tm."Annual", tm."DJF", tm."MAM", tm."JJA", tm."SON", tm."NDJFMA", tm."MJJASO", 
	tm."January", tm."February", tm."March", tm."April", tm."May", tm."June", 
	tm."July", tm."August", tm."September", tm."October", tm."November", tm."December"

FROM minimum_temperatures_raw AS tm

JOIN cl_stations AS st
ON	tm."STN_ID" = st.station_id

JOIN cl_rcp AS rcp
ON	UPPER(tm."RCP")  = rcp.rcp_id

JOIN cl_models AS MO
ON	tm."MODEL"  = mo.model_id

JOIN cl_climatology_years AS cy
ON	SUBSTRING(tm."CLIMATOLOGY",1,4)::integer = cy.climatology_year;

-- =======================================================================
-- -----------------------------------------------------------------------
-- Fire Projection Summary table
-- Delete data before inserting
TRUNCATE cl_fire_projection_summary;

-- Insert data
INSERT INTO cl_fire_projection_summary(
	station_id, rcp_id, model_id, climatology_year, 
	avg_annual_cffdi, dpy_high, dpy_very_high, 
	dpy_severe, dpy_extreme, dpy_catastrophic)

SELECT st.station_id, rcp.rcp_id, mo.model_id, cy.climatology_year, 
	nrm."Avg Ann CFFDI", nrm."High", nrm."Very High", 
	nrm."Severe", nrm."Extreme", nrm."Catastrophic"

FROM nrm_fire_projection_summary_raw AS nrm

JOIN cl_stations AS st
ON	 nrm."Lat" = st.lat
AND	 nrm."Lon" = st.lon

JOIN cl_rcp AS rcp
ON	UPPER(nrm."Experiment")  = rcp.rcp_id

JOIN cl_models AS MO
ON	nrm."Model"  = mo.model_id

JOIN cl_climatology_years AS cy
ON	nrm."Year" = cy.climatology_year;


