import conditionData from "./weather_conditions.json";

function conditionObj(conditionCode, isDay) {
  let obj = conditionData.find((item) => {
    return item.code === conditionCode
  })

  return {
    code: conditionCode,
    text: isDay ? obj.day : obj.night,
    iconSrc: `./icons/${isDay ? 'day' : 'night'}/${obj.icon}.png`
  }
}

function getWeekDay(date) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const dayNum = new Date(date).getDay()

  return (days[dayNum])
}

function formatDate(input) {
  let date = new Date(input)

  const monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  let day = date.getDate()
  let month = date.getMonth()
  let year = date.getFullYear()


  day = day === 1 || day === 21 || day === 31 ? `${day}st` : day === 2 || day === 22 ? `${day}nd` : day === 3 || day === 23 ? `${day}rd` : `${day}th`

  let monthName = monthsArr[month]

  return (`${getWeekDay(date)}, ${day} of ${monthName}, ${year}`)
}

function formatTime(time, interval) {
  let hours = new Date(time).getHours()
  let minutes = new Date(time).getMinutes()
  let newFormat = hours >= 12 ? "PM" : "AM"

  hours = hours === 12 || hours === 24 ? 12 : hours % 12
  minutes = minutes < 10 ? `0${minutes}` : minutes

  if (interval === "hourly") {
    return (`${hours} ${newFormat}`)
  } else {
    return (`${hours}:${minutes} ${newFormat}`)
  }
}

export { conditionObj, getWeekDay, formatDate, formatTime }