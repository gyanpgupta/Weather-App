import express from 'express';

import { WeatherController } from '../controllers';

const router: object | any = express.Router();

router.get('/', WeatherController.list);

export default router;
