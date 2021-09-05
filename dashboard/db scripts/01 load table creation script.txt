-- =======================================================================
-- Drop tables
-- If running again and want to drop the tables, uncomment block

/*
DROP TABLE public.humidity_09hours_raw;
DROP TABLE public.humidity_15hours_raw;
DROP TABLE public.maximum_temperatures_raw;
DROP TABLE public.mean_temperatures_raw;
DROP TABLE public.minimum_temperatures_raw;
DROP TABLE public.nrm_fire_projection_summary_raw;
*/

-- =======================================================================
-- =======================================================================
-- Create tables

-- -----------------------------------------------------------------------
-- Humidity 9 hours raw table

CREATE TABLE public.humidity_09hours_raw
(
    "STATION_NAME" character varying(100) COLLATE pg_catalog."default",
    "STN_ID" integer,
    "LAT" numeric,
    "LON" numeric,
    "ENSEMBLE" character varying(30) COLLATE pg_catalog."default",
    "RCP" character varying(30) COLLATE pg_catalog."default",
    "MODEL" character varying(30) COLLATE pg_catalog."default",
    "CLIMATOLOGY" character varying(30) COLLATE pg_catalog."default",
    "Annual" numeric,
    "DJF" numeric,
    "MAM" numeric,
    "JJA" numeric,
    "SON" numeric,
    "NDJFMA" numeric,
    "MJJASO" numeric,
    "January" numeric,
    "February" numeric,
    "March" numeric,
    "April" numeric,
    "May" numeric,
    "June" numeric,
    "July" numeric,
    "August" numeric,
    "September" numeric,
    "October" numeric,
    "November" numeric,
    "December" numeric
);


-- -----------------------------------------------------------------------
-- Humidity 15 hours raw table

CREATE TABLE public.humidity_15hours_raw
(
    "STATION_NAME" character varying(100) COLLATE pg_catalog."default",
    "STN_ID" integer,
    "LAT" numeric,
    "LON" numeric,
    "ENSEMBLE" character varying(30) COLLATE pg_catalog."default",
    "RCP" character varying(30) COLLATE pg_catalog."default",
    "MODEL" character varying(30) COLLATE pg_catalog."default",
    "CLIMATOLOGY" character varying(30) COLLATE pg_catalog."default",
    "Annual" numeric,
    "DJF" numeric,
    "MAM" numeric,
    "JJA" numeric,
    "SON" numeric,
    "NDJFMA" numeric,
    "MJJASO" numeric,
    "January" numeric,
    "February" numeric,
    "March" numeric,
    "April" numeric,
    "May" numeric,
    "June" numeric,
    "July" numeric,
    "August" numeric,
    "September" numeric,
    "October" numeric,
    "November" numeric,
    "December" numeric
);


-- -----------------------------------------------------------------------
-- Maximum Temperatures raw table

CREATE TABLE public.maximum_temperatures_raw
(
    "STATION_NAME" character varying(100) COLLATE pg_catalog."default",
    "STN_ID" integer,
    "LAT" numeric,
    "LON" numeric,
    "ENSEMBLE" character varying(30) COLLATE pg_catalog."default",
    "RCP" character varying(30) COLLATE pg_catalog."default",
    "MODEL" character varying(30) COLLATE pg_catalog."default",
    "CLIMATOLOGY" character varying(30) COLLATE pg_catalog."default",
    "Annual" numeric,
    "DJF" numeric,
    "MAM" numeric,
    "JJA" numeric,
    "SON" numeric,
    "NDJFMA" numeric,
    "MJJASO" numeric,
    "January" numeric,
    "February" numeric,
    "March" numeric,
    "April" numeric,
    "May" numeric,
    "June" numeric,
    "July" numeric,
    "August" numeric,
    "September" numeric,
    "October" numeric,
    "November" numeric,
    "December" numeric
);

-- -----------------------------------------------------------------------
-- Mean Temperatures raw table

CREATE TABLE public.mean_temperatures_raw
(
    "STATION_NAME" character varying(100) COLLATE pg_catalog."default",
    "STN_ID" integer,
    "LAT" numeric,
    "LON" numeric,
    "ENSEMBLE" character varying(30) COLLATE pg_catalog."default",
    "RCP" character varying(30) COLLATE pg_catalog."default",
    "MODEL" character varying(30) COLLATE pg_catalog."default",
    "CLIMATOLOGY" character varying(30) COLLATE pg_catalog."default",
    "Annual" numeric,
    "DJF" numeric,
    "MAM" numeric,
    "JJA" numeric,
    "SON" numeric,
    "NDJFMA" numeric,
    "MJJASO" numeric,
    "January" numeric,
    "February" numeric,
    "March" numeric,
    "April" numeric,
    "May" numeric,
    "June" numeric,
    "July" numeric,
    "August" numeric,
    "September" numeric,
    "October" numeric,
    "November" numeric,
    "December" numeric
);

-- -----------------------------------------------------------------------
-- Minimum Temperatures raw table

CREATE TABLE public.minimum_temperatures_raw
(
    "STATION_NAME" character varying(100) COLLATE pg_catalog."default",
    "STN_ID" integer,
    "LAT" numeric,
    "LON" numeric,
    "ENSEMBLE" character varying(30) COLLATE pg_catalog."default",
    "RCP" character varying(30) COLLATE pg_catalog."default",
    "MODEL" character varying(30) COLLATE pg_catalog."default",
    "CLIMATOLOGY" character varying(30) COLLATE pg_catalog."default",
    "Annual" numeric,
    "DJF" numeric,
    "MAM" numeric,
    "JJA" numeric,
    "SON" numeric,
    "NDJFMA" numeric,
    "MJJASO" numeric,
    "January" numeric,
    "February" numeric,
    "March" numeric,
    "April" numeric,
    "May" numeric,
    "June" numeric,
    "July" numeric,
    "August" numeric,
    "September" numeric,
    "October" numeric,
    "November" numeric,
    "December" numeric
);

-- -----------------------------------------------------------------------
-- Fire Projection Summary raw table

CREATE TABLE public.nrm_fire_projection_summary_raw
(
    "Site Name" character varying(30) COLLATE pg_catalog."default",
    "Lat" numeric,
    "Lon" numeric,
    "Model" character varying(30) COLLATE pg_catalog."default",
    "Experiment" character varying(30) COLLATE pg_catalog."default",
    "Year" integer,
    "Avg Ann CFFDI" numeric,
    "DPY(12-25) High" numeric,
    "DPY(25-50) Very High" numeric,
    "DPY(50-75) Severe" numeric,
    "DPY(75-100) Extreme" numeric,
    "DPY(over100) Catastrophic" numeric
);

-- -----------------------------------------------------------------------
-- Load data mannully on to each tables

-- -----------------------------------------------------------------------
-- The number of records in each table, use the below lines to get a count 
--SELECT count(*) FROM public.maximum_temperatures_raw; 	-- 11200
--SELECT count(*) FROM public.mean_temperatures_raw;		-- 11648
--SELECT count(*) FROM public.minimum_temperatures_raw;		-- 11200	
--SELECT count(*) FROM public.nrm_fire_projection_summary_raw;	-- 1000
--SELECT count(*) FROM public.Humidity_09Hours_raw;		-- 4160
--SELECT count(*) FROM public.Humidity_09Hours_raw;		-- 4160
