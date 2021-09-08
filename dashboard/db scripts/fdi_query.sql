SELECT st.station_name_short, st.lat, st.lon,
rc.rcp_id, md.model_id, cy.climatology_year_range,
fdi.avg_annual_cffdi, fdi.dpy_high, fdi.dpy_very_high,
fdi.dpy_severe, fdi.dpy_extreme, fdi.dpy_catastrophic

FROM public.cl_fire_projection_summary AS fdi 

JOIN	public.cl_stations As st
ON		fdi.station_id = st.station_id

JOIN	public.cl_models As md
ON		fdi.model_id = md.model_id	

JOIN	public.cl_rcp As rc
ON		fdi.rcp_id = rc.rcp_id	

JOIN	public.cl_climatology_years As cy
ON		fdi.climatology_year = cy.climatology_year	

WHERE fdi.station_id = 61078 
