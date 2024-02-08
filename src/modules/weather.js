import axios from "axios";
import { conditionObj, getWeekDay, formatDate, formatTime } from "./utils";

export async function getWeather(location, units) {
  try {
    const response = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=fae3268930e94dde962101038230812&q=${location}&days=5`)
    const weatherData = response.data

    console.log(weatherData)
    console.log(parsedWeatherObj(weatherData))
    return parsedWeatherObj(weatherData, units)
  } catch (err) {
    console.log("error getting weather", err.response.data.error)
    switch (err.response.data.error.code) {
      case 1003:
        alert("Please enter a city")
        break;

      case 1006:
        alert("Please enter a valid city")
        break;

      default:
        alert("Error getting weather")
        break;
    }
    return err
  }
}

function parsedWeatherObj(data, units) {
  let currentLocalTime = new Date(data.location.localtime)
  return {
    general: {
      city: data.location.name,
      local_time: formatTime(currentLocalTime),
      date: formatDate(currentLocalTime),
      tz: data.location.tz_id,
    },
    current: parsedCurrentWeather(data, units),
    forecastDaily: parsedForecastDaily(data.forecast, units),
    forecastHourly: parsedForecastHourly(data.forecast.forecastday[0], currentLocalTime, units)
  }
}

function parsedCurrentWeather(data, units) { // data = weatherData.current
  return {
    is_day: data.is_day,
    temperature: units === 'si' ? data.current.temp_c : data.current.temp_f,
    max_temp: units === 'si' ? data.forecast.forecastday[0].day.maxtemp_c : data.forecast.forecastday[0].day.maxtemp_f,
    min_temp: units === 'si' ? data.forecast.forecastday[0].day.mintemp_c : data.forecast.forecastday[0].day.mintemp_f,
    feels_like: units === 'si' ? data.current.feelslike_c : data.current.feelslike_f,
    humidity: data.current.humidity,
    precipitation: units === 'si' ? data.current.precip_mm : data.current.precip_in,
    windspeed: units === 'si' ? data.current.wind_kph : data.current.wind_mph,
    condition: conditionObj(data.current.condition.code, data.current.is_day),
  }
}

function parsedForecastDaily(data, units) { // data = weatherData.forecast
  let arr = []

  for (let i = 1; i < 3; i++) {
    let tempForecast = data.forecastday[i]
    let tempObj = {
      average_temperature: units === 'si' ? tempForecast.day.avgtemp_c : tempForecast.day.avgtemp_f,
      max_temp: units === 'si' ? tempForecast.day.maxtemp_c : tempForecast.day.maxtemp_f,
      min_temp: units === 'si' ? tempForecast.day.mintemp_c : tempForecast.day.mintemp_f,
      condition: conditionObj(tempForecast.day.condition.code, 1),
      date: tempForecast.date,
      weekday: getWeekDay(tempForecast.date)
    }
    arr.push(tempObj)
  }

  return arr
}

function parsedForecastHourly(data, currentLocalTime, units) { // data = weatherData.forecast.forecastday[0]
  return (
    data.hour.map((obj) => {
      let objTime = new Date(obj.time)
      if (currentLocalTime.getTime() < objTime.getTime()) {
        return {
          is_day: obj.is_day,
          temperature: units === 'si' ? obj.temp_c : obj.temp_f,
          precipitation: units === 'si' ? obj.precip_mm : obj.precip_in,
          condition: conditionObj(obj.condition.code, obj.is_day),
          time: formatTime(objTime, 'hourly')
        }
      }
    }).filter(obj => {
      if (obj) {
        return obj
      }
    })
  )
}
// getWeather('london')