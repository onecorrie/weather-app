function refreshWeather(response) {
  // Hide any previous error messages
  let errorMessageElement = document.querySelector("#error-message");
  errorMessageElement.style.display = "none";

  // Update weather details
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let iconElement = document.querySelector("#icon");

  let data = response.data;
  let temperature = Math.round(data.temperature.current);
  let description =
    data.condition.description.charAt(0).toUpperCase() +
    data.condition.description.slice(1);
  let windSpeed = Math.round(data.wind.speed);
  let humidity = data.temperature.humidity;
  let iconUrl = data.condition.icon_url;
  let date = new Date(data.time * 1000);

  cityElement.innerHTML = data.city;
  timeElement.innerHTML = formatDate(date);
  descriptionElement.innerHTML = description;
  humidityElement.innerHTML = `${humidity}%`;
  windSpeedElement.innerHTML = `${windSpeed} mph`;
  temperatureElement.innerHTML = temperature;
  iconElement.innerHTML = `<img src="${iconUrl}" alt="${description}" class="weather-app-icon" />`;
}

function formatDate(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert to 12-hour format

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  // Add leading zeros if needed
  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${day} ${hours}:${minutes} ${ampm}`;
}
function searchCity(city) {
  let apiKey = "431b9de7d387o54038eae699at6f1ba4";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${encodeURIComponent(
    city
  )}&key=${apiKey}&units=imperial`;
  axios
    .get(apiUrl)
    .then(refreshWeather)
    .catch(function (error) {
      console.error("Error fetching weather data:", error);
      displayErrorMessage(
        "Sorry, we couldn't find weather data for that location. Please try again."
      );
    });
}

//  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=imperial`;

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  let city = searchInput.value.trim();
  if (city) {
    searchCity(city);
  } else {
    displayErrorMessage("Please enter a city.");
  }
}

function displayErrorMessage(message) {
  let errorMessageElement = document.querySelector("#error-message");
  errorMessageElement.innerHTML = message;
  errorMessageElement.style.display = "block";
}

// Event Listener for Search Form
let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

// Default city on page load
searchCity("Austin");
