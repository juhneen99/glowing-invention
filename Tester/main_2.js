const apiKey = "2a6e4864588d051d19a67b90d996f4f8"; // Replace with your API key
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=`;

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

// Initialize the map (make sure the id in HTML is "map")
let map = L.map('map').setView([51.505, -0.09], 10); // Default view
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// To keep track of markers
let currentMarker;

async function scanWeather(city) {
    try {
        const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();

        // Log data for debugging purposes
        console.log(data);

        // Update weather information
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + " °C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        // Calculate local time in city based on timezone offset
        const timezoneOffset = data.timezone; // Offset in seconds from UTC
        const localTime = new Date(new Date().getTime() + timezoneOffset * 1000);
        const utcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000; // Current UTC time in ms
        document.querySelector(".timezone").innerHTML = `Local Time: ${localTime.toLocaleTimeString()}`;

        // Update weather icon based on condition
        if (data.weather[0].main === "Clear") {
            weatherIcon.src = "images/sun.gif";
        } else if (data.weather[0].main === "Clouds") {
            weatherIcon.src = "images/clouds.png";
        } else if (data.weather[0].main === "Rain") {
            weatherIcon.src = "images/rain.png";
        } else if (data.weather[0].main === "Mist") {
            weatherIcon.src = "images/mist.png";
        } else if (data.weather[0].main === "Drizzle") {
            weatherIcon.src = "images/drizzle.png";
        } else if (data.weather[0].main === "Snow") {
            weatherIcon.src = "images/snow.png";
        }

        // Update map view based on city coordinates
        const lat = data.coord.lat;
        const lon = data.coord.lon;
        map.setView([lat, lon], 10);

        // Remove the existing marker if there is one
        if (currentMarker) {
            map.removeLayer(currentMarker);
        }

        // Add a new marker
        currentMarker = L.marker([lat, lon]).addTo(map);

    } catch (error) {
        alert(error.message);
    }
}

// Add event listener to search button
searchBtn.addEventListener("click", () => {
    const city = searchBox.value;
    if (city !== "") {
        scanWeather(city);
    }
});
