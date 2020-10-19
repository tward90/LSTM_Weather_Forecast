from flask import Flask, render_template, request, jsonify
from Past5DaysWeatherRequest import getHistoricalWeather
import json
import requests
from config import api_key
import time
import datetime as dt
from datetime import datetime
import pandas as pd
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.preprocessing import timeseries_dataset_from_array
import numpy as np
from flask import Flask
from flask_caching import Cache

config = {
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "simple", # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300
}

# Create an instance of the app
app = Flask(__name__)

# tell Flask to use the above defined config
app.config.from_mapping(config)
cache = Cache(app)

# Create and index route
@app.route('/')
def index():
    return render_template('index.html')

# Create a route to process data with our LSTM model
@app.route('/model_data')
@cache.cached(timeout=600)
def apply_model():
    ################################################################################
    # STEP 1: GET DATA FROM OPENWEATHERMAP API
    ################################################################################
    # Determine the current date and the past five days
    days = pd.date_range(dt.date.today()-dt.timedelta(days=5), periods=6, freq="D")
    days = days[1:]

    # Make requests for each day to the OpenWeatherMap API
    json_data = []
    for day in days:
        url = 'http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=29.7604&lon=-95.3698'
        query_url = url  + '&dt='+ str(round(datetime.timestamp(day))) + '&units='+ 'imperial'+ '&appid=' + api_key
        weather_response = requests.get(query_url)
        weather_json = weather_response.json()
        json_data.append(weather_json)

    # Append features for each day to their respective dictionnary
    case_list = []
    for i in range(len(days)):
        for entry in json_data[i]['hourly']:
            # Test to make sure the features are included in the weather report        
            if ('temp' in entry) & ('dew_point'in entry) & ('pressure' in entry) & ('visibility' in entry):
                case = {'date':days[i].date(),'temp': entry['temp'], 'dewp': entry['dew_point'], 'slp':entry['pressure'],
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
    
    ################################################################################
    # STEP 2: DIFFERENCE THE DATA FROM OWM API BY 365 DAYS USING LAST YEARS DATA
    ################################################################################
    # Load data from a year ago
    data_to_diff_with = pd.read_csv('last_year_lookup.csv', parse_dates=[0])
    data_to_diff_with.set_index('Date', inplace=True)

    # Calculate dates a year ago
    new_date_start = df.index[0] - pd.DateOffset(years=1)
    new_date_stop = df.index[4] - pd.DateOffset(years=1)

    # Slice the data needed from last year
    df_a_year_ago = data_to_diff_with[new_date_start:new_date_stop]

    # Append the two dataframes, last year's and this year, and difference them
    new_df = df_a_year_ago.append(df)
    diff_df = new_df.diff(periods=5).dropna()

    ################################################################################
    # STEP 3: SCALE THE DATA
    ################################################################################
    # Import scaling parameters 
    scaler_data = pd.read_csv('scaler_data.csv')

    # Apply scaling to diff_df
    scaled_df = diff_df.sub(np.array(scaler_data["scale_means"]))
    scaled_df = scaled_df.div(np.array(scaler_data["scale_sdev"]))

    ################################################################################
    # STEP 4: TRANFORM THE DATA INTO TENSORS
    ################################################################################
    x = scaled_df.values
    y = np.expand_dims(x, axis=0)

    ################################################################################
    # STEP 5: LOAD THE DATA AND FEED IT INTO THE MODEL
    ################################################################################
    # Load the trained LSTM model from file
    model = tf.keras.models.load_model('sameDifference')
    predictions = model.predict(y)[0,::]

    ################################################################################
    # STEP 6: INVERT THE DATA
    ################################################################################
    # Revert the data to dataframe format
    pred_df = pd.DataFrame(predictions, columns=diff_df.columns, index = diff_df.index + dt.timedelta(days=5))

    # Remove the scaling
    unscaled_df = pred_df.mul(np.array(scaler_data["scale_sdev"]))
    unscaled_df = unscaled_df.add(np.array(scaler_data["scale_means"]))

    # Remove the difference
    pred_lastyear_date_start = unscaled_df.index[0] - pd.DateOffset(years=1)
    pred_lastyear_date_stop = unscaled_df.index[4] - pd.DateOffset(years=1)

    # Slice the data needed from last year
    pred_df_a_year_ago = data_to_diff_with[pred_lastyear_date_start:pred_lastyear_date_stop]
    pred_df_a_year_ago

    # Create the final dataset
    data = unscaled_df.add(pred_df_a_year_ago.values)
    print(data)
    return data.to_json(orient='index')

# Create a route to process data
@app.route('/forecast_data')
@cache.cached(timeout=600)
def get_forecast():
    # Make request for seven day forecast
    url = 'https://api.openweathermap.org/data/2.5/onecall?lat=29.7604&lon=-95.3698&exclude=current,minutely,hourly,alerts'

    query_url = url  + '&units='+ 'imperial'+ '&appid=' + api_key
    weather_response = requests.get(query_url)
    weather_json = weather_response.json()

    # Append features for each day to their respective dictionnary
    case_list = []

    for entry in weather_json['daily']: 
        datetime.fromtimestamp(entry['dt']).strftime('%Y-%m-%d')
        case = {'date':datetime.fromtimestamp(entry['dt']).strftime('%Y-%m-%d'), 'dewp':entry['dew_point'],
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

    return pd.DataFrame(case_list[1:7]).to_json(orient='index')

if __name__ == "__main__":
    app.run(debug=True)