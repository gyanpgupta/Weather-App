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
  headerSelected,
  temperatureUnit,
  onHeadSelected,
}) => {
  return (
    <Card>
      <CardBody>
        {weatherData && weatherData[0] ? (
          <Row>
            <Col md={3} sm={4} lg={4} xs={12}>
              <>
                <div className='d-flex flex-row'>
                  <span className='mr-2'>
                    <img
                      typeof='foaf:Image'
                      className='img-responsive'
                      src={`https://developer.accuweather.com/sites/default/files/${weatherData && weatherData[0].WeatherIcon > 10
                          ? weatherData[0].WeatherIcon
                          : '0' + weatherData[0].WeatherIcon
                        }-s.png`}
                      width='75'
                      height='45'
                      alt='Mostly Cloudy'
                      title='Mostly Cloudy'
                    ></img>
                  </span>

                  <span className='mr-2 temperature-text'>
                    {temperatureUnit === 'F'
                      ? weatherData[0].Temperature.Value
                      : Math.floor(
                        ((weatherData[0].Temperature.Value - 32) * 5) / 9
                      )}
                  </span>

                  <span
                    className={`mr-2 cursor-pointer temperature-unit ${temperatureUnit === 'F' ? null : 'inactive'
                      }`}
                    onClick={(e) => changeTemperatureDegree(e, 'F')}
                  >
                    {`°${weatherData[0].Temperature.Unit}`}
                  </span>
                  <span className='mr-2'>| </span>

                  <span
                    className={`cursor-pointer temperature-unit ${temperatureUnit === 'C' ? null : 'inactive'
                      }`}
                    onClick={(e) => changeTemperatureDegree(e, 'C')}
                  >
                    {`°C`}
                  </span>
                </div>
              </>
            </Col>
            <Col md={3} sm={4} lg={2} xs={12}>
              <div className='d-flex flex-column  other-stats'>
                <span>
                  Precipitation: {weatherData[0].PrecipitationProbability} %
                </span>
                <span>Humidity: {weatherData[0].RelativeHumidity}%</span>
                <span>
                  Wind: {weatherData[0].Wind.Speed.Value}{' '}
                  {weatherData[0].Wind.Speed.Unit}
                </span>
              </div>
            </Col>

            <Col md={6} sm={12} lg={6}>
              <div className='d-flex flex-column align-items-end location-wrap'>
                <span className='mr-2'>Los Angeles CA</span>

                <span className='mr-2 location-date'>
                  {moment(weatherData[0].DateTime).format('LLLL')}
                </span>

                <span className='mr-2 location-icon'>
                  {weatherData[0].IconPhrase}
                </span>
              </div>
            </Col>
            <Col md={12} sm={12} lg={12}>
              <div className='d-flex flex-row cursor-pointer headline'>
                <span
                  className={`mr-2 ${headerSelected === 'T' ? 'headline-active' : null
                    }`}
                  onClick={(e) => onHeadSelected(e, 'T')}
                >
                  Temperature
                </span>
                <span
                  className={`mr-2 ${headerSelected === 'P' ? 'headline-active' : null
                    }`}
                  onClick={(e) => onHeadSelected(e, 'P')}
                >
                  Precipitation
                </span>
                <span
                  className={`mr-2 ${headerSelected === 'W' ? 'headline-active' : null
                    }`}
                  onClick={(e) => onHeadSelected(e, 'W')}
                >
                  Wind
                </span>
              </div>
              <ReactHighcharts config={configuration} />
            </Col>

            <Col md={12} sm={12} lg={12}>
              <ul className='d-flex flex-row justify-content-around weekly-wrap'>
                {weekData && weekData.length > 0
                  ? weekData.map((item: weekDataProps, key: number) => {
                    return (
                      <li key={key} className='list-unstyled weekly-item'>
                        <div className='d-flex flex-column weekly-item-text'>
                          <span>{item.name}</span>
                          <span className='mt-1'>
                            <img
                              typeof='foaf:Image'
                              className='img-responsive'
                              src={`https://developer.accuweather.com/sites/default/files/${item.icon > 10 ? item.icon : '0' + item.icon
                                }-s.png`}
                              width='75'
                              height='45'
                              alt='Mostly Cloudy'
                              title={item.iconPhrase}
                            ></img>
                          </span>

                          <span className='mt-1 d-flex weekly-item-temperature'>
                            <p className='weekly-item-temperature-day'>
                              {temperatureUnit === 'F'
                                ? item.temperature.maximum
                                : Math.floor(
                                  ((item.temperature.maximum - 32) * 5) / 9
                                )}
                                °
                              </p>

                            <p className='weekly-item-temperature-night'>
                              {temperatureUnit === 'F'
                                ? item.temperature.minimum
                                : Math.floor(
                                  ((item.temperature.minimum - 32) * 5) / 9
                                )}
                                °
                              </p>
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
