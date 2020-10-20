from flask import Flask, render_template, request, jsonify
from Past5DaysWeatherRequest import getHistoricalWeather
import json
import requests
from config import api_key
import time
from datetime import datetime
import pandas as pd

# Create an instance of the app
app = Flask(__name__)

# TODO:
# Use the index route to make an API call to OpenWeatherMap for data from current day and past five days
# Run historical data trough the LSTM model
# Return model results
# Apply necessary transformations to the data (ie. backtrack diff())
# jsonify the data and send to javascript layer

# Create and index route
@app.route('/')
def index():
    return render_template('index.html')

# Create a route to process data
@app.route('/model_data')
def apply_model():
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
                                hail = ('hail', 'mean'),
                                thunder = ('thunder','mean'))
    
    # jsonfiles = json.loads(df.to_json(orient='records'))

    # return jsonify({'model_forecast':jsonfiles})
    return df.to_json(orient='index')

if __name__ == "__main__":
    app.run(debug=True)