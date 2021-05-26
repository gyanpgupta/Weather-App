import { FunctionComponent } from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import Skeleton from 'react-loading-skeleton';
import moment from 'moment';
import Slider from 'react-slick';
import wind_unselectedIcon from './../../assets/wind_unselected.svg';
import {
  WeatherFormProps,
  weekDataProps,
  windDataProps,
} from '../../interfaces';

const ReactHighcharts = require('react-highcharts');

function SampleNextArrow(props: any) {
  const { style, onClick } = props;
  return (
    <span
      className={
        'slick-arrow-right fa fa-chevron-right float-right cursor-pointer'
      }
      onClick={onClick}
      style={{ ...style, display: 'block' }}
    />
  );
}

function SamplePrevArrow(props: any) {
  const { style, onClick } = props;
  return (
    <span
      className={'slick-arrow-left fa fa-chevron-left cursor-pointer'}
      onClick={onClick}
      style={{ ...style, display: 'block' }}
    />
  );
}

const settings: any = {
  dots: false,
  draggable: false,
  infinite: true,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  pauseOnHover: true,
  slidesToScroll: 1,
  slidesToShow: 5,
  speed: 500,
  touchMove: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 2,
        adaptiveHeight: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
  ],
};

const WeatherForm: FunctionComponent<WeatherFormProps> = ({
  changeTemperatureDegree, error,
  isData,
  windData,
  weekData,
  isLoading,
  activeWeek,
  weatherData,
  configuration,
  headerSelected,
  temperatureUnit,
  weatherSearch,
  locationName,
  onSubmit,
  onHeadSelected,
  onWeekSelected,
  onInputChange,
}) => {


  return (
    <>
      <Card className='mb-1 border-0'>
        {/* <CardBody> */}
        <Form onSubmit={onSubmit}>
          <div>
            <FormGroup>
              <Input
                type='text'
                placeholder='Search by city name or lat/long'
                name='weatherSearch'
                value={weatherSearch}
                onChange={onInputChange}
              />
              <Label>

                <span className="validation-error">
                  {error ? `${error} *` : ''}
                </span>
              </Label>
              <Button color=' fa fa-search'></Button>
            </FormGroup>
          </div>
        </Form>
        {/* </CardBody> */}
      </Card>
      {isData ?
        <Card>
          <CardBody>
            {isLoading ? (
              <Skeleton count={6} /> // Five-line loading skeleton
            ) : weatherData && weatherData[0] ? (
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
                    <span className='mr-2 location-name'>{locationName}</span>

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
                    <Button
                      className={`mr-2 ${headerSelected === 'T' ? 'headline-active' : null
                        }`}
                      onClick={(e) => onHeadSelected(e, 'T')}
                    >
                      Temperature
                  </Button>
                    <Button
                      className={`mr-2 ${headerSelected === 'P' ? 'headline-active' : null
                        }`}
                      onClick={(e) => onHeadSelected(e, 'P')}
                    >
                      Precipitation
                  </Button>
                    <Button
                      className={`mr-2 ${headerSelected === 'W' ? 'headline-active' : null
                        }`}
                      onClick={(e) => onHeadSelected(e, 'W')}
                    >
                      Wind
                  </Button>
                  </div>
                  {headerSelected === 'W' ? (
                    <div className='wind-wrap'>
                      {windData && windData.length > 0
                        ? windData.map((item: windDataProps, key: number) => {
                          return (
                            <div key={key} className={`cursor-pointer`}>
                              <div className='d-flex flex-column'>
                                <span className='wind-speed'>
                                  {item.speed} {item.unit}
                                </span>
                                <span className='m-auto mt-1 mb-1'>
                                  <img
                                    typeof='foaf:Image'
                                    className='img-responsive'
                                    src={wind_unselectedIcon}
                                    width='25'
                                    height='25'
                                    alt='8 km/h From southwest'
                                    data-atf='0'
                                    style={{
                                      transform: `rotate(${item.degree}deg)`,
                                    }}
                                  />
                                </span>
                                <span className='wind-time'>{item.date}</span>
                              </div>
                            </div>
                          );
                        })
                        : null}
                    </div>
                  ) : (
                    <ReactHighcharts config={configuration} />
                  )}
                </Col>

                <Col md={12} sm={12} lg={12}>
                  <div className='weekly-wrap'>
                    <Slider {...settings}>
                      {weekData && weekData.length > 0
                        ? weekData.map((item: weekDataProps, key: number) => {
                          return (
                            <div
                              key={key}
                              className={`list-unstyled weekly-item cursor-pointer ${key === activeWeek ? 'weekly-item-active' : null
                                }`}
                              onClick={(e) => onWeekSelected(e, key)}
                            >
                              <div className='d-flex flex-column weekly-item-text'>
                                <span className='mt-1'>{item.name}</span>
                                <span className='m-auto'>
                                  <img
                                    typeof='foaf:Image'
                                    className='img-responsive'
                                    src={`https://developer.accuweather.com/sites/default/files/${item.icon > 10
                                      ? item.icon
                                      : '0' + item.icon
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
                                        ((item.temperature.maximum - 32) *
                                          5) /
                                        9
                                      )}
                                    °
                                  </p>

                                  <p className='weekly-item-temperature-night'>
                                    {temperatureUnit === 'F'
                                      ? item.temperature.minimum
                                      : Math.floor(
                                        ((item.temperature.minimum - 32) *
                                          5) /
                                        9
                                      )}
                                    °
                                  </p>
                                </span>
                              </div>
                            </div>
                          );
                        })
                        : null}
                    </Slider>
                  </div>
                </Col>
              </Row>
            ) : (
              <h6>No data found</h6>
            )}
          </CardBody>
        </Card>
        : null}
    </>
  );
};

export default WeatherForm;
