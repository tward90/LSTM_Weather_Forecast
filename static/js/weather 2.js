
d3.json("dummy_data.json").then((weatherData) => {
  const data = Object.values(weatherData);
  first_rd = Object.values(weatherData)[0].rain_drizzle
  const dates = Object.keys(weatherData)

d3.select(".viz_display").select("img")
  .attr("src",  `${first_rd >=.5 ?"../../templates/Assets/rain.jpg":"../../templates/Assets/sunny.jpg"}`)

// d3.select(".viz_display").select(".card-body")
//   .selectAll('p')
//   .data(dates)
//   .enter()
//   .append('p')
//   .html(d  => `<div><strong>Date</strong>: ${d} </div>`)
//   .attr("class",  "col-md-2 col-sm-6")

d3.select(".viz_display").select(".card-body")
  .selectAll('p')
  .data(data)
  .enter()
  .append('p')
  .append(d  => `<div><strong>Temperature</strong>: ${d.temp.toFixed(0)}° <br> <strong>Low Temp</strong>: ${d.min.toFixed(0)}° <br> <strong>High Temp</strong>: ${d.max.toFixed(0)}° <br><strong>Chance of Rain</strong>: ${d.rain_drizzle * 100}%</div>`)
  // .attr("class",  "col-md-2 col-sm-6")
});