import json
import requests
from config import api_key
from datetime import datetime

def weather_forecast():
    # Make request for seven day forecast
    url = 'https://api.openweathermap.org/data/2.5/onecall?lat=29.7604&lon=-95.3698&exclude=current,minutely,hourly,alerts'

    query_url = url  + '&units='+ 'imperial'+ '&appid=' + api_key
    weather_response = requests.get(query_url)
    weather_json = weather_response.json()

    # Append features for each day to their respective dictionnary
    case_list = []

    for entry in weather_json['daily']: 
        datetime.fromtimestamp(entry['dt']).strftime('%Y-%m-%d')
        case = {'date':datetime.fromtimestamp(entry['dt']).strftime('%Y-%m-%d'),
                'temp':((entry['temp']['min'])+(entry['temp']['max']))/2,'slp':entry['pressure'],
                'wdsp':entry['wind_speed'],'max':entry['temp']['max'],'min':entry['temp']['min']}
        if 'visibility' in entry:
            case['visib'] = entry['visibility']
        else:
            case['visib'] = 'na'
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

    # Slice the list to show six days after the current day
    return case_list[1:7]