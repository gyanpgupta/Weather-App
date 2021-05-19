import React, { FunctionComponent } from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';

import { WeatherProps } from '../../interfaces';

const WeatherForm: FunctionComponent<WeatherProps> = (props) => {
    return (
        <Card>
            <CardTitle className='text-center'>Weather App</CardTitle>
            <CardBody></CardBody>
        </Card>
    );
};

export default WeatherForm;
