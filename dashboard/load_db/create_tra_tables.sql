CREATE TABLE public.cl_humidity_09hours
(
    station_id integer not null,
    rcp_id character varying(10) not null,
    model_id character varying(30) not null,
    climatology_year integer,
    Annual numeric,
    DJF numeric,
    MAM numeric,
    JJA numeric,
    SON numeric,
    NDJFMA numeric,
    MJJASO numeric,
    January numeric,
    February numeric,
    March numeric,
    April numeric,
    May numeric,
    June numeric,
    July numeric,
    August numeric,
    September numeric,
    October numeric,
    November numeric,
    December numeric,
	CONSTRAINT pk_cl_humidity_09hours PRIMARY KEY (
        station_id, rcp_id, model_id, climatology_year
     )
);

ALTER TABLE cl_humidity_09hours ADD CONSTRAINT fk_cl_station_station_id FOREIGN KEY(station_id)
REFERENCES cl_stations (station_id);

ALTER TABLE cl_humidity_09hours ADD CONSTRAINT fk_cl_rcp_rcp_id FOREIGN KEY(rcp_id)
REFERENCES cl_rcp (rcp_id);

ALTER TABLE cl_humidity_09hours ADD CONSTRAINT fk_cl_models_model_id FOREIGN KEY(model_id)
REFERENCES cl_models (model_id);

ALTER TABLE cl_humidity_09hours ADD CONSTRAINT fk_cl_climatology_years_climatology_year FOREIGN KEY(climatology_year)
REFERENCES cl_climatology_years (climatology_year);


-- -----------------------------------------------------------------------
-- Humidity 15 hours table
CREATE TABLE public.cl_humidity_15hours
(
    station_id integer not null,
    rcp_id character varying(10) not null,
    model_id character varying(30) not null,
    climatology_year integer,
    Annual numeric,
    DJF numeric,
    MAM numeric,
    JJA numeric,
    SON numeric,
    NDJFMA numeric,
    MJJASO numeric,
    January numeric,
    February numeric,
    March numeric,
    April numeric,
    May numeric,
    June numeric,
    July numeric,
    August numeric,
    September numeric,
    October numeric,
    November numeric,
    December numeric,
	CONSTRAINT pk_cl_humidity_15hours PRIMARY KEY (
        station_id, rcp_id, model_id, climatology_year
     )
);

ALTER TABLE cl_humidity_15hours ADD CONSTRAINT fk_cl_station_station_id FOREIGN KEY(station_id)
REFERENCES cl_stations (station_id);

ALTER TABLE cl_humidity_15hours ADD CONSTRAINT fk_cl_rcp_rcp_id FOREIGN KEY(rcp_id)
REFERENCES cl_rcp (rcp_id);

ALTER TABLE cl_humidity_15hours ADD CONSTRAINT fk_cl_models_model_id FOREIGN KEY(model_id)
REFERENCES cl_models (model_id);

ALTER TABLE cl_humidity_15hours ADD CONSTRAINT fk_cl_climatology_years_climatology_year FOREIGN KEY(climatology_year)
REFERENCES cl_climatology_years (climatology_year);

-- -----------------------------------------------------------------------
-- Maximum Temperatures table
CREATE TABLE public.cl_maximum_temperatures
(
    station_id integer not null,
    rcp_id character varying(10) not null,
    model_id character varying(30) not null,
    climatology_year integer,
    Annual numeric,
    DJF numeric,
    MAM numeric,
    JJA numeric,
    SON numeric,
    NDJFMA numeric,
    MJJASO numeric,
    January numeric,
    February numeric,
    March numeric,
    April numeric,
    May numeric,
    June numeric,
    July numeric,
    August numeric,
    September numeric,
    October numeric,
    November numeric,
    December numeric,
	CONSTRAINT pk_cl_maximum_temperatures PRIMARY KEY (
        station_id, rcp_id, model_id, climatology_year
     )
);

ALTER TABLE cl_maximum_temperatures ADD CONSTRAINT fk_cl_station_station_id FOREIGN KEY(station_id)
REFERENCES cl_stations (station_id);

ALTER TABLE cl_maximum_temperatures ADD CONSTRAINT fk_cl_rcp_rcp_id FOREIGN KEY(rcp_id)
REFERENCES cl_rcp (rcp_id);

ALTER TABLE cl_maximum_temperatures ADD CONSTRAINT fk_cl_models_model_id FOREIGN KEY(model_id)
REFERENCES cl_models (model_id);

ALTER TABLE cl_maximum_temperatures ADD CONSTRAINT fk_cl_climatology_years_climatology_year FOREIGN KEY(climatology_year)
REFERENCES cl_climatology_years (climatology_year);

-- -----------------------------------------------------------------------
-- Mean Temperatures table
CREATE TABLE public.cl_mean_temperatures
(
    station_id integer not null,
    rcp_id character varying(10) not null,
    model_id character varying(30) not null,
    climatology_year integer,
    Annual numeric,
    DJF numeric,
    MAM numeric,
    JJA numeric,
    SON numeric,
    NDJFMA numeric,
    MJJASO numeric,
    January numeric,
    February numeric,
    March numeric,
    April numeric,
    May numeric,
    June numeric,
    July numeric,
    August numeric,
    September numeric,
    October numeric,
    November numeric,
    December numeric,
	CONSTRAINT pk_cl_mean_temperatures PRIMARY KEY (
        station_id, rcp_id, model_id, climatology_year
     )
);

ALTER TABLE cl_mean_temperatures ADD CONSTRAINT fk_cl_station_station_id FOREIGN KEY(station_id)
REFERENCES cl_stations (station_id);

ALTER TABLE cl_mean_temperatures ADD CONSTRAINT fk_cl_rcp_rcp_id FOREIGN KEY(rcp_id)
REFERENCES cl_rcp (rcp_id);

ALTER TABLE cl_mean_temperatures ADD CONSTRAINT fk_cl_models_model_id FOREIGN KEY(model_id)
REFERENCES cl_models (model_id);

ALTER TABLE cl_mean_temperatures ADD CONSTRAINT fk_cl_climatology_years_climatology_year FOREIGN KEY(climatology_year)
REFERENCES cl_climatology_years (climatology_year);


-- -----------------------------------------------------------------------
-- Minimum Temperatures table
CREATE TABLE public.cl_minimum_temperatures
(
    station_id integer not null,
    rcp_id character varying(10) not null,
    model_id character varying(30) not null,
    climatology_year integer,
    Annual numeric,
    DJF numeric,
    MAM numeric,
    JJA numeric,
    SON numeric,
    NDJFMA numeric,
    MJJASO numeric,
    January numeric,
    February numeric,
    March numeric,
    April numeric,
    May numeric,
    June numeric,
    July numeric,
    August numeric,
    September numeric,
    October numeric,
    November numeric,
    December numeric,
	CONSTRAINT pk_cl_minimum_temperatures PRIMARY KEY (
        station_id, rcp_id, model_id, climatology_year
     )
);

ALTER TABLE cl_minimum_temperatures ADD CONSTRAINT fk_cl_station_station_id FOREIGN KEY(station_id)
REFERENCES cl_stations (station_id);

ALTER TABLE cl_minimum_temperatures ADD CONSTRAINT fk_cl_rcp_rcp_id FOREIGN KEY(rcp_id)
REFERENCES cl_rcp (rcp_id);

ALTER TABLE cl_minimum_temperatures ADD CONSTRAINT fk_cl_models_model_id FOREIGN KEY(model_id)
REFERENCES cl_models (model_id);

ALTER TABLE cl_minimum_temperatures ADD CONSTRAINT fk_cl_climatology_years_climatology_year FOREIGN KEY(climatology_year)
REFERENCES cl_climatology_years (climatology_year);


-- -----------------------------------------------------------------------
-- Fire Projection Summary table
CREATE TABLE public.cl_fire_projection_summary
(
    station_id integer not null,
    rcp_id character varying(10) not null,
    model_id character varying(30) not null,
    climatology_year integer,
	Avg_Annual_CFFDI numeric, 
	DPY_High numeric, 
	DPY_Very_High numeric,
	DPY_Severe numeric, 
	DPY_Extreme numeric,
	DPY_Catastrophic numeric,	
	CONSTRAINT pk_cl_fire_projection_summary PRIMARY KEY (
        station_id, rcp_id, model_id, climatology_year
     )
);

ALTER TABLE cl_fire_projection_summary ADD CONSTRAINT fk_cl_station_station_id FOREIGN KEY(station_id)
REFERENCES cl_stations (station_id);

ALTER TABLE cl_fire_projection_summary ADD CONSTRAINT fk_cl_rcp_rcp_id FOREIGN KEY(rcp_id)
REFERENCES cl_rcp (rcp_id);

ALTER TABLE cl_fire_projection_summary ADD CONSTRAINT fk_cl_models_model_id FOREIGN KEY(model_id)
REFERENCES cl_models (model_id);

ALTER TABLE cl_fire_projection_summary ADD CONSTRAINT fk_cl_climatology_years_climatology_year FOREIGN KEY(climatology_year)
REFERENCES cl_climatology_years (climatology_year);
