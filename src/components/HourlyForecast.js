import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HourlyForecast = ({ city }) => {
  const [hourlyData, setHourlyData] = useState([]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/hourly-forecast/${city}`)
      .then(response => setHourlyData(response.data))
      .catch(error => console.error('Error fetching hourly forecast', error));
  }, [city]);

  const data = {
    labels: hourlyData.map(hour => new Date(hour.timestamp_local).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), // Mostrar horas con ":00"
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: hourlyData.map(hour => hour.temp),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        ticks: {
          maxRotation: 90,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <div style={{ height: '400px', marginBottom: '60px' }}> {/* Ajustar altura y margen inferior */}
      <h2>Pronóstico por Horas</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default HourlyForecast;
