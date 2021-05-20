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
};

const Weather: FunctionComponent<WeatherProps> = (props) => {
    const [weatherData, setWeatherData] = useState<object | any>([]);
    const [temperatureUnit, setTemperatureUnit] = useState<string>('F');
    const [weekData, setWeekData] = useState<object>([]);
    const [configuration, setConfig] = useState<object>({});
    const [headerSelected, setHeaderSelected] = useState<string>('T');

    useEffect(() => {
        getData();
    }, []);

    /*
          ------------------------------------------------------------------
              Function to get Data Weekly and Hourly data from weather APIs
          -----------------------------------------------------------------
          */
    const getData = async () => {
        // hourly data
        await axios
            .get(`${process.env.REACT_APP_HOURLY_API}`)
            .then(async (data) => {
                setWeatherData(data.data);
                var dates: any = [];
                var temperature: any = [];
                for (let i = 0; i < data.data.length; i++) {
                    dates.push(moment(data.data[i].DateTime).format('hh A')); // dates
                    temperature.push(data.data[i].Temperature.Value); // temperature in F
                }

                // graph config
                config = {
                    ...config,
                    xAxis: {
                        name: 'Temperature °C',
                        categories: dates,
                        tickLength: 0,
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
                    yAxis: {
                        gridLineWidth: 0,
                        minorGridLineWidth: 0,
                        tickLength: 0,
                        visible: false,
                    },
                };

                setConfig(config);

                // weekly data api
                await axios.get(`${process.env.REACT_APP_WEEKLY_API}`).then((data) => {
                    const weeklyData: any = [];
                    for (let i = 0; i < data.data.DailyForecasts.length; i++) {
                        const date = moment(data.data.DailyForecasts[i].Date).format(
                            'dddd'
                        );
                        weeklyData.push({
                            name: date, // week name
                            icon: data.data.DailyForecasts[i].Day.Icon, // icon number
                            iconPhrase: data.data.DailyForecasts[i].Day.IconPhrase, // phrase
                            temperature: {
                                maximum: data.data.DailyForecasts[i].Temperature.Maximum.Value,
                                minimum: data.data.DailyForecasts[i].Temperature.Minimum.Value,
                            },
                        });
                    }
                    setWeekData(weeklyData);
                });
            });
    };

    /*
          -----------------------------------------------
              Function to update graph data in °F or °C
          -----------------------------------------------
          */
    const changeTemperatureDegree = (e: any, value: string) => {
        setTemperatureUnit(value);
        var dates: any = [];
        var temperature: any = [];
        for (let i = 0; i < weatherData.length; i++) {
            dates.push(moment(weatherData[i].DateTime).format('hh A'));

            if (value === 'C') {
                // if °C
                Math.floor(
                    temperature.push(((weatherData[i].Temperature.Value - 32) * 5) / 9)
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
            },
            series: [
                {
                    data: temperature,
                    name: 'Time Zone',
                    color: '#fff2ce',
                    lineColor: '#ffcf3c',
                    showInLegend: false,
                },
            ],
            yAxis: {
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                tickLength: 0,
                visible: false,
            },
        };

        setConfig(config);
    };

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
                    Math.floor(
                        temperature.push(((weatherData[i].Temperature.Value - 32) * 5) / 9)
                    );
                } else {
                    // else °F
                    temperature.push(weatherData[i].Temperature.Value);
                }
            }
        }

        // update graph config

        config = {
            ...config,
            xAxis: {
                name: 'Temperature °C',
                categories: dates,
                tickLength: 0,
            },
            series: [
                {
                    data: temperature,
                    name: 'Time Zone',
                    color: '#fff2ce',
                    lineColor: '#ffcf3c',
                    showInLegend: false,
                },
            ],
            yAxis: {
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                tickLength: 0,
                visible: false,
            },
        };

        setConfig(config);
    };

    return (
        <Container className='mt-2'>
            <WeatherForm
                weekData={weekData}
                weatherData={weatherData}
                configuration={configuration}
                headerSelected={headerSelected}
                onHeadSelected={onHeadSelected}
                temperatureUnit={temperatureUnit}
                changeTemperatureDegree={changeTemperatureDegree}
            />
        </Container>
    );
};

export default Weather;
