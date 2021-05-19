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
    },

    title: {
        text: 'Temperature',
    },
};

const Weather: FunctionComponent<WeatherProps> = (props) => {

    const [weatherData, setWeatherData] = useState<object | any>([]);
    const [temperatureUnit, setTemperatureUnit] = useState<string>('F');
    const [weekData, setWeekData] = useState<object>([]);
    const [configuration, setConfig] = useState<object>({});

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
                    },
                    series: [
                        {
                            data: temperature,
                            name: 'Time Zone',
                            color: '#fff2ce',
                            lineColor: '#ffcf3c',
                        },
                    ],
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
                            name: date,  // week name
                            icon: data.data.DailyForecasts[i].Day.Icon, // icon number
                            iconPhrase: data.data.DailyForecasts[i].Day.IconPhrase,  // phrase
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

            if (value === 'C') {  // if °C
                temperature.push(((weatherData[i].Temperature.Value - 32) * 5) / 9);
            } else {  // else °F
                temperature.push(weatherData[i].Temperature.Value);
            }
        }


        // update graph config

        config = {
            ...config,
            xAxis: {
                name: 'Temperature °C',
                categories: dates,
            },
            series: [
                {
                    data: temperature,
                    name: 'Time Zone',
                    color: '#fff2ce',
                    lineColor: '#ffcf3c',
                },
            ],
        };

        setConfig(config);
    };

    return (
        <Container>
            <WeatherForm
                weekData={weekData}
                weatherData={weatherData}
                configuration={configuration}
                temperatureUnit={temperatureUnit}
                changeTemperatureDegree={changeTemperatureDegree}
            />
        </Container>
    );
};

export default Weather;
