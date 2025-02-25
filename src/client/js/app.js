const SERVER_URL = "http://localhost:3000";

// Fetch coordinates through your server
async function fetchCoordinates(city) {
  try {
    const response = await fetch(`${SERVER_URL}/api/location?destination=${city}`);
    const data = await response.json();

    if (!data.geonames || data.geonames.length === 0) {
      throw new Error("No results found for this city.");
    }

    return {
      latitude: data.geonames[0].lat,
      longitude: data.geonames[0].lng,
    };
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw new Error("Please try again, something went wrong while fetching coordinates.");
  }
}

// Fetch weather through your server
async function fetchWeather(latitude, longitude) {
  try {
    const response = await fetch(`${SERVER_URL}/api/weather?lat=${latitude}&lng=${longitude}`);
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      throw new Error("No weather data found for this location.");
    }

    return data.data[0];
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw new Error("Failed to fetch weather data. Please try again.");
  }
}

// Fetch image through your server
async function fetchImage(cityName) {
  try {
    const response = await fetch(`${SERVER_URL}/api/image?destination=${cityName}`);
    const data = await response.json();

    if (!data.hits || data.hits.length === 0) {
      throw new Error("No image found for the city.");
    }

    return data.hits[0].webformatURL;
  } catch (error) {
    console.error("Error fetching image:", error);
    throw new Error("Failed to fetch an image. Please try again.");
  }
}

// Handle form submission 
async function handleFormSubmit(event) {
  event.preventDefault();
  const cityName = document.getElementById('destination').value;
  const travelDate = document.getElementById('departure-date').value;

  const resultSection = document.getElementById('results');
  resultSection.innerHTML = "<p>Loading...</p>";

  try {
    const { latitude, longitude } = await fetchCoordinates(cityName);
    const weatherData = await fetchWeather(latitude, longitude);
    const cityImage = await fetchImage(cityName);

    resultSection.innerHTML = `
      <h2>${cityName}</h2>
      <img src="${cityImage}" alt="${cityName}" style="max-width: 100%; height: auto;">
      <p>Weather: ${weatherData.weather.description}</p>
      <p>Temperature: ${weatherData.temp}°C</p>
    `;
  } catch (error) {
    resultSection.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
  }
}

if (typeof document !== 'undefined') {
  document.getElementById('travel-form').addEventListener('submit', handleFormSubmit);
}