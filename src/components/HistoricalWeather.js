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

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HistoricalWeather = ({ city, data }) => { // Recibe los datos como prop
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    console.log('Received historical data:', data); // Verificar los datos recibidos
    if (data && data.length > 0) {
      const formattedData = {
        labels: data.map(day => new Date(day.datetime).toLocaleDateString([], { month: '2-digit', year: 'numeric' })),
        datasets: [
          {
            label: 'Temperatura Promedio (°C)',
            data: data.map(day => day.temp),
            borderColor: 'rgba(75,192,192,1)',
            fill: false,
          },
        ],
      };
      setChartData(formattedData);
    }
  }, [data]);

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
    <div style={{ height: '400px' }}>
      <h2 style={{ marginBottom: '20px' }}>Historial Climático</h2>
      {chartData.labels ? <Line data={chartData} options={options} /> : <p>No hay datos disponibles</p>}
    </div>
  );
};

export default HistoricalWeather;
