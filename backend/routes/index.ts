import express from 'express';

import WeatherRoutes from './WeatherRoutes';

const router: object | any = express.Router();

router.use('/weather', WeatherRoutes);

export default router;
