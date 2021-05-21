import express from 'express';
import axios from 'axios';

/*
---------------------------------
  API to fetch Weather's record
---------------------------------
*/

const list: any = async (req: express.Request, res: express.Response) => {
  try {
    await axios
      .get(`${process.env.HOURLY_API}`)
      .then(async (response: object | any) => {
        await axios
          .get(`${process.env.WEEKLY_API}`)
          .then(async (result: object | any) => {
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
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export default { list };
