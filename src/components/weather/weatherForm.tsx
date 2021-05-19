import { FunctionComponent } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import moment from 'moment';

import { WeatherFormProps, weekDataProps } from '../../interfaces';

const ReactHighcharts = require('react-highcharts');

const WeatherForm: FunctionComponent<WeatherFormProps> = ({
    changeTemperatureDegree,
    weekData,
    weatherData,
    configuration,
    temperatureUnit,
}) => {
    return (
        <Card>
            <CardBody>
                {weatherData && weatherData[0] ? (
                    <Row>
                        <Col md={6} sm={6} lg={6}>
                            <>
                                <div className="d-flex flex-row">
                                    <span className="mr-2">
                                        <img
                                            typeof="foaf:Image"
                                            className="img-responsive"
                                            src={`https://developer.accuweather.com/sites/default/files/${weatherData && weatherData[0].WeatherIcon > 10
                                                ? weatherData[0].WeatherIcon
                                                : '0' + weatherData[0].WeatherIcon
                                                }-s.png`}
                                            width="75"
                                            height="45"
                                            alt="Mostly Cloudy"
                                            title="Mostly Cloudy"
                                        ></img>
                                    </span>

                                    <span className="mr-2">
                                        <h3>
                                            {temperatureUnit === 'F'
                                                ? weatherData[0].Temperature.Value
                                                : Math.floor(((weatherData[0].Temperature.Value - 32) * 5) / 9)}
                                        </h3>
                                    </span>

                                    <span
                                        className={`mr-2 cursor-pointer ${temperatureUnit === 'F' ? null : 'inactive'
                                            }`}
                                        onClick={(e) => changeTemperatureDegree(e, 'F')}
                                    >
                                        <h3>{`°${weatherData[0].Temperature.Unit}`}</h3>
                                    </span>
                                    <span className="mr-2">
                                        <h3>|</h3>
                                    </span>

                                    <span
                                        className={`mr-2 cursor-pointer ${temperatureUnit === 'C' ? null : 'inactive'
                                            }`}
                                        onClick={(e) => changeTemperatureDegree(e, 'C')}
                                    >
                                        <h3>{`°C`}</h3>
                                    </span>

                                    <div className="d-flex flex-column ml-2">
                                        <span>
                                            Precipitation: {weatherData[0].PrecipitationProbability} %
                    </span>
                                        <span>Humidity: {weatherData[0].RelativeHumidity}%</span>
                                        <span>
                                            Wind: {weatherData[0].Wind.Speed.Value}{' '}
                                            {weatherData[0].Wind.Speed.Unit}
                                        </span>
                                    </div>
                                </div>
                            </>
                        </Col>

                        <Col md={6} sm={6} lg={6}>
                            <div className="d-flex flex-column align-items-end">
                                <span className="mr-2">
                                    <h4>Los Angeles CA</h4>
                                </span>

                                <span className="mr-2">
                                    <h5>{moment(weatherData[0].DateTime).format('LLLL')}</h5>
                                </span>

                                <span className="mr-2">
                                    <h5>{weatherData[0].IconPhrase}</h5>
                                </span>
                            </div>
                        </Col>
                        <Col md={12} sm={12} lg={12}>
                            <ReactHighcharts config={configuration} />
                        </Col>

                        <Col md={12} sm={12} lg={12}>
                            <ul className="d-flex flex-row justify-content-between">
                                {weekData && weekData.length > 0
                                    ? weekData.map((item: weekDataProps, key: number) => {
                                        return (
                                            <li key={key} className="list-unstyled">
                                                <div className="d-flex flex-column">
                                                    <span>
                                                        <h4>{item.name}</h4>
                                                    </span>
                                                    <span className="mt-1">
                                                        <img
                                                            typeof="foaf:Image"
                                                            className="img-responsive"
                                                            src={`https://developer.accuweather.com/sites/default/files/${item.icon > 10 ? item.icon : '0' + item.icon
                                                                }-s.png`}
                                                            width="75"
                                                            height="45"
                                                            alt="Mostly Cloudy"
                                                            title="Mostly Cloudy"
                                                        ></img>
                                                    </span>
                                                    <span className="mt-1">
                                                        <h6>{item.iconPhrase}</h6>
                                                    </span>
                                                </div>
                                            </li>
                                        );
                                    })
                                    : null}
                            </ul>
                        </Col>
                    </Row>
                ) : null}
            </CardBody>
        </Card>
    );
};

export default WeatherForm;
