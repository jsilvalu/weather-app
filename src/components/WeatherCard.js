import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import WeatherMap from './WeatherMap';

const WeatherCard = ({ weather }) => {
    const getWeatherIcon = (icon) => {
        const iconUrl = `https://www.weatherbit.io/static/img/icons/${icon}.png`;
        return <img src={iconUrl} alt="weather icon" style={{ width: '48px' }} />;
    };

    return (
        <Card style={{ marginBottom: '20px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Typography variant="h4" style={{ marginBottom: '10px' }}>{weather.city}</Typography>
                        {getWeatherIcon(weather.weather_icon)}
                        <Typography>{weather.weather}</Typography>
                        <Typography>Temperatura: {weather.temperature} °C</Typography>
                        <Typography>Temperatura Aparente: {weather.app_temp} °C</Typography>
                        <Typography>Humedad: {weather.humidity} %</Typography>
                        <Typography>Presión: {weather.pressure} hPa</Typography>
                        <Typography>Velocidad del Viento: {weather.wind_speed} m/s</Typography>
                        <Typography>Dirección del Viento: {weather.wind_direction_full} ({weather.wind_direction})</Typography>
                        <Typography>Nubosidad: {weather.clouds} %</Typography>
                        <Typography>Visibilidad: {weather.visibility} km</Typography>
                        <Typography>Punto de Rocío: {weather.dew_point} °C</Typography>
                        <Typography>Radiación Solar: {weather.solar_radiation} W/m²</Typography>
                        <Typography>Índice de Calidad del Aire: {weather.aqi}</Typography>
                        <Typography>Índice UV: {weather.uv}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Box style={{ height: '300px', width: '100%' }}> {/* Asegurar que el mapa use todo el espacio disponible */}
                            <WeatherMap position={[weather.lat, weather.lon]} city={weather.city} />
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default WeatherCard;
