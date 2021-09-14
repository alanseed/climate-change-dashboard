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