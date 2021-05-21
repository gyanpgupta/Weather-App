export type WeatherFormProps = {
  changeTemperatureDegree: (e: any, value: string) => void;
  onHeadSelected: (e: any, value: string) => void;
  onWeekSelected: (e: any, key: number) => void;
  weekData: any;
  isLoading: boolean;
  weatherData: any;
  activeWeek: number;
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
