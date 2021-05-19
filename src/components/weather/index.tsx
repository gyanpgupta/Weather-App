import React, { FunctionComponent } from 'react';
import { Container } from 'reactstrap';

import { WeatherProps } from '../../interfaces';

const WeatherForm = React.lazy(() => import('./weatherForm'));

const Weather: FunctionComponent<WeatherProps> = (props) => {
    return (
        <Container>
            <WeatherForm {...props} />
        </Container>
    );
};

export default Weather;
