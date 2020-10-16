import json
import requests
from config import api_key
import time
from datetime import datetime
import pandas as pd

def getHistoricalWeather():
    # Determine the current date and the past five days
    days = []
    for i in range(6):
        dt = time.time()-i*24*60*60
        days.append(dt)

    # Make requests for each day to the OpenWeatherMap API
    json_data = []
    for day in days:
        url = 'http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=29.7604&lon=-95.3698'
        query_url = url  + '&dt='+ str(round(day)) + '&units='+ 'imperial'+ '&appid=' + api_key
        weather_response = requests.get(query_url)
        weather_json = weather_response.json()
        json_data.append(weather_json)

    # Convert time stamps to dates
    dates = []
    for dt in days:
        date = datetime.fromtimestamp(dt).strftime('%Y-%m-%d')
        dates.append(date)

    # Append features for each day to their respective dictionnary
    case_list = []
    for i in range(len(dates)):
        for entry in json_data[i]['hourly']:
            # Test to make sure the features are included in the weather report        
            if ('temp' in entry) & ('dew_point'in entry) & ('pressure' in entry) & ('visibility' in entry):
                case = {'date':dates[i],'temp': entry['temp'], 'dewp': entry['dew_point'], 'slp':entry['pressure'],
                        'wdsp':entry['wind_speed'], 'visib':entry['visibility']}
                if (entry['weather'][0]['main'] == 'Rain')|(entry['weather'][0]['main'] == 'Drizzle')|(entry['weather'][0]['main'] == 'Thunderstorm'):
                    case['rain_drizzle'] = 1
                else:
                    case['rain_drizzle'] = 0
                if entry['weather'][0]['main'] == 'Fog':
                    case['fog'] = 1
                else:
                    case['fog'] = 0
                if entry['weather'][0]['main'] == 'Snow':
                    case['snow_ice_pellets'] = 1
                else:
                    case['snow_ice_pellets'] = 0
                if entry['weather'][0]['main'] == 'Hail':
                    case['hail'] = 1
                else:
                    case['hail'] = 0
                if entry['weather'][0]['main'] == 'Thunderstorm':
                    case['thunder'] = 1
                else:
                    case['thunder'] = 0
                case_list.append(case)

    # Create a dataframe with the case_list
    df = pd.DataFrame(case_list)

    # Group by dates and aggregate to get averages for each day and min and max temperature
    df = df.groupby(['date']).agg(temp = ('temp', 'mean'),
                                dewp = ('dewp', 'max'),
                                slp = ('slp','mean'),
                                visib = ('visib', 'mean'),
                                wdsp = ('wdsp','mean'),
                                min = ('temp','min'),
                                max = ('temp','max'),
                                fog = ('fog','mean'),
                                rain_drizzle = ('rain_drizzle', 'mean'),
                                snow_ice_pellets = ('snow_ice_pellets', 'mean'),
                                hai = ('hail', 'mean'),
                                thunder = ('thunder','mean'))

    return df