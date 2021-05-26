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
    const {
      query: { searchValue = '' },
    } = req;

    const LOCATION_API: any = process.env.LOCATION_API;
    const HOURLY_API: any = process.env.HOURLY_API;
    const WEEKLY_API: any = process.env.WEEKLY_API;

    const value: string | any = searchValue;
    var matches = value.match(/\d+/g);

    await axios
      .get(
        LOCATION_API.replace(
          ':keyType',
          matches ? 'geoposition' : 'cities'
        ).replace(
          ':searchValue',
          matches
            ? `${matches[0]}.${matches[1]}, ${matches[2]}.${matches[3]}`
            : value
        )
      )
      .then(async (cityResult) => {
        if (cityResult && cityResult.data && cityResult.data[0]) {
          const key = cityResult.data[0].Key;
          const localizedName: string = cityResult.data[0].LocalizedName;
          const localizedState: string =
            cityResult.data[0].AdministrativeArea.LocalizedName;

          // Check the redis store for the data first
          await client.get(`weather-${key}`, async (err: any, result: any) => {
            if (result) {
              console.log('result cache');
              const { hourlyData, weeklyData } = JSON.parse(result);
              return res.status(200).json({
                responseCode: 200,
                success: true,
                message: 'Weather data fetched successfully',
                hourlyData,
                weeklyData,
                localizedName: localizedName + ', ' + localizedState,
              });
            }
            console.log('without cache');

            await axios
              .get(`${HOURLY_API.replace(':key', key)}`)
              .then(async (response: object | any) => {
                await axios
                  .get(`${WEEKLY_API.replace(':key', key)}`)
                  .then(async (result: object | any) => {
                    const cacheData = {
                      hourlyData: response.data,
                      weeklyData: result.data,
                    };

                    // save the record in the cache for subsequent request
                    client.setex(
                      `weather-${key}`,
                      1440,
                      JSON.stringify(cacheData)
                    );

                    return res.status(200).json({
                      responseCode: 200,
                      success: true,
                      message: 'Weather data fetched successfully',
                      hourlyData: response.data,
                      weeklyData: result.data,
                      localizedName: localizedName + ', ' + localizedState,
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
        }
      })
      .catch((error) => {
        console.log('error', error);
        return res.status(500).json({
          error: error.message,
        });
      });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export default { list };
