import { continousTime } from "./utils"
import { getWeather } from "./weather"

function renderWeather({ general, current, forecastDaily, forecastHourly }, units) {
  renderGeneralInfo(general)
  renderCurrentWeather(current, units)
  renderDailyWeather(forecastDaily, units)
  renderHourlyWeather(forecastHourly, units)
  document.querySelector('main').classList.remove('blurred')
}

function renderGeneralInfo(data) {
  setValue('general-city', data.city)
  setValue('general-date', data.date)
  setValue('general-time', data.local_time)
}

function renderCurrentWeather(data, units) {
  setValue('current-condition-text', data.condition.text)
  setValue('current-temperature', units === 'si' ? `${data.temperature}°C` : `${data.temperature}°F`)
  renderIcon('current-condition-icon', data.condition.iconSrc)
  setValue('current-max_temp', units === 'si' ? `H: ${data.max_temp}°C` : `H: ${data.max_temp}°F`)
  setValue('current-min_temp', units === 'si' ? `L: ${data.min_temp}°C` : `L: ${data.min_temp}°F`)
  setValue('current-feels-like', units === 'si' ? `${data.feels_like}°C` : `${data.feels_like}°F`)
  setValue('current-humidity', data.humidity)
  setValue('current-precipitation', units === 'si' ? `${data.precipitation}mm` : `${data.precipitation}in`)
  setValue('current-wind-speed', units === 'si' ? `${data.windspeed}kph` : `${data.windspeed}mph`)
}

function renderDailyWeather(data, units) {
  document.querySelector('[data-forecastDaily]').innerHTML = ""
  data.forEach(day => {
    const element = document.getElementById('forecastDailyTemplate').content.cloneNode(true)
    setValue('forecastDaily-weekday', day.weekday, element)
    setValue('forecastDaily-condition-text', day.condition.text, element)
    renderIcon('forecastDaily-condition-icon', day.condition.iconSrc, element)
    setValue('forecastDaily-average-temperature', units === 'si' ? `${day.average_temperature}°C` : `${day.average_temperature}°F`, element)
    setValue('forecastDaily-max_temp', units === 'si' ? `H : ${day.max_temp}°C` : `H : ${day.max_temp}°F`, element)
    setValue('forecastDaily-min_temp', units === 'si' ? `L : ${day.min_temp}°C` : `L : ${day.min_temp}°F`, element)
    document.querySelector('[data-forecastDaily]').appendChild(element)
  })
}

function renderHourlyWeather(data, units) {
  document.querySelector('[data-forecastHourly]').innerHTML = ""
  data.forEach(hour => {
    const element = document.getElementById('forecastHourlyTemplate').content.cloneNode(true)
    setValue('forecastHourly-time', hour.time, element)
    setValue('forecastHourly-condition-text', hour.condition.text, element)
    renderIcon('forecastHourly-condition-icon', hour.condition.iconSrc, element)
    setValue('forecastHourly-temperature', units === 'si' ? `${hour.temperature}°C` : `${hour.temperature}°F`, element)
    setValue('forecastHourly-precipitation', units === 'si' ? `Precip: ${hour.precipitation}mm` : `Precip: ${hour.precipitation}in`, element)
    document.querySelector('[data-forecastHourly]').appendChild(element)
  })
}

function renderIcon(selector, value, parent = document) {
  parent.querySelector(`[data-${selector}]`).innerHTML = `<img src="${value}" value="" >`
}

function setValue(selector, value, parent = document) {
  parent.querySelector(`[data-${selector}]`).textContent = value
}

export default function initialise() {
  let searchBarInput = document.querySelector('[data-search-bar-input')
  searchBarInput.value = ""
  let location = 'london'
  let units = 'si'
  let tz = 'Europe/London'
  getWeather(location, units).then(res => renderWeather(res, units))

  document.querySelector('[data-search-btn]').addEventListener('click', () => {
    event.preventDefault()
    location = searchBarInput.value
    // console.log(location)
    // parsedWeatherObj('new york', 'si').then(res => console.log(res))
    getWeather(location, units).then(res => {
      renderWeather(res, units)
      tz = res.general.tz
    })
    searchBarInput.value = ""
  })

  setInterval(() => {
    console.log(tz);
    setValue('general-time', continousTime(tz))
  }, 60000);
}