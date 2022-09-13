import axios from 'axios';
import { clientCredentials } from '../utils/client';

const tomApi = clientCredentials.tomTomApi;

const getPoi = (input, lat, long) => new Promise((resolve, reject) => {
  axios.get(`https://api.tomtom.com/search/2/search/${input}.json?countrySet=US&lat=${lat}&lon=${long}&language=en-US&extendedPostalCodesFor=POI&minFuzzyLevel=1&maxFuzzyLevel=2&idxSet=POI&view=Unified&relatedPois=off&key=${tomApi}`)
    .then((result) => {
      const poiArray = Object.values(result.data.results);
      const returnArray = poiArray.map((poi) => (
        {
          value: poi.poi.name,
          label: `${poi.poi.name}, (${poi.address.localName})`,
          city: poi.address.localName,
          state: poi.address.countrySubdivision,
          name: 'location',
        }
      ));
      resolve(returnArray);
    })
    .catch(reject);
});

const getCity = (input) => new Promise((resolve, reject) => {
  axios.get(`https://api.tomtom.com/search/2/geocode/${input}.json?storeResult=false&view=Unified&key=${tomApi}`)
    .then((result) => {
      const cityArray = Object.values(result.data.results);
      const returnArray = cityArray.map((city) => ({
        value: `${city.address.municipality}, ${city.address.countrySubdivision}`,
        label: `${city.address.municipality}, ${city.address.countrySubdivision}`,
        name: 'homeCity',
        lat: city.position.lat,
        long: city.position.lon,
      }));
      resolve(returnArray);
    }).catch(reject);
});

export { getPoi, getCity };