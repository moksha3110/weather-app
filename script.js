//Weather App JavaScript
class WeatherApp {
  constructor() {
    // Replace with your OpenWeatherMap API key
    this.API_KEY = "8f39b522a001b8a0823eac15958c095b";
    this.BASE_URL = "https://api.openweathermap.org/data/2.5";
    this.currentCity = null;
    this.favoriteCity = [];
    this.temperatureChart = null;
    this.rainfallChart = null;
    this.forecastData = null;

    this.init();
  }

  init() {
    this.loadFavorites();
    this.loadTheme();
    this.setupEventListeners();
    this.setupHamburgerMenu();
    this.setupDarkMode();
    this.getCurrentLocation();
    this.initCharts();
  }

  setupEventListeners() {
    // Search functionality
    const searchBtn = document.getElementById("searchBtn");
    const citySearch = document.getElementById("citySearch");

    searchBtn.addEventListener("click", () => this.searchCity());
    citySearch.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.searchCity();
      }
    });

    // Favorite button
    const favoriteBtn = document.getElementById("favoriteBtn");
    favoriteBtn.addEventListener("click", () => this.toggleFavorite());

    // Modal close
    const modal = document.getElementById("errorModal");
    const closeBtn = modal.querySelector(".close");
    closeBtn.addEventListener("click", () => this.hideModal());

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.hideModal();
      }
    });
  }

  setupHamburgerMenu() {
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const hamburgerMenu = document.getElementById("hamburgerMenu");
    const closeHamburger = document.getElementById("closeHamburger");

    hamburgerBtn.addEventListener("click", () => {
      hamburgerMenu.classList.add("open");
    });

    closeHamburger.addEventListener("click", () => {
      hamburgerMenu.classList.remove("open");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !hamburgerMenu.contains(e.target) &&
        !hamburgerBtn.contains(e.target)
      ) {
        hamburgerMenu.classList.remove("open");
      }
    });
  }

  setupDarkMode() {
    const darkModeBtn = document.getElementById("darkModeBtn");

    darkModeBtn.addEventListener("click", () => {
      this.toggleDarkMode();
    });
  }

  toggleDarkMode() {
    const body = document.body;
    const darkModeBtn = document.getElementById("darkModeBtn");
    const icon = darkModeBtn.querySelector("i");

    if (body.getAttribute("data-theme") === "dark") {
      body.removeAttribute("data-theme");
      icon.className = "fas fa-moon";
      localStorage.setItem("weatherAppTheme", "light");
    } else {
      body.setAttribute("data-theme", "dark");
      icon.className = "fas fa-sun";
      localStorage.setItem("weatherAppTheme", "dark");
    }

    // Update charts with new theme
    this.updateChartsTheme();
  }

  loadTheme() {
    const savedTheme = localStorage.getItem("weatherAppTheme");
    const darkModeBtn = document.getElementById("darkModeBtn");
    const icon = darkModeBtn.querySelector("i");

    if (savedTheme === "dark") {
      document.body.setAttribute("data-theme", "dark");
      icon.className = "fas fa-sun";
    } else {
      icon.className = "fas fa-moon";
    }
  }

  getCurrentLocation() {
    this.showLoading();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.getWeatherByCoords(lat, lon);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Default to a major city if geolocation fails
          this.searchCityWeather("London");
        }
      );
    } else {
      // Default to a major city if geolocation is not supported
      this.searchCityWeather("London");
    }
  }

  async getWeatherByCoords(lat, lon) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("Weather data not found");
      }

      const data = await response.json();
      this.currentCity = data.name;
      this.displayCurrentWeather(data);
      this.getForecast(lat, lon);
      this.getDetailedWeather(lat, lon);
      this.hideLoading();
    } catch (error) {
      this.handleError(error.message);
    }
  }

  async searchCity() {
    const cityName = document.getElementById("citySearch").value.trim();
    if (!cityName) return;

    this.searchCityWeather(cityName);
    document.getElementById("citySearch").value = "";
  }

  async searchCityWeather(cityName) {
    this.showLoading();

    try {
      const response = await fetch(
        `${this.BASE_URL}/weather?q=${cityName}&appid=${this.API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();
      this.currentCity = data.name;
      this.displayCurrentWeather(data);
      this.getForecast(data.coord.lat, data.coord.lon);
      this.getDetailedWeather(data.coord.lat, data.coord.lon);
      this.hideLoading();
    } catch (error) {
      this.handleError(error.message);
    }
  }

  async getForecast(lat, lon) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("Forecast data not found");
      }

      const data = await response.json();
      this.forecastData = data;
      this.displayForecast(data);
      this.updateCharts(data);
    } catch (error) {
      console.error("Forecast error:", error);
    }
  }

  async getDetailedWeather(lat, lon) {
    try {
      // Get current weather for detailed info
      const response = await fetch(
        `${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("Detailed weather data not found");
      }

      const data = await response.json();
      this.displayDetailedWeather(data);
    } catch (error) {
      console.error("Detailed weather error:", error);
    }
  }

  displayCurrentWeather(data) {
    // Update basic info
    document.getElementById("currentCity").textContent = data.name;
    document.getElementById("currentTemp").textContent = Math.round(
      data.main.temp
    );
    document.getElementById("weatherDesc").textContent =
      data.weather[0].description;
    document.getElementById("feelsLike").textContent = Math.round(
      data.main.feels_like
    );

    // Update weather icon
    const iconCode = data.weather[0].icon;
    document.getElementById(
      "weatherIcon"
    ).src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Update details
    document.getElementById("visibility").textContent = `${(
      data.visibility / 1000
    ).toFixed(1)} km`;
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById("windSpeed").textContent = `${data.wind.speed} m/s`;
    document.getElementById(
      "pressure"
    ).textContent = `${data.main.pressure} hPa`;

    // Update favorite button state
    this.updateFavoriteButton();
  }

  displayForecast(data) {
    const container = document.getElementById("forecastContainer");
    container.innerHTML = "";

    // Group forecast by days (every 8th item for daily forecast)
    const dailyForecasts = [];
    for (let i = 0; i < data.list.length; i += 8) {
      dailyForecasts.push(data.list[i]);
    }

    dailyForecasts.slice(0, 5).forEach((forecast) => {
      const date = new Date(forecast.dt * 1000);
      const dayName = date.toLocaleDateString("en", { weekday: "short" });
      const dayDate = date.toLocaleDateString("en", {
        month: "short",
        day: "numeric",
      });

      const card = document.createElement("div");
      card.className = "forecast-card";
      card.innerHTML = `
                <div class="forecast-date">${dayName}, ${dayDate}</div>
                <div class="forecast-icon">
                    <img src="https://openweathermap.org/img/wn/${
                      forecast.weather[0].icon
                    }@2x.png" alt="Weather Icon">
                </div>
                <div class="forecast-temps">
                    <span class="temp-high">${Math.round(
                      forecast.main.temp_max
                    )}°</span>
                    <span class="temp-low">${Math.round(
                      forecast.main.temp_min
                    )}°</span>
                </div>
                <div class="forecast-desc">${
                  forecast.weather[0].description
                }</div>
            `;
      container.appendChild(card);
    });
  }

  displayDetailedWeather(data) {
    // Sun & Moon times
    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);

    document.getElementById("sunrise").textContent = sunrise.toLocaleTimeString(
      "en",
      { hour: "2-digit", minute: "2-digit" }
    );
    document.getElementById("sunset").textContent = sunset.toLocaleTimeString(
      "en",
      { hour: "2-digit", minute: "2-digit" }
    );

    // Temperature details
    document.getElementById("minTemp").textContent = `${Math.round(
      data.main.temp_min
    )}°C`;
    document.getElementById("maxTemp").textContent = `${Math.round(
      data.main.temp_max
    )}°C`;
    document.getElementById("detailFeelsLike").textContent = `${Math.round(
      data.main.feels_like
    )}°C`;

    // Wind & Air details
    document.getElementById(
      "detailWindSpeed"
    ).textContent = `${data.wind.speed} m/s`;
    document.getElementById("windDirection").textContent = `${data.wind.deg}°`;
    document.getElementById(
      "detailPressure"
    ).textContent = `${data.main.pressure} hPa`;

    // Precipitation details
    document.getElementById(
      "detailHumidity"
    ).textContent = `${data.main.humidity}%`;
    document.getElementById("detailVisibility").textContent = `${(
      data.visibility / 1000
    ).toFixed(1)} km`;
    document.getElementById("uvIndex").textContent = "N/A"; // Would need additional API call for UV index
  }

  toggleFavorite() {
    if (!this.currentCity) return;

    const index = this.favoriteCity.findIndex(
      (city) => city.name === this.currentCity
    );

    if (index === -1) {
      // Add to favorites
      this.addToFavorites();
    } else {
      // Remove from favorites
      this.favoriteCity.splice(index, 1);
    }

    this.saveFavorites();
    this.updateFavoriteButton();
    this.displayFavorites();
  }

  async addToFavorites() {
    try {
      const response = await fetch(
        `${this.BASE_URL}/weather?q=${this.currentCity}&appid=${this.API_KEY}&units=metric`
      );

      if (!response.ok) return;

      const data = await response.json();

      const favoriteCity = {
        name: data.name,
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        coord: data.coord,
      };

      this.favoriteCity.push(favoriteCity);
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  }

  displayFavorites() {
    const container = document.getElementById("favoriteCitiesList");
    container.innerHTML = "";

    if (this.favoriteCity.length === 0) {
      container.innerHTML =
        '<p style="color: #666; text-align: center;">No favorite cities yet</p>';
      return;
    }

    this.favoriteCity.forEach((city, index) => {
      const card = document.createElement("div");
      card.className = "city-card";
      card.innerHTML = `
                <button class="remove-favorite" onclick="weatherApp.removeFavorite(${index})">×</button>
                <h4>${city.name}</h4>
                <div class="city-temp">${city.temp}°C</div>
                <div class="city-desc">${city.description}</div>
            `;

      card.addEventListener("click", (e) => {
        if (!e.target.classList.contains("remove-favorite")) {
          this.getWeatherByCoords(city.coord.lat, city.coord.lon);
        }
      });

      container.appendChild(card);
    });
  }

  removeFavorite(index) {
    this.favoriteCity.splice(index, 1);
    this.saveFavorites();
    this.updateFavoriteButton();
    this.displayFavorites();
  }

  updateFavoriteButton() {
    const favoriteBtn = document.getElementById("favoriteBtn");
    const icon = favoriteBtn.querySelector("i");

    const isFavorite = this.favoriteCity.some(
      (city) => city.name === this.currentCity
    );

    if (isFavorite) {
      icon.className = "fas fa-heart";
      favoriteBtn.classList.add("active");
    } else {
      icon.className = "far fa-heart";
      favoriteBtn.classList.remove("active");
    }
  }

  loadFavorites() {
    const saved = localStorage.getItem("weatherAppFavorites");
    if (saved) {
      this.favoriteCity = JSON.parse(saved);
      this.displayFavorites();
    }
  }

  saveFavorites() {
    localStorage.setItem(
      "weatherAppFavorites",
      JSON.stringify(this.favoriteCity)
    );
  }

  showLoading() {
    document.getElementById("loadingOverlay").classList.remove("hidden");
  }

  hideLoading() {
    document.getElementById("loadingOverlay").classList.add("hidden");
  }

  showModal(message) {
    document.getElementById("errorMessage").textContent = message;
    document.getElementById("errorModal").style.display = "block";
  }

  hideModal() {
    document.getElementById("errorModal").style.display = "none";
  }

  handleError(message) {
    this.hideLoading();

    if (message.includes("API key")) {
      this.showModal(
        "Please add your OpenWeatherMap API key to the script.js file."
      );
    } else if (message.includes("not found")) {
      this.showModal(
        "City not found. Please check the spelling and try again."
      );
    } else {
      this.showModal(
        "An error occurred while fetching weather data. Please try again."
      );
    }
  }

  initCharts() {
    this.initTemperatureChart();
    this.initRainfallChart();
  }

  initTemperatureChart() {
    const ctx = document.getElementById("temperatureChart");
    if (!ctx) return;

    const isDark = document.body.getAttribute("data-theme") === "dark";
    const textColor = isDark ? "#ddd" : "#333";
    const gridColor = isDark ? "#636e72" : "#e9ecef";

    this.temperatureChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Temperature (°C)",
            data: [],
            borderColor: "#6c5ce7",
            backgroundColor: "rgba(108, 92, 231, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColor,
            },
            grid: {
              color: gridColor,
            },
          },
          y: {
            ticks: {
              color: textColor,
            },
            grid: {
              color: gridColor,
            },
          },
        },
      },
    });
  }

  initRainfallChart() {
    const ctx = document.getElementById("rainfallChart");
    if (!ctx) return;

    const isDark = document.body.getAttribute("data-theme") === "dark";
    const textColor = isDark ? "#ddd" : "#333";
    const gridColor = isDark ? "#636e72" : "#e9ecef";

    this.rainfallChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [],
        datasets: [
          {
            label: "Rainfall (mm)",
            data: [],
            backgroundColor: "rgba(116, 185, 255, 0.8)",
            borderColor: "#74b9ff",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColor,
            },
            grid: {
              color: gridColor,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: textColor,
            },
            grid: {
              color: gridColor,
            },
          },
        },
      },
    });
  }

  updateCharts(forecastData) {
    if (!forecastData || !forecastData.list) return;

    // Get 8 forecast points (next 24 hours)
    const forecastPoints = forecastData.list.slice(0, 8);

    const labels = forecastPoints.map((point) => {
      const date = new Date(point.dt * 1000);
      return date.toLocaleTimeString("en", {
        hour: "2-digit",
        minute: "2-digit",
      });
    });

    const temperatures = forecastPoints.map((point) =>
      Math.round(point.main.temp)
    );
    const rainfall = forecastPoints.map((point) => {
      return point.rain ? point.rain["3h"] || 0 : 0;
    });

    // Update temperature chart
    if (this.temperatureChart) {
      this.temperatureChart.data.labels = labels;
      this.temperatureChart.data.datasets[0].data = temperatures;
      this.temperatureChart.update();
    }

    // Update rainfall chart
    if (this.rainfallChart) {
      this.rainfallChart.data.labels = labels;
      this.rainfallChart.data.datasets[0].data = rainfall;
      this.rainfallChart.update();
    }
  }

  updateChartsTheme() {
    const isDark = document.body.getAttribute("data-theme") === "dark";
    const textColor = isDark ? "#ddd" : "#333";
    const gridColor = isDark ? "#636e72" : "#e9ecef";

    if (this.temperatureChart) {
      this.temperatureChart.options.plugins.legend.labels.color = textColor;
      this.temperatureChart.options.scales.x.ticks.color = textColor;
      this.temperatureChart.options.scales.x.grid.color = gridColor;
      this.temperatureChart.options.scales.y.ticks.color = textColor;
      this.temperatureChart.options.scales.y.grid.color = gridColor;
      this.temperatureChart.update();
    }

    if (this.rainfallChart) {
      this.rainfallChart.options.plugins.legend.labels.color = textColor;
      this.rainfallChart.options.scales.x.ticks.color = textColor;
      this.rainfallChart.options.scales.x.grid.color = gridColor;
      this.rainfallChart.options.scales.y.ticks.color = textColor;
      this.rainfallChart.options.scales.y.grid.color = gridColor;
      this.rainfallChart.update();
    }
  }
}

// Initialize the weather app when the page loads
let weatherApp;
document.addEventListener("DOMContentLoaded", () => {
  weatherApp = new WeatherApp();
});

// Check if API key is set
document.addEventListener("DOMContentLoaded", () => {
  const apiKeyCheck = document.querySelector(".api-key-warning");
  if (!apiKeyCheck && weatherApp?.API_KEY === "YOUR_API_KEY_HERE") {
    // Add API key warning if not already present
    const warning = document.createElement("div");
    warning.className = "api-key-warning";
    warning.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #ff6b6b;
            color: white;
            padding: 10px;
            text-align: center;
            z-index: 10002;
            font-weight: bold;
        `;
    warning.innerHTML = `
            ⚠️ API Key Required: Get your free API key from 
            <a href="https://openweathermap.org/api" target="_blank" style="color: white; text-decoration: underline;">
                OpenWeatherMap
            </a> 
            and replace 'YOUR_API_KEY_HERE' in script.js
        `;
    document.body.prepend(warning);
  }
});

// Sample weather alerts data (since OpenWeatherMap alerts require a paid plan)
const sampleAlerts = [
  {
    title: "Heat Wave Warning",
    description:
      "Temperatures expected to reach 35°C+ for the next 3 days. Stay hydrated and avoid prolonged sun exposure.",
    severity: "moderate",
  },
  {
    title: "Heavy Rain Alert",
    description:
      "Significant rainfall expected tonight. Possible flooding in low-lying areas.",
    severity: "minor",
  },
];

// Function to display weather alerts
function displayAlerts() {
  const container = document.getElementById("alertsContainer");

  // For demo purposes, randomly show alerts
  if (Math.random() > 0.7) {
    container.innerHTML = "";
    sampleAlerts.forEach((alert) => {
      const alertDiv = document.createElement("div");
      alertDiv.className = "alert-item";
      alertDiv.innerHTML = `
                <div class="alert-title">${alert.title}</div>
                <div class="alert-description">${alert.description}</div>
            `;
      container.appendChild(alertDiv);
    });
  } else {
    container.innerHTML = `
            <div class="no-alerts">
                <i class="fas fa-check-circle"></i>
                <p>No weather alerts for your current location</p>
            </div>
        `;
  }
}

// Display alerts since all sections are now visible
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    displayAlerts();
  }, 2000); // Display alerts after initial load
});

