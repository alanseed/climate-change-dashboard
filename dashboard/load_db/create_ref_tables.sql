-- =======================================================================
-- Drop tables
-- If running again and want to drop the tables, uncomment block

-- DROP TABLE public.cl_stations;
-- DROP TABLE public.cl_models;
-- DROP TABLE public.cl_rcp;
-- DROP TABLE public.cl_climatology_years;


-- =======================================================================
-- =======================================================================
-- Create tables

-- -----------------------------------------------------------------------
-- Stations table

CREATE TABLE public.cl_stations
(
    station_id integer NOT NULL,
    station_name_long character varying(100),
    station_name_short character varying(50),
    lat numeric NOT NULL,
    lon numeric NOT NULL,
	CONSTRAINT pk_cl_stations PRIMARY KEY (
        station_id
	)
);

-- -----------------------------------------------------------------------
-- Model table

CREATE TABLE public.cl_models
(
    model_id character varying(30) NOT NULL,
    model_description character varying(100),
	CONSTRAINT pk_cl_models PRIMARY KEY (
        model_id
	)	
);
-- -----------------------------------------------------------------------
-- Representative Concentration Pathway (RCP) table

CREATE TABLE public.cl_rcp
(
    rcp_id character varying(10) NOT NULL,
    rcp_description character varying(100),
	CONSTRAINT pk_cl_rcp PRIMARY KEY (
        rcp_id	
	)
);

-- -----------------------------------------------------------------------
-- Climatology Years table
CREATE TABLE public.cl_climatology_years
(
    climatology_year integer  NOT NULL,
    climatology_year_range character varying(10) NOT NULL,
    climatology_description character varying(100),
	CONSTRAINT pk_cl_climatology_years PRIMARY KEY (
        climatology_year
	)
);
-- -----------------------------------------------------------------------
-- Model table