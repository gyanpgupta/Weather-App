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
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [activeWeek, setActiveWeek] = useState<number>(0);

	useEffect(() => {
		getData();
	}, []);

	/*
	  ------------------------------------------------------------------
		  Function to get Data Weekly and Hourly data from weather APIs
	  -----------------------------------------------------------------
	  */
	const getData = async () => {
		setIsLoading(true);
		// hourly data
		await axios
			.get(`${process.env.REACT_APP_SERVER_URL}weather`)
			.then(async (data) => {
				const { success, hourlyData, weeklyData } = data.data;
				if (success) {
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
		for (let i = 0; i < weatherData.length; i++) {
			dates.push(moment(weatherData[i].DateTime).format('hh A'));
			if (value === 'P') {
				temperature.push(weatherData[i].PrecipitationProbability);
			} else if (value === 'W') {
				temperature.push(weatherData[i].Wind.Speed.Value);
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

	return (
		<Container className='mt-2'>
			<WeatherForm
				weekData={weekData}
				isLoading={isLoading}
				activeWeek={activeWeek}
				weatherData={weatherData}
				configuration={configuration}
				headerSelected={headerSelected}
				onHeadSelected={onHeadSelected}
				onWeekSelected={onWeekSelected}
				temperatureUnit={temperatureUnit}
				changeTemperatureDegree={changeTemperatureDegree}
			/>
		</Container>
	);
};

export default Weather;
