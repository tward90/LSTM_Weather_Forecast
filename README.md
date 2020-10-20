# Houston Machine-Learning Weather Forecast

## Team Members:
* Tyler Ward
* Tanner Lievois
* Jonathan Antia

## Objective: 
Apply machine learning models to the noaa_gsod dataset to forecast Houston weather.

## Data Overview:
NOAA GSOD - Global Surface Summary of the Day Weather Data
Source: https://www.kaggle.com/noaa/gsod?select=gsod1950
This public dataset was created by the National Oceanic and Atmospheric Administration (NOAA) and includes global data obtained from the USAF Climatology Center. This dataset covers GSOD data between 1929 and present (updated daily), collected from over 9000 stations.
Global summary of the day is comprised of a dozen daily averages computed from global hourly station data. Daily weather elements include mean values of: temperature, dew point temperature, sea level pressure, station pressure, visibility, and wind speed plus maximum and minimum temperature, maximum sustained wind speed and maximum gust, precipitation amount, snow depth, and weather indicators. Except for U.S. stations, 24-hour periods are based upon UTC times.

## ETL:
The data was extracted using Google's BigQuery, first by identifying weather stations in the Houston area, then querying the datasets for each year. Weather stations in the Houston area were delimited using latitude and longitudes, 29.47° to 30.20° and -95.00° to -95.80°, respectively. The data from all station was then averaged per day, resulting in a complete daily dataset from January 1st, 1946 to October 8th, 2020.

###### *Houston Area NOAA Weather Stations*
![Map of Houston Showing the location of stations used in the project](/images/mapStations.png)

## Data Visualization:

###### *Original data from October 2018 to October 2020*
![Original data from October 2018 to October 2020](/images/dataWithSeasonality.png)

As expected, the dataset showed strong annual seasonality, which needed to be removed before training a timeseries machine learning model with it.

###### *Differenced data from October 2018 to October 2020*
![Differenced data from October 2018 to October 2020](/images/differencedData.png)

After differencing the data by a period of 365 days, most of the seasonality was removed as demonstrated in autocorrelation plots for the different features in the dataset.

![Autocorrelation plot of temperature after seasonality reduction](/images/tempAutocorrelation.png)

## Long Short-Term Memory (LSTM) Neural Network Model:

The differenced data was then split into successive slices for training (70%), validation (20%), and testing (10%). The data was then scaled using scikit learn's standard scaler.

The training, validation, and test data were then converted into arrays. The arrays were further subdivided using a sliding window to split the data into periods of 12 days were the first six days correspond to input data, and the next six days correspond to labels (or values to predict), with a 1 day shift. This allows us to train the model to make weather forecasts for six days given an input of six days of historic data.

## Model Tunning and Structure:

A sequential model was setup to include the following succession of layers: LSTM, Dense, Dropout, Dense, Activation. The optimal parameters for each layer were determined using the [hyperas](https://github.com/maxpumperla/hyperas) distributions module. The model was then compiled using mean absolute error for the loss function and adam for the optimizer.

![Training and Validation Loss Comparison](/images/bestModelTrainingVsValidationLoss.png)

###### *Evaluation of best performing model*
![Results for the best model](/images/bestModelResults.png)

###### *Parameters for the best model*
![Parameters for the best model](/images/bestModelParams.png)

## Model QC:

Residual values appear to be randomly dispersed around the horizontal axis, indicating that seasonality was effectively removed for the training data and did not affect the model results. Also, the Q-Q plot confirms a close to normal distribution around zero.

###### *Model Residuals And Performance*
![Model Residuals And Performance Plots](/images/modelResidualsAndPerformancePlots.png)

In the example below, the values predicted by the model match the trends observed in the target variables.

###### *Model Temperature Predictions (orange) Versus Targets (blue)*
![temperature Predictions](/images/temperaturePredictions.png)

###### *Model Temperature Predictions for 36 days*
![36 day temperature predictions](/images/Figure_1.png)

## Application:

A dynamic comparison of our LSTM model predictions versus a weather forecast from OpenWeatherMap can be viewed in our [web application](https://lstm-weather.herokuapp.com/).