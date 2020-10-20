
d3.json("dummy_data.json").then((weatherData) => {
  const data = Object.values(weatherData);
  first_rd = Object.values(weatherData)[0].rain_drizzle
  const date_string = Object.keys(weatherData)

  date_int = date_string.map(d => parseInt(d))

  date = date_int.map(d => new Date(d))

  function getDayOfWeek(date) {
    const dayOfWeek = new Date(date).getDay();    
    return isNaN(dayOfWeek) ? null : 
      ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'][dayOfWeek];
  }

  d3.select(".viz_display").select("img")
    .attr("src",  `${first_rd >=.5 ?"../../templates/Assets/rain.jpg":"../../templates/Assets/sunny.jpg"}`)

  d3.select(".viz_display").select(".card-body")
    .selectAll('div')
    .data(date)
    .enter()
    .append('div')
    .html(d  => `<p><strong>Date</strong>: ${getDayOfWeek(d)}, ${d.toLocaleString('default', {month: 'short'})} ${d.getDate()} </p>`)
    .attr("class",  "col-md-2 col-sm-6")

  d3.select(".viz_display").select(".card-body")
    .selectAll('p')
    .data(data)
    .append('p')
    .html(d  => `<strong>Temperature</strong>: ${d.temp.toFixed(0)}° <br>
                    <strong>Low Temp</strong>: ${d.min.toFixed(0)}° <br>
                    <strong>High Temp</strong>: ${d.max.toFixed(0)}° <br>
                    <strong>Chance of Rain</strong>: ${d.rain_drizzle * 100}%`)
});