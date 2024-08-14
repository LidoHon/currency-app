import { useState, useEffect } from 'react';
import axios from 'axios';


const CurrencyStatus = () => {
	const [data, setData] = useState(null);
	const [selectedBank, setSelectedBank] = useState('');
	const [selectedCurrency, setSelectedCurrency] = useState('');
	const [banks, setBanks] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch currency status data
				const response = await axios.get('/api');
				setData(response.data);

				// Fetch list of banks
				const bankResponse = await axios.get('/api/banks');
				console.log('Banks API response:', bankResponse.data); // Log the actual response

				// Extract banks array from the response
				if (bankResponse.data && Array.isArray(bankResponse.data.banks)) {
					setBanks(bankResponse.data.banks);
				} else {
					console.error(
						'Unexpected response format for banks:',
						bankResponse.data
					);
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, []);

	const handleBankChange = (event) => {
		setSelectedBank(event.target.value);
		setSelectedCurrency(''); // Reset currency when bank changes
	};

	const handleCurrencyChange = (event) => {
		setSelectedCurrency(event.target.value);
	};

	const filteredRates = data?.exchange_rates.find(
		(bank) => bank.name === selectedBank
	);
	const currencyOptions = [
		'ETB to USD',
		'ETB to EUR',
		'ETB to GBP',
		'ETB to CNY',
		'ETB to AED',
	];

	const getCurrencyRate = (currency) => {
		if (!filteredRates) return null;
		return filteredRates.rates.find(
			(rate) => `${rate.baseCurrency} to ${rate.currencyCode}` === currency
		);
	};

	if (!data) {
		return <div className="text-center text-gray-500">Loading...</div>;
	}

	return (
		<div className="container mx-auto p-4">
			<div className="bg-green-100 p-3 rounded-md shadow-md mb-4">
				<h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
					Ethiopian Banks Currency Status
				</h1>
				<p className="text-gray-600 mb-2 text-center">
					Last Updated: {data.lastUpdated}
				</p>
			</div>

			<div className="flex flex-col md:flex-row gap-8 mx-4 md:mx-8 lg:mx-16">
				<section className="w-full md:w-1/3 mb-8">
					<h2 className="text-2xl font-semibold mb-4 text-gray-700">
						Best Rates
					</h2>
					<ul className="space-y-4">
						{data.bestRates.map((rate, index) => (
							<li key={index} className="p-4 bg-blue-100 rounded-lg shadow-md">
								<strong className="block text-lg text-center font-bold text-gray-800 mb-2">
									{rate.bank}
								</strong>
								<p className="text-xl text-gray-700 mb-1">
									{rate.baseCurrency} to {rate.currencyCode}
								</p>
								<p className="text-gray-600">Buy Rate: {rate.buyRate}</p>
								<p className="text-gray-600">Sell Rate: {rate.sellRate}</p>
								<p className="text-gray-600">
									Difference: {rate.buySellDifference}
								</p>
							</li>
						))}
					</ul>
				</section>
				<section className="w-1/3">
					<div className="mb-2">
						{/* <CurrencyRateChart data={filteredRates.rates} /> */}
					</div>
				</section>

				<section className="w-full md:w-1/3 mb-8">
					<h2 className="text-2xl font-semibold mb-4 text-gray-700">
						Select Bank
					</h2>
					<select
						className="p-2 border border-gray-300 rounded-lg mb-4 w-full"
						value={selectedBank}
						onChange={handleBankChange}
					>
						<option value="">Select a bank</option>
						{banks.map((bank, index) => (
							<option key={index} value={bank}>
								{bank}
							</option>
						))}
					</select>

					{selectedBank && (
						<>
							<h2 className="text-2xl font-semibold mb-4 text-gray-700">
								Select Currency
							</h2>
							<select
								className="p-2 border border-gray-300 rounded-lg mb-8 w-full"
								value={selectedCurrency}
								onChange={handleCurrencyChange}
							>
								<option value="">Select a currency</option>
								{currencyOptions.map((currency, index) => (
									<option key={index} value={currency}>
										{currency}
									</option>
								))}
							</select>

							{selectedCurrency && filteredRates && (
								<>
									<h2 className="text-2xl font-semibold mb-4 text-gray-700">
										Exchange Rates for {selectedCurrency} at {selectedBank}
									</h2>
									<p className="text-gray-600 mb-4">
										Last Updated:{' '}
										{new Date(filteredRates.lastUpdated).toLocaleDateString()}
									</p>
									{getCurrencyRate(selectedCurrency) ? (
										<>
											<ul className="space-y-4">
												<li className="p-4 bg-blue-100 rounded-lg shadow-md">
													<p className="text-lg font-semibold text-gray-800">
														{selectedCurrency}
													</p>
													<p className="text-gray-600">
														Buy Rate:{' '}
														{getCurrencyRate(selectedCurrency).buyRate}
													</p>
													<p className="text-gray-600">
														Sell Rate:{' '}
														{getCurrencyRate(selectedCurrency).sellRate}
													</p>
													<p className="text-gray-600">
														Difference:{' '}
														{
															getCurrencyRate(selectedCurrency)
																.buySellDifference
														}
													</p>
												</li>
											</ul>
										</>
									) : (
										<p className="text-gray-600">
											No data available for this currency.
										</p>
									)}
								</>
							)}
						</>
					)}
				</section>
			</div>
		</div>
	);
};

export default CurrencyStatus;
