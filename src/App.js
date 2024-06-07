import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
import WeatherTable from './components/WeatherTable';
import SearchBar from './components/SearchBar';
import HourlyForecast from './components/HourlyForecast';
import HistoricalWeather from './components/HistoricalWeather';
import { Container, Typography, AppBar, Toolbar, Box } from '@mui/material';
import './styles.css';

const App = () => {
    const [city, setCity] = useState('Badajoz');
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [historicalData, setHistoricalData] = useState(null); // Agrega el estado para los datos históricos

    const fetchWeatherData = async (city) => {
        try {
            const weatherResponse = await axios.get(`http://127.0.0.1:5000/weather/${city}`);
            setWeatherData(weatherResponse.data);
        } catch (error) {
            console.error('Error fetching weather data', error);
        }
    };

    const fetchForecastData = async (city) => {
        try {
            const forecastResponse = await axios.get(`http://127.0.0.1:5000/forecast/${city}`);
            setForecastData(forecastResponse.data);
        } catch (error) {
            console.error('Error fetching forecast data', error);
        }
    };

    const fetchHistoricalData = async (city) => {
        try {
            const historicalResponse = await axios.get(`http://127.0.0.1:5000/historical-weather/${city}`);
            console.log('Fetched historical data:', historicalResponse.data); // Verificar los datos obtenidos
            setHistoricalData(historicalResponse.data);
        } catch (error) {
            console.error('Error fetching historical weather data', error);
        }
    };

    useEffect(() => {
        fetchWeatherData(city);
        fetchForecastData(city);
        fetchHistoricalData(city); // Llama a la función para obtener datos históricos
    }, [city]);

    const handleSearch = (newCity) => {
        setCity(newCity);
    };

    return (
        <Container>
            <AppBar position="static">
                <Toolbar style={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6">
                        Clima en {city}
                    </Typography>
                    <SearchBar onSearch={handleSearch} />
                </Toolbar>
            </AppBar>
            <Box mt={2}>
                {weatherData ? <WeatherCard weather={weatherData} /> : <p>Cargando datos del clima...</p>}
                {forecastData ? <WeatherTable forecast={forecastData} /> : <p>Cargando pronóstico...</p>}
                <HourlyForecast city={city} />
                {historicalData ? <HistoricalWeather city={city} data={historicalData} /> : <p>Cargando historial climático...</p>}
            </Box>
        </Container>
    );
};

export default App;

