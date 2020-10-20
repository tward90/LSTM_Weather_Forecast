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
The data was extracted using BigQuery, first by identifying weather stations in the Houston area, then querying the datasets for each year for each station. Houston weather stations were defined using latitude and longitudes, 29.47° to 30.20° and -95.00° to -95.80°, respectively.

## Data Visualization:

###### *Original data from October 2018 to October 2020*
![Original data from October 2018 to October 2020](/images/dataWithSeasonality.png)

As expected, the dataset shows strong annual seasonality, which needs to be removed before training a timeseries machine learning model to it.

###### *Differenced data from October 2018 to October 2020*
![Differenced data from October 2018 to October 2020](/images/differencedData.png)

After differencing the data by a period of 365 days, most of the seasonality was removed as demonstrated in autocorrelation plots for the different features in the dataset.

###### *Autocorrelation plot of temperature after seasonality reduction*
![Autocorrelation plot of temperature after seasonality reduction](/images/differencedData.png)

## Long Short-Term Memory (LSTM) Model:

The differenced data was then split into successive slices for training (70%), validation (20%), and testing (10%). The data was then scaled using scikit learn's standard scaler.

The training, validation, and test datasets were then processed to create datasets of sliding windows over the time series provided as an array which results in windows of consecutive data with an input width of 6, label width of 6, and shift of 1. This allows us to train the model to make prediction of weather for six days given an input of six days of data.

## Model Tunning and Structure:

A sequential model was set up to include the following succession of layers: LSTM, Dense, Dropout, Dense, Activation. The optimal parameters for each layer were determined using the [hyperas](https://github.com/maxpumperla/hyperas) distributions module. The model was then compiled using mean absolute error for the loss function, adam for the optimizer.

![Training and Validation Loss Comparison](/images/bestModelTrainingVsValidationLoss.png)

###### *Evaluation of best performing model*
![Results for the best model](/images/bestModelResults.png)

###### *Parameters for the best model*
![Parameters for the best model](/images/bestModelParams.png)