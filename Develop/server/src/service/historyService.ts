import { readFile, writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '..', 'data', 'searchHistory.json');


// TODO: Define a City class with name and id properties
class City {
  constructor(public name: string, public id: string = uuidv4()) {}
}
// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  // private async read() {}
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
  private async read(): Promise<City[]> {
    try {
      const data = await readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return []; 
    }
  }

  private async write(cities: City[]): Promise<void> {
    await writeFile(filePath, JSON.stringify(cities, null, 2));
  }

  public async getCities(): Promise<City[]> {
    return await this.read();
  }

  public async addCity(cityName: string): Promise<City> {
    const cities = await this.read();

    
    const alreadyExists = cities.some(
      c => c.name.toLowerCase() === cityName.toLowerCase()
    );
    if (alreadyExists) {
      return cities.find(c => c.name.toLowerCase() === cityName.toLowerCase())!;
    }

    const city = new City(cityName);
    cities.push(city);
    await this.write(cities);
    return city;
  }

  public async deleteCity(id: string): Promise<City | null> {
    const cities = await this.read();
    const index = cities.findIndex(c => c.id === id);

    if (index !== -1) {
      const removed = cities.splice(index, 1)[0];
      await this.write(cities);
      return removed;
    }

    return null;
  }
}


export default new HistoryService();
