import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';

import apiRoutes from './routes';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: '100mb' }));

const corsOption = {
  origin: true,
  methods: 'GET',
  credentials: true,
};

app.use(cors(corsOption));
app.use('/api/v1', apiRoutes);

/*
------------------
    Create Server
------------------
*/

const server = http.createServer(app);

const port: number | any = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`App Listening on port ${port}!!!`);
});
