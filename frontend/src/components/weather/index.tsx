import React, { FunctionComponent, useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import axios from 'axios';
import moment from 'moment';

import { WeatherProps } from '../../interfaces';

const WeatherForm = React.lazy(() => import('./weatherForm'));

var config: object | any = {
	chart: {
		polar: true,
		type: 'area',
		height: 100,
	},

	title: {
		text: '',
	},

	yAxis: {
		gridLineWidth: 0,
		minorGridLineWidth: 0,
		tickLength: 0,
		visible: false,
	},

	responsive: {
		rules: [
			{
				condition: {
					maxWidth: 500,
				},
				chartOptions: {
					legend: {
						align: 'center',
						verticalAlign: 'bottom',
						layout: 'horizontal',
					},
					yAxis: {
						labels: {
							align: 'left',
							x: 0,
							y: -5,
						},
						title: {
							text: null,
						},
					},
					subtitle: {
						text: null,
					},
					credits: {
						enabled: false,
					},
				},
			},
		],
	},
};

var barConfig: object | any = {
	chart: {
		renderTo: 'container',
		type: 'column',
		height: 100,
	},

	title: {
		text: '',
	},

	yAxis: {
		min: 0,
		stackLabels: {
			enabled: true,
			style: {
				fontWeight: 'bold',
				color: 'gray',
			},
		},

		gridLineWidth: 0,
		minorGridLineWidth: 0,
		tickLength: 0,
		// visible: false,
	},

	legend: {
		align: 'right',
		x: -30,
		verticalAlign: 'top',
		y: 25,
		floating: true,
		backgroundColor: 'white',
		borderColor: '#CCC',
		borderWidth: 1,
		shadow: false,
	},

	// legend: {
	// 	reversed: true
	// },
	plotOptions: {
		column: {
			grouping: false,
			stacking: 'normal',
		},
	},

	responsive: {
		rules: [
			{
				condition: {
					maxWidth: 500,
				},
				chartOptions: {
					legend: {
						align: 'center',
						verticalAlign: 'bottom',
						layout: 'horizontal',
					},
					yAxis: {
						labels: {
							align: 'left',
							x: 0,
							y: -5,
						},
						title: {
							text: null,
						},
					},
					subtitle: {
						text: null,
					},
					credits: {
						enabled: false,
					},
				},
			},
		],
	},
};

const Weather: FunctionComponent<WeatherProps> = (props) => {
	const [weatherData, setWeatherData] = useState<object | any>([]);
	const [temperatureUnit, setTemperatureUnit] = useState<string>('F');
	const [weekData, setWeekData] = useState<object>([]);
	const [configuration, setConfig] = useState<object>({});
	const [headerSelected, setHeaderSelected] = useState<string>('T');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [activeWeek, setActiveWeek] = useState<number>(0);
	const [windData, setWindData] = useState([]);
	const [weatherSearch, setWeatherSearch] = useState<string>('');
	const [error, setError] = useState<string>('');
	const [locationName, setLocationName] = useState<string>('');
	const [isData, SetIsData] = useState<boolean>(false)

	/*
		------------------------------------------------------------------
			Function to get Data Weekly and Hourly data from weather APIs
		-----------------------------------------------------------------
		*/
	const getData = async (value: string | number) => {
		setIsLoading(true);
		// hourly data
		await axios
			.get(`${process.env.REACT_APP_SERVER_URL}weather?searchValue=${value}`)
			.then(async (data) => {
				const { success, hourlyData, weeklyData, localizedName } = data.data;
				if (success) {
					setLocationName(localizedName);
					setWeatherData(hourlyData);
					var dates: any = [];
					var temperature: any = [];
					for (let i = 0; i < hourlyData.length; i++) {
						dates.push(moment(hourlyData[i].DateTime).format('hh A')); // dates
						temperature.push(hourlyData[i].Temperature.Value); // temperature in F
					}

					// graph config
					config = {
						...config,
						xAxis: {
							name: 'Temperature °C',
							categories: dates,
							tickLength: 0,
							lineWidth: 0,
							minorGridLineWidth: 0,
							lineColor: 'transparent',
							minorTickLength: 0,
						},
						series: [
							{
								data: temperature,
								name: 'Time Zone',
								color: '#fff2ce',
								lineColor: '#ffcf3c',
								showInLegend: false,
								marker: {
									fillColor: '#f6ba01',
									lineWidth: 2,
									lineColor: '999',
								},
							},
						],
					};

					setConfig(config);

					// weekly data api
					const weeklyDataArray: any = [];
					for (let i = 0; i < weeklyData.DailyForecasts.length; i++) {
						const date = moment(weeklyData.DailyForecasts[i].Date).format(
							'dddd'
						);
						weeklyDataArray.push({
							name: date, // week name
							icon: weeklyData.DailyForecasts[i].Day.Icon, // icon number
							iconPhrase: weeklyData.DailyForecasts[i].Day.IconPhrase, // phrase
							temperature: {
								maximum: weeklyData.DailyForecasts[i].Temperature.Maximum.Value,
								minimum: weeklyData.DailyForecasts[i].Temperature.Minimum.Value,
							},
						});
					}
					weeklyDataArray.push(...weeklyDataArray);
					setWeekData(weeklyDataArray);
					setIsLoading(false);
				}
			});
	};

	/*
	---------------------------------------------
		Function to update graph data in °F or °C
	---------------------------------------------
			*/
	const changeTemperatureDegree = (e: any, value: string) => {
		setTemperatureUnit(value);

		var dates: any = [];
		var temperature: any = [];
		for (let i = 0; i < weatherData.length; i++) {
			dates.push(moment(weatherData[i].DateTime).format('hh A'));

			if (value === 'C') {
				// if °C
				temperature.push(
					Math.round(((weatherData[i].Temperature.Value - 32) * 5) / 9)
				);
			} else {
				// else °F
				temperature.push(weatherData[i].Temperature.Value);
			}
		}
		// update graph config

		config = {
			...config,
			xAxis: {
				name: 'Temperature °C',
				categories: dates,
				tickLength: 0,
				lineWidth: 0,
				minorGridLineWidth: 0,
				lineColor: 'transparent',
				minorTickLength: 0,
			},
			series: [
				{
					data: temperature,
					name: `Temperature °${value}`,
					color: '#fff2ce',
					lineColor: '#ffcf3c',
					showInLegend: false,
					marker: {
						fillColor: '#f6ba01',
						lineWidth: 2,
						lineColor: '999',
					},
				},
			],
		};

		setConfig(config);
	};

	/*
	--------------------------------------------------------------------
		Function to update data for Temperature, Precipitation and Wind
	--------------------------------------------------------------------
			*/
	const onHeadSelected = (e: any, value: string) => {
		setHeaderSelected(value);
		var dates: any = [];
		var temperature: any = [];
		var PrecipitationDummyValue: any = [];
		var windArray: any = [];
		for (let i = 0; i < weatherData.length; i++) {
			dates.push(moment(weatherData[i].DateTime).format('hh A'));
			if (value === 'P') {
				temperature.push(weatherData[i].PrecipitationProbability);
				PrecipitationDummyValue.push(
					weatherData[i].PrecipitationProbability > 0 ? 1 : null
				);
			} else if (value === 'W') {
				windArray.push({
					date: moment(weatherData[i].DateTime).format('hh A'),
					speed: weatherData[i].Wind.Speed.Value,
					degree: weatherData[i].Wind.Direction.Degrees,
					unit: weatherData[i].Wind.Speed.Unit,
				});
			} else {
				if (temperatureUnit === 'C') {
					// if °C
					temperature.push(
						Math.round(((weatherData[i].Temperature.Value - 32) * 5) / 9)
					);
				} else {
					// else °F
					temperature.push(weatherData[i].Temperature.Value);
				}
			}
		}
		// update graph config

		if (value === 'P') {
			barConfig = {
				...barConfig,
				xAxis: {
					categories: dates,
					tickLength: 0,
					lineWidth: 0,
					minorGridLineWidth: 0,
					lineColor: 'transparent',
					minorTickLength: 0,
				},
				series: [
					{
						name: '',
						data: PrecipitationDummyValue,
						enableMouseTracking: false,
						showInLegend: false,
						color: '#1a73e8',
					},
					{
						data: temperature,
						name: 'Precipitation',
						color: '#fff2ce',
						lineColor: '#ffcf3c',
						showInLegend: false,
						marker: {
							fillColor: '#f6ba01',
							lineWidth: 2,
							lineColor: '999',
						},
					},
				],
			};
			setConfig(barConfig);
		} else if (value === 'W') {
			setWindData(windArray);
		} else {
			config = {
				...config,
				xAxis: {
					name: 'Temperature °C',
					categories: dates,
					tickLength: 0,
					lineWidth: 0,
					minorGridLineWidth: 0,
					lineColor: 'transparent',
					minorTickLength: 0,
				},
				series: [
					{
						data: temperature,
						name: 'Time Zone',
						color: '#fff2ce',
						lineColor: '#ffcf3c',
						showInLegend: false,
						marker: {
							fillColor: '#f6ba01',
							lineWidth: 2,
							lineColor: '999',
						},
					},
				],
			};

			setConfig(config);
		}
	};

	/*
	-----------------------------------------
		Function to set the selected week data
	-----------------------------------------
		*/
	const onWeekSelected = (e: any, key: number) => {
		console.log('week selected', key);
		setActiveWeek(key);
	};

	const onInputChange = (e: any) => {
		const {
			target: { value },
		} = e;
		setWeatherSearch(value);
		setError('');
	};

	/*
	--------------------------
		For Searching
	 ---------------------------
	 */
	const onSubmit = async (e: any) => {
		e.preventDefault();
		try {
			if (weatherSearch != '') {
				setError('');
				setHeaderSelected('T')
				SetIsData(true)
				await getData(weatherSearch);
			} else {
				setError('Please enter a text');
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Container className='mt-2'>
			<WeatherForm
				isData={isData}
				error={error}
				windData={windData}
				weekData={weekData}
				isLoading={isLoading}
				activeWeek={activeWeek}
				weatherData={weatherData}
				configuration={configuration}
				headerSelected={headerSelected}
				weatherSearch={weatherSearch}
				locationName={locationName}
				onSubmit={onSubmit}
				onInputChange={onInputChange}
				onHeadSelected={onHeadSelected}
				onWeekSelected={onWeekSelected}
				temperatureUnit={temperatureUnit}
				changeTemperatureDegree={changeTemperatureDegree}
			/>
		</Container>
	);
};

export default Weather;
