// Format a JavaScript Date object as "Day HH:MM AM/PM"
function formatDate(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return `${days[date.getDay()]} ${hours}:${minutes} ${ampm}`;
}

// Format a Unix timestamp (in seconds) into weekday abbreviation like "Mon"
function formatDay(timestamp) {
  const date = new Date(timestamp * 1000);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

// Update the current weather section of the page
function displayCurrentWeather(response) {
  const data = response.data;
  document.querySelector("#city").textContent = data.city;
  document.querySelector("#time").textContent = formatDate(
    new Date(data.time * 1000)
  );
  document.querySelector("#description").textContent =
    data.condition.description.charAt(0).toUpperCase() +
    data.condition.description.slice(1);
  document.querySelector(
    "#humidity"
  ).textContent = `${data.temperature.humidity}%`;
  document.querySelector("#wind-speed").textContent = `${Math.round(
    data.wind.speed
  )} mph`;
  document.querySelector("#temperature").textContent = `${Math.round(
    data.temperature.current
  )}`;
  document
    .querySelector("#weather-icon")
    .setAttribute("src", data.condition.icon_url);
  document
    .querySelector("#weather-icon")
    .setAttribute("alt", data.condition.description);
}

// Update the 5‑day forecast section of the page
function displayForecast(response) {
  const forecast = response.data.daily;
  const forecastContainer = document.querySelector(".weather-forecast");
  let html = `<div class="weather-forecast">`;

  // Show next five days (skip index 0 which is today)
  for (let i = 1; i < Math.min(forecast.length, 6); i++) {
    const day = forecast[i];
    html += `
      <div class="weather-forecast-day">
        <div class="weather-forecast-date">${formatDay(day.time)}</div>
        <img src="${day.condition.icon_url}" alt="${
      day.condition.description
    }" class="weather-forecast-icon" />
        <div class="weather-forecast-temperatures">
          <div class="weather-forecast-temperature">
            <strong>${Math.round(day.temperature.maximum)}º</strong>
          </div>
          <div class="weather-forecast-temperature-min">
            ${Math.round(day.temperature.minimum)}º
          </div>
        </div>
      </div>
    `;
  }
  html += `</div>`;
  forecastContainer.innerHTML = html;
}

// Fetch both current weather and forecast for a given city
function searchCity(city) {
  const apiKey = "431b9de7d387o54038eae699at6f1ba4";
  const units = "imperial"; // Fahrenheit, wind in mph
  const currentUrl = `https://api.shecodes.io/weather/v1/current?query=${encodeURIComponent(
    city
  )}&key=${apiKey}&units=${units}`;
  const forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${encodeURIComponent(
    city
  )}&key=${apiKey}&units=${units}`;

  // Current weather
  axios
    .get(currentUrl)
    .then(displayCurrentWeather)
    .catch((err) => console.error("Error fetching current weather:", err));

  // Forecast
  axios
    .get(forecastUrl)
    .then(displayForecast)
    .catch((err) => console.error("Error fetching forecast:", err));
}

// Handle the search form submission
function handleSearchSubmit(event) {
  event.preventDefault();
  const input = document.querySelector("#search-form-input");
  searchCity(input.value.trim());
}

// Format and display the current date/time on page load
const nowElement = document.querySelector("#time");
nowElement.textContent = formatDate(new Date());

// Attach event listener to the form
document
  .querySelector("#search-form")
  .addEventListener("submit", handleSearchSubmit);

// On initial load, show Paris weather
searchCity("Paris");
