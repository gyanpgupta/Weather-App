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

    const LOCATION_API: any = process.env.LOCATION_API; // location api url
    const HOURLY_API: any = process.env.HOURLY_API; // hourly data api url
    const WEEKLY_API: any = process.env.WEEKLY_API; // weekly data api url

    const value: string | any = searchValue;
    // To check user entered text is place name or lat/long
    // if matches means user entered the lat/long of the place
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
          const key = cityResult.data[0].Key; // Place key

          const localizedName: string = cityResult.data[0].LocalizedName; // Place name

          const localizedState: string =
            cityResult.data[0].AdministrativeArea.LocalizedName; // Place state name

          // Check the redis store for the data first
          await client.get(`weather-${key}`, async (err: any, result: any) => {
            // if data found in cache then send the response to client.
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

            // Runs only if data is not available in cache.
            await axios
              .get(`${HOURLY_API.replace(':key', key)}`)
              .then(async (response: object | any) => {
                // hourly weather data response
                await axios
                  .get(`${WEEKLY_API.replace(':key', key)}`)
                  .then(async (result: object | any) => {
                    // weekly weather data response

                    const cacheData = {
                      // cache object with hourly and weekly data
                      hourlyData: response.data,
                      weeklyData: result.data,
                    };

                    // save the record in the cache for subsequent request
                    client.setex(
                      `weather-${key}`, // place name key it's unique
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
