import React from 'react';
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
	TimeScale, // Import TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	TimeScale // Register TimeScale
);

const CurrencyRateChart = ({ data }) => {
	if (!data || data.length === 0)
		return <div>No data available for the chart.</div>;

	// Extract unique banks for the x-axis labels
	const banks = [...new Set(data.map((item) => item.bank))];

	// Prepare the datasets for each bank
	const datasets = banks.map((bank) => ({
		label: `${bank} Buy Rate`,
		data: data
			.filter((item) => item.bank === bank)
			.map((item) => ({ x: item.date, y: item.buyRate })),
		borderColor: 'rgba(75, 192, 192, 1)',
		backgroundColor: 'rgba(75, 192, 192, 0.2)',
		fill: true,
		tension: 0.1,
	}));

	datasets.push(
		...banks.map((bank) => ({
			label: `${bank} Sell Rate`,
			data: data
				.filter((item) => item.bank === bank)
				.map((item) => ({ x: item.date, y: item.sellRate })),
			borderColor: 'rgba(153, 102, 255, 1)',
			backgroundColor: 'rgba(153, 102, 255, 0.2)',
			fill: true,
			tension: 0.1,
		}))
	);

	const chartData = {
		datasets: datasets,
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
			},
			tooltip: {
				callbacks: {
					label: function (tooltipItem) {
						return `${tooltipItem.dataset.label}: ${tooltipItem.raw.y}`;
					},
				},
			},
		},
		scales: {
			x: {
				type: 'time',
				time: {
					unit: 'day',
					tooltipFormat: 'll',
				},
				title: {
					display: true,
					text: 'Date',
				},
			},
			y: {
				title: {
					display: true,
					text: 'Rate',
				},
				beginAtZero: false,
			},
		},
	};

	return (
		<div className="bg-white p-4 rounded-lg shadow-md">
			<h2 className="text-2xl font-semibold mb-4 text-gray-700">
				Currency Exchange Rates by Bank
			</h2>
			<Line data={chartData} options={options} />
		</div>
	);
};

export default CurrencyRateChart;
