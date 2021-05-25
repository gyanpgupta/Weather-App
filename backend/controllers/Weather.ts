import express from 'express';
import redis from 'redis';
import axios from 'axios';

/*
---------------------------------------------------
  Make a connection to the local instance of redis
---------------------------------------------------
*/
const client = redis.createClient(6379);

client.on('error', (error: any) => {
  console.error(error);
});

/*
---------------------------------
  API to fetch Weather's record
---------------------------------
*/

const list: any = async (req: express.Request, res: express.Response) => {
  try {
    // Check the redis store for the data first
    client.get('weather-paris-france', async (err: any, result: any) => {
      if (result) {
        console.log('result cache');

        const { hourlyData, weeklyData } = JSON.parse(result);
        return res.status(200).json({
          responseCode: 200,
          success: true,
          message: 'Weather data fetched successfully',
          hourlyData,
          weeklyData,
        });
      }
      console.log('without cache');

      await axios
        .get(`${process.env.HOURLY_API}`)
        .then(async (response: object | any) => {
          await axios
            .get(`${process.env.WEEKLY_API}`)
            .then(async (result: object | any) => {
              const cacheData = {
                hourlyData: response.data,
                weeklyData: result.data,
              };

              // save the record in the cache for subsequent request
              client.setex(
                'weather-paris-france',
                1440,
                JSON.stringify(cacheData)
              );

              return res.status(200).json({
                responseCode: 200,
                success: true,
                message: 'Weather data fetched successfully',
                hourlyData: response.data,
                weeklyData: result.data,
              });
            })
            .catch((error) => {
              return res.status(500).json({
                error: error.message,
              });
            });
        })
        .catch((error) => {
          return res.status(500).json({
            error: error.message,
          });
        });
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export default { list };
