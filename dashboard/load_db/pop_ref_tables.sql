
TRUNCATE cl_stations;

-- Insert data
INSERT INTO cl_stations(
	station_id, station_name_long, lat, lon)

SELECT DISTINCT "STN_ID", "STATION_NAME", "LAT", "LON"
FROM maximum_temperatures_raw

UNION

SELECT DISTINCT "STN_ID", "STATION_NAME", "LAT", "LON"
FROM mean_temperatures_raw

UNION

SELECT DISTINCT "STN_ID", "STATION_NAME", "LAT", "LON"
FROM minimum_temperatures_raw;

-- -----------------------------------------------------------------------
-- Update Station with town names

UPDATE 	cl_stations 

SET	station_name_short = src.Site_Name

FROM (	SELECT 	DISTINCT 
		 		"Site Name" as Site_Name, 
		 		"Lat"		as Lat, 
		 		"Lon"		as Lon 
		 FROM 	nrm_fire_projection_summary_raw ) as src
		 
WHERE	cl_stations.lat = src.lat
AND		cl_stations.lon	= src.lon;

-- -----------------------------------------------------------------------
-- Update the missing station names

UPDATE 	cl_stations

SET		station_name_short = initcap(REPLACE(REPLACE(REPLACE(station_name_long, 'AERO', ''),'AWS',''),'AIRPORT',''))

WHERE	station_name_short is null;

-- -----------------------------------------------------------------------
-- Remove - from station long names

UPDATE 	cl_stations

SET		station_name_short = REPLACE(station_name_short, '-', ' ');


-- =======================================================================
-- -----------------------------------------------------------------------
-- Model table
-- Delete data before inserting
TRUNCATE cl_models;

-- Insert data
INSERT INTO cl_models(
	model_id)

SELECT DISTINCT UPPER("MODEL")
FROM maximum_temperatures_raw

UNION

SELECT DISTINCT UPPER("MODEL")
FROM mean_temperatures_raw

UNION

SELECT DISTINCT UPPER("MODEL")
FROM minimum_temperatures_raw

UNION

SELECT DISTINCT UPPER("Model")
FROM nrm_fire_projection_summary_raw;

-- =======================================================================
-- -----------------------------------------------------------------------
-- Representative Concentration Pathway (RCP) table
-- Delete data before inserting
TRUNCATE cl_rcp;

-- Insert data
INSERT INTO cl_rcp(
	rcp_id)

SELECT DISTINCT UPPER("RCP")
FROM maximum_temperatures_raw

UNION

SELECT DISTINCT UPPER("RCP")
FROM mean_temperatures_raw

UNION

SELECT DISTINCT UPPER("RCP")
FROM minimum_temperatures_raw

UNION

SELECT DISTINCT UPPER("Experiment")
FROM nrm_fire_projection_summary_raw;

-- =======================================================================
-- -----------------------------------------------------------------------
-- Climatology years table
-- Delete data before inserting
TRUNCATE cl_climatology_years;

-- Insert data
INSERT INTO cl_climatology_years(
	climatology_year, climatology_year_range)

SELECT DISTINCT SUBSTRING("CLIMATOLOGY",1,4)::integer, UPPER("CLIMATOLOGY")
FROM maximum_temperatures_raw

UNION

SELECT DISTINCT SUBSTRING("CLIMATOLOGY",1,4)::integer, UPPER("CLIMATOLOGY")
FROM mean_temperatures_raw

UNION

SELECT DISTINCT SUBSTRING("CLIMATOLOGY",1,4)::integer, UPPER("CLIMATOLOGY")
FROM minimum_temperatures_raw

UNION

SELECT DISTINCT ("Year"), CAST("Year" as text) || '-' ||  CAST("Year"+19 as text)
FROM nrm_fire_projection_summary_raw;
