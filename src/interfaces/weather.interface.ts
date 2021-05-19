import { type } from 'os';

export type WeatherFormProps = {
  changeTemperatureDegree: (e: any, value: string) => void;
  weekData: any;
  weatherData: any;
  configuration: any;
  temperatureUnit: string;
};

export type WeatherProps = {
  props: any;
};

export type weekDataProps = {
  name: string;
  icon: number;
  iconPhrase: string;
};
