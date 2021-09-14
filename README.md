# climate-change-dashboard
## Monash Uni Data Analytics Bootcamp Project 2  
## Introduction  
Evidence of global heating has been accumulating over the past three decades and it is now widely accepted that the climate is undergoing a rapid change.  In Australia the major impacts of global heating include increased occurances of heat waves, changes to the rainfall patterns, and increased occurances of days where the weather enhances bush fires.  

The project consists of three components:  
* The sql database to house the climate data and to provide data to the web page  
* The API to provide a URL for web page queries  
* The web page to provde the means to explore the data 

## Data  
The data were downloaded from [Climate Change in Australia](https://www.climatechangeinaustralia.gov.au/en/obtain-data/download-datasets/) which is a collaboration between the CSIRO and the Australian Government Bureau of Meteorology.  

## File Structure 
* ```README.md```  
* ```Future_Climate_Predictions_for_Australia.pdf``` Project proposal  
* ```Project2_presentation.pdf``` Project presentation 
* ```requirements.txt``` Python requirements 
* ```/dashboard```  
  * ```index.html``` Landing page for the web site 
  * ```/api```  Python scripts for the api 
  * ```/data```  Input csv files to put into the database 
  * ```/load_db```  Python scripts to build the database 
  * ```/static``` Scripts to run the web site  

## Installation Notes  
The landing page is ```climate-change-dashboard/dashboard/index.html```  

**Build the database**   
The application builds a database called Climate_DB in a PostgreSQL data base, assuming that the username is postgres.    
1. Create a python environment using the ```requirements.txt``` file. 
2. Change directory to ```climate-change-dashboard/dashboard/load_db```  
2. Edit ```config.py``` to set your postgres password.   
3. Run ```load-tables.py``` to create and load the data.    

**Start the app to serve the data**  
1. Change directory to ```climate-change-dashboard/dashboard/api```    
2. Edit ```api_keys.py``` to set your postgres password.     
3. Run ```app.py```.      


