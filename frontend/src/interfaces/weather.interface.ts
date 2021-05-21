import { type } from 'os';

export type WeatherFormProps = {
  changeTemperatureDegree: (e: any, value: string) => void;
  onHeadSelected: (e: any, value: string) => void;
  weekData: any;
  weatherData: any;
  configuration: any;
  headerSelected: string;
  temperatureUnit: string;
};

export type WeatherProps = {
  props: any;
};

export type weekDataProps = {
  name: string;
  icon: number;
  iconPhrase: string;
  temperature: { minimum: number; maximum: number };
};
