// ///////////////////////////////////////////////////////////
// // GLOBAL VARIABLES
// ///////////////////////////////////////////////////////////
let futureDates,
    modelResults,
    modelAvgTemp,
    modelMinTemp,
    modelMaxTemp,
    modelDewp,
    modelPres,
    modelVisib,
    modelWdsp,
    modelRain,
    modelFog,
    modelSnow,
    modelThunder,
    modelHail,
    OWMfutureDates,
    OWMResults,
    OWMAvgTemp,
    OWMMinTemp,
    OWMMaxTemp,
    OWMDewp,
    OWMPres,
    OWMVisib,
    OWMWdsp,
    OWMRain,
    OWMFog,
    OWMSnow,
    OWMThunder,
    OWMHail;

//////////////////////////////////////////////////////////////////
// FUNCTION TO FETCH MODEL RESULTS AND OPENWEATHERMAP FORECAST
//////////////////////////////////////////////////////////////////
function init(){
    d3.json('dummy_data.json')
    .then((response)=>{
        modelResults = response;
        console.log('Model Results:')
        console.log(modelResults);

        // extract the data needed for each graph
        futureDates = Object.keys(modelResults);
        params = Object.values(modelResults);
        modelAvgTemp = params.map(item => Math.round(item['temp']));
        modelMinTemp = params.map(item => Math.round(item['min']));
        modelMaxTemp = params.map(item => Math.round(item['max']));
        modelDewp = params.map(item => Math.round(item['dewp']));
        modelPres = params.map(item => Math.round(item['slp']));
        modelVisib = params.map(item => Math.round(item['visib']));
        modelWdsp = params.map(item => Math.round(item['wdsp']));
        modelRain = params.map(item => Math.round(item['rain_drizzle']));
        modelFog = params.map(item => Math.round(item['fog']));
        modelSnow = params.map(item => Math.round(item['snow_ice_pellets']));
        modelThunder = params.map(item => Math.round(item['thunder']));
        modelHail = params.map(item => Math.round(item['hail']));

        ////////////////////////////////////////////////
        // LSTM MODEL AVERAGE TEMPERATURE PLOT
        ////////////////////////////////////////////////

        // create a trace object with x as the dates and y as the predicted temperatures
        const avgTempTrace = {
            type: 'scatter',
            mode: 'lines',
            name: 'Mean Temperature',
            x: futureDates,
            y: modelAvgTemp,
            line: {color:"#729ECE"}
        };
        const minTempTrace = {
            type: 'scatter',
            mode: 'lines',
            name: 'Min Temperature',
            x: futureDates,
            y: modelMinTemp,
            line: {color:'#FF9E4A'}
        };
        const maxTempTrace = {
            type: 'scatter',
            mode: 'lines',
            name: 'Max Temperature',
            x: futureDates,
            y: modelMaxTemp,
            line: {color:'#67BF5C'}
        };
        // define layout
        const layout = {
            yaxis: {
                title: 'Temperature',
                autorange: true,
                range: [-40,110]
            },
            title: 'Predicted Temperatures'
            // plot_bgcolor: "#AEC7E8"
        };
        Plotly.newPlot('LSTM-plot', [avgTempTrace, minTempTrace, maxTempTrace], layout);
    }); 
    d3.json('dummy_data.json')
    .then((response)=>{
        OWMResults = response;
        console.log('OpenWeatherMap Results:')
        console.log(OWMResults);

        // extract the data needed for each graph
        OWMfutureDates = Object.keys(OWMResults);
        params = Object.values(modelResults);
        OWMAvgTemp = params.map(item => Math.round(item['temp']));
        OWMMinTemp = params.map(item => Math.round(item['min']));
        OWMMaxTemp = params.map(item => Math.round(item['max']));
        OWMDewp = params.map(item => Math.round(item['dewp']));
        OWMPres = params.map(item => Math.round(item['slp']));
        OWMVisib = params.map(item => Math.round(item['visib']));
        OWMWdsp = params.map(item => Math.round(item['wdsp']));
        OWMRain = params.map(item => Math.round(item['rain_drizzle']));
        OWMFog = params.map(item => Math.round(item['fog']));
        OWMSnow = params.map(item => Math.round(item['snow_ice_pellets']));
        OWMThunder = params.map(item => Math.round(item['thunder']));
        OWMHail = params.map(item => Math.round(item['hail']));

        ////////////////////////////////////////////////
        // OPENWEATHERMAP AVERAGE TEMPERATURE PLOT
        ////////////////////////////////////////////////

        // create a trace object with x as the dates and y as the predicted temperatures
        const avgTempTrace = {
            type: 'scatter',
            mode: 'lines',
            name: 'Mean Temperature',
            x: futureDates,
            y: modelAvgTemp,
            line: {color:"#729ECE"}
        };
        const minTempTrace = {
            type: 'scatter',
            mode: 'lines',
            name: 'Min Temperature',
            x: futureDates,
            y: modelMinTemp,
            line: {color:'#FF9E4A'}
        };
        const maxTempTrace = {
            type: 'scatter',
            mode: 'lines',
            name: 'Max Temperature',
            x: futureDates,
            y: modelMaxTemp,
            line: {color:'#67BF5C'}
        };
        // define layout
        const layout = {
            yaxis: {
                title: 'Temperature',
                autorange: true,
                range: [-40,110]
            },
            title: 'Predicted Temperatures'
            // plot_bgcolor: "#AEC7E8"
        };
        Plotly.newPlot('web-forecast-plot', [avgTempTrace, minTempTrace, maxTempTrace], layout);
    }); 
};

init()

//////////////////////////////////////////////////////////
// UPDATE PLOTS PER USER SELECTION
//////////////////////////////////////////////////////////

// Function to change model plot parameters based on user selection    
function chooseModelParameter (parameter){
    switch(parameter){
        case "temp":
            return [modelAvgTemp, modelMinTemp, modelMaxTemp];
        case "Dew Point":
            return modelDewp;
        case "Barometric Pressure":
            return modelPres;
        case "Wind Speed":
            return modelWdsp;
        case "Visibility":
            return modelVisib;
        case "prcp":
            return [modelRain, modelFog, modelSnow, modelThunder, modelHail];
        default:
            return [modelAvgTemp, modelMinTemp, modelMaxTemp];
    }
};
// Function to change OpenWeatherMap plot parameters based on user selection   
function chooseOpenWeatherParameter (parameter){
    switch(parameter){
        case "temp":
            return [OWMTemp, OWMMinTemp, OWMMaxTemp];
        case "Dew Point":
            return OWMDewp;
        case "Barometric Pressure":
            return OWMPres;
        case "Wind Speed":
            return OWMWdsp;
        case "Visibility":
            return OWMVisib;
        case "prcp":
            return [OWMRain, OWMFog, OWMSnow, OWMThunder, OWMHail];
        default:
            return [OWMTemp, OWMMinTemp, OWMMaxTemp];
    }
};

// Event handler to update interactive plots based on user selection
function handlePlotSubmit(){
    // use D3 to select the dropdown menu
    const dropdownMenu = d3.select('#parameters');

    // Assign the value of the dropdown menu option to a variable
    const parameter = dropdownMenu.property('value');

    // build a plot with the new subject
    updateInteractivePlot(parameter);
};

// Function to update the plots
function updateInteractivePlot(parameter){
    // array of available parameters for line graphs
    const parametersArr = [
        "temp",
        "Dew Point",
        "Barometric Pressure",
        "Wind Speed",
        "Visibility"
    ];

    const parameterSelected = parameter;

    if(parametersArr.includes(parameterSelected)){
        // Plot the model temperature results
        if (parameterSelected == 'temp'){
            const modelAvgTempTrace = {
                type: 'scatter',
                mode: 'lines',
                name: 'Mean Temperature',
                x: futureDates,
                y: chooseModelParameter(parameterSelected)[0],
                line: {color:"#729ECE"}
            };
            const modelMinTempTrace = {
                type: 'scatter',
                mode: 'lines',
                name: 'Min Temperature',
                x: futureDates,
                y: chooseModelParameter(parameterSelected)[1],
                line: {color:'#FF9E4A'}
            };
            const modelMaxTempTrace = {
                type: 'scatter',
                mode: 'lines',
                name: 'Min Temperature',
                x: futureDates,
                y: chooseModelParameter(parameterSelected)[2],
                line: {color:'#67BF5C'}
            };
            // define layout
            const layout = {
                yaxis: {
                    title: 'Temperature',
                    autorange: true,
                    range: [-40,110]
                },
                title: 'Predicted Temperatures'
            };
            Plotly.newPlot('LSTM-plot', [modelAvgTempTrace, modelMinTempTrace, modelMaxTempTrace], layout);

            // Plot the forecasted temperatures from OpenWeatherMap
            const OWMAvgTempTrace = {
                type: 'scatter',
                mode: 'lines',
                name: 'Mean Temperature',
                x: futureDates,
                y: chooseOpenWeatherParameter(parameterSelected)[0],
                line: {color:"#729ECE"}
            };
            const OWMMinTempTrace = {
                type: 'scatter',
                mode: 'lines',
                name: 'Min Temperature',
                x: futureDates,
                y: chooseOpenWeatherParameter(parameterSelected)[1],
                line: {color:'#FF9E4A'}
            };
            const OWMMaxTempTrace = {
                type: 'scatter',
                mode: 'lines',
                name: 'Min Temperature',
                x: futureDates,
                y: chooseOpenWeatherParameter(parameterSelected)[2],
                line: {color:'#67BF5C'}
            };
            // define layout
            const OWMlayout = {
                yaxis: {
                    title: 'Temperature',
                    autorange: true,
                    range: [-40,110]
                },
                title: 'Predicted Temperatures'
            };
            Plotly.newPlot('web-forecast-plot', [OWMAvgTempTrace, OWMMinTempTrace, OWMMaxTempTrace], OWMlayout);
        }
        else {
            // Plot model parameter chosen by user
            const modelParamTrace = {
                type: 'scatter',
                mode: 'lines',
                name: `${parameterSelected}`,
                x: futureDates,
                y: chooseModelParameter(parameterSelected),
                line: {color:'#FF9E4A'}
            };
            // define layout
            const layout = {
                yaxis: {
                    title: `${parameterSelected}`,
                    autorange: true,
                    range: [-40,110]
                },
                title: `Predicted ${parameterSelected}`
            };
            Plotly.newPlot('LSTM-plot', [modelParamTrace], layout);

            //  Plot OpenWeather parameter chosen by user
            const OWMParamTrace = {
                type: 'scatter',
                mode: 'lines',
                name: `${parameterSelected}`,
                x: futureDates,
                y: chooseOpenWeatherParameter(parameterSelected),
                line: {color:"#729ECE"}
            };
            // define layout
            const OWMlayout = {
                yaxis: {
                    title: `${parameterSelected}`,
                    autorange: true,
                    range: [-40,110]
                },
                title: `Predicted ${parameterSelected}`
            };
            Plotly.newPlot('web-forecast-plot', [OWMParamTrace], OWMlayout);
        }
    }
    else {
    // create a bar chart to show all other model parameters: rain, fog, snow, thunder, and hail
    const modelRainTrace = {
        x: futureDates,
        y: modelRain,
        name: 'Rain or Drizzle',
        type: 'bar'
    };
    const modelFogTrace = {
        x: futureDates,
        y: modelFog,
        name: 'Fog',
        type: 'bar'
    };
    const modelSnowTrace = {
        x: futureDates,
        y: modelSnow,
        name: 'Snow',
        type: 'bar'
    };
    const modelThunderTrace = {
        x: futureDates,
        y: modelThunder,
        name: 'Thunder',
        type: 'bar'
    };
    const modelHailTrace = {
        x: futureDates,
        y: modelHail,
        name: 'Hail',
        type: 'bar'
    };

    const modelParametersTrace = [modelRainTrace, modelFogTrace, modelSnowTrace, modelThunderTrace, modelHailTrace];

    const modelGroupLayout = {
        barmode: 'group',
        title: 'Precipitation',
        yaxis:{
            title: 'Probability'
        }
    };

    Plotly.newPlot('LSTM-plot', modelParametersTrace, modelGroupLayout);

    // create a bar chart to show all other OpenWeather parameters: rain, fog, snow, thunder, and hail
    const OWMrainTrace = {
        x: futureDates,
        y: OWMRain,
        name: 'Rain or Drizzle',
        type: 'bar'
    };
    const OWMfogTrace = {
        x: futureDates,
        y: OWMFog,
        name: 'Fog',
        type: 'bar'
    };
    const OWMsnowTrace = {
        x: futureDates,
        y: OWMSnow,
        name: 'Snow',
        type: 'bar'
    };
    const OWMthunderTrace = {
        x: futureDates,
        y: OWMThunder,
        name: 'Thunder',
        type: 'bar'
    };
    const OWMhailTrace = {
        x: futureDates,
        y: OWMHail,
        name: 'Hail',
        type: 'bar'
    };

    const OWMParametersTrace = [OWMrainTrace, OWMfogTrace, OWMsnowTrace, OWMthunderTrace, OWMhailTrace];

    const OWMGroupLayout = {
        barmode: 'group',
        title: 'Precipitation',
        yaxis:{
            title: 'Probability'
        }
    };

    Plotly.newPlot('web-forecast-plot', OWMParametersTrace, OWMGroupLayout);
    }
};