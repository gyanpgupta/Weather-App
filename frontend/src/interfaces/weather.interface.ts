export type WeatherFormProps = {
  changeTemperatureDegree: (e: any, value: string) => void;
  onHeadSelected: (e: any, value: string) => void;
  onWeekSelected: (e: any, key: number) => void;
  onInputChange: (e: any) => void;
  onSubmit: (e: any) => void;
  isData: boolean;
  error: string;
  weekData: any;
  windData: any;
  isLoading: boolean;
  weatherData: any;
  activeWeek: number;
  configuration: any;
  locationName: string;
  weatherSearch: string;
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

export type windDataProps = {
  date: string;
  speed: number;
  degree: number;
  unit: string;
};
