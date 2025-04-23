import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    // GET weather data from city name
    const weatherData = await WeatherService.getWeatherByCity(city);

    // Save city to search history
    const savedCity = await HistoryService.addCity(city);

    return res.status(200).json({ weatherData, savedCity });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to get weather data' });
  }
});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    const history = await HistoryService.getCities();
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await HistoryService.deleteCity(id);
    res.json({ success: true, deleted: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete city from history' });
  }
});

export default router;