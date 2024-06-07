import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { WiDaySunny, WiRain, WiCloudy, WiSnow, WiFog } from 'weather-icons-react';  // Importar más iconos según sea necesario
import './WeatherTable.css';  // Importar el archivo CSS

const WeatherTable = ({ forecast }) => {
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthsOfYear = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const getWeatherIcon = (description) => {
        switch (description.toLowerCase()) {
            case 'clear':
            case 'poco nuboso':
                return <WiDaySunny size={48} color="#000" />;
            case 'rain':
            case 'lluvia':
            case 'aguacero ligero':
                return <WiRain size={48} color="#000" />;
            case 'clouds':
            case 'nubes':
            case 'nubes dispersas':
            case 'cubierto':
                return <WiCloudy size={48} color="#000" />;
            case 'snow':
            case 'nieve':
                return <WiSnow size={48} color="#000" />;
            case 'fog':
            case 'niebla':
                return <WiFog size={48} color="#000" />;
            default:
                return <WiDaySunny size={48} color="#000" />;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const dayOfWeek = daysOfWeek[date.getDay()];
        const day = date.getDate();
        const month = monthsOfYear[date.getMonth()];
        return `${dayOfWeek}, ${day} de ${month}`;
    };

    return (
        <TableContainer component={Paper}>
            <Table aria-label="weather forecast table">
                <TableHead>
                    <TableRow>
                        {forecast.map((day, index) => (
                            <TableCell key={index} align="center">
                                <Typography variant="h6">{formatDate(day.date)}</Typography>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        {forecast.map((day, index) => (
                            <TableCell key={index} align="center">
                                {getWeatherIcon(day.weather)}
                                <Typography>{day.weather}</Typography>
                                <Typography style={{ fontSize: '80%' }}>Mín: {day.temperature_min} °C</Typography>
                                <Typography style={{ fontSize: '80%' }}>Máx: {day.temperature_max} °C</Typography>
                                <Typography style={{ fontSize: '80%' }}>Prob. Precip.: {day.pop} %</Typography>
                                <Typography style={{ fontSize: '80%' }}>Nubosidad: {day.clouds} %</Typography>
                                <Typography style={{ fontSize: '80%' }}>Radiación Solar: {day.solar_radiation} W/m²</Typography>
                                <Typography style={{ fontSize: '80%' }}>AQI: {day.aqi}</Typography>
                                <Typography style={{ fontSize: '80%' }}>UV: {day.uv}</Typography>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default WeatherTable;
