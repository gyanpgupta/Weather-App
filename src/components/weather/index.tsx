import React, { FunctionComponent } from 'react'

import { WeatherProps } from '../../interfaces'

const WeatherForm = React.lazy(() => import('./weatherForm'));

const Weather: FunctionComponent<WeatherProps> = (props) => {
    return (<WeatherForm {...props} />)
}


export default Weather;