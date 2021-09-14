-- =======================================================================
-- =======================================================================
-- populate reference tables

-- =======================================================================
-- -----------------------------------------------------------------------
-- Stations table
-- Delete data before inserting
TRUNCATE public.cl_stations;

-- Insert data
INSERT INTO public.cl_stations(
	station_id, station_name_long, lat, lon)

SELECT DISTINCT "STN_ID", "STATION_NAME", "LAT", "LON"
FROM public.maximum_temperatures_raw

UNION

SELECT DISTINCT "STN_ID", "STATION_NAME", "LAT", "LON"
FROM public.mean_temperatures_raw

UNION

SELECT DISTINCT "STN_ID", "STATION_NAME", "LAT", "LON"
FROM public.minimum_temperatures_raw;

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

UPDATE 	public.cl_stations

SET		station_name_short = initcap(REPLACE(REPLACE(REPLACE(station_name_long, 'AERO', ''),'AWS',''),'AIRPORT',''))

WHERE	station_name_short is null;

-- -----------------------------------------------------------------------
-- Remove - from station long names

UPDATE 	public.cl_stations

SET		station_name_short = REPLACE(station_name_short, '-', ' ');


-- =======================================================================
-- -----------------------------------------------------------------------
-- Model table
-- Delete data before inserting
TRUNCATE public.cl_models;

-- Insert data
INSERT INTO public.cl_models(
	model_id)

SELECT DISTINCT UPPER("MODEL")
FROM public.maximum_temperatures_raw

UNION

SELECT DISTINCT UPPER("MODEL")
FROM public.mean_temperatures_raw

UNION

SELECT DISTINCT UPPER("MODEL")
FROM public.minimum_temperatures_raw

UNION

SELECT DISTINCT UPPER("Model")
FROM public.nrm_fire_projection_summary_raw;

-- =======================================================================
-- -----------------------------------------------------------------------
-- Representative Concentration Pathway (RCP) table
-- Delete data before inserting
TRUNCATE public.cl_rcp;

-- Insert data
INSERT INTO public.cl_rcp(
	rcp_id)

SELECT DISTINCT UPPER("RCP")
FROM public.maximum_temperatures_raw

UNION

SELECT DISTINCT UPPER("RCP")
FROM public.mean_temperatures_raw

UNION

SELECT DISTINCT UPPER("RCP")
FROM public.minimum_temperatures_raw

UNION

SELECT DISTINCT UPPER("Experiment")
FROM public.nrm_fire_projection_summary_raw;

-- =======================================================================
-- -----------------------------------------------------------------------
-- Climatology years table
-- Delete data before inserting
TRUNCATE public.cl_climatology_years;

-- Insert data
INSERT INTO public.cl_climatology_years(
	climatology_year, climatology_year_range)

SELECT DISTINCT SUBSTRING("CLIMATOLOGY",1,4)::integer, UPPER("CLIMATOLOGY")
FROM public.maximum_temperatures_raw

UNION

SELECT DISTINCT SUBSTRING("CLIMATOLOGY",1,4)::integer, UPPER("CLIMATOLOGY")
FROM public.mean_temperatures_raw

UNION

SELECT DISTINCT SUBSTRING("CLIMATOLOGY",1,4)::integer, UPPER("CLIMATOLOGY")
FROM public.minimum_temperatures_raw

UNION

SELECT DISTINCT ("Year"), CAST("Year" as text) || '-' ||  CAST("Year"+19 as text)
FROM public.nrm_fire_projection_summary_raw;