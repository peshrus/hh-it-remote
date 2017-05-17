import { HTTP } from 'meteor/http';
import { Mongo } from 'meteor/mongo';
import { API_HOST, SPECIALIZATIONS_STR, USER_AGENT } from './const';

export const Specializations = new Mongo.Collection('specializations');

function fetchHhSpecializations() {
  return new Promise((resolve) => {
    try {
      const HH_RESPONSE = HTTP.get(`${API_HOST}specializations`, { headers: { 'User-Agent': USER_AGENT } });

      const SPECIALIZATIONS_ARR = SPECIALIZATIONS_STR.split('&').map(specKeyValue => specKeyValue.split('=')[1]);
      console.log(`Requested specializations: ${SPECIALIZATIONS_ARR}`);

      // It is strange but HH_RESPONSE.data has the .map() method and does not have .forEach() one
      Array.prototype.forEach.call(HH_RESPONSE.data,
        profession => Array.prototype.forEach.call(profession.specializations, (specialization) => {
          if (SPECIALIZATIONS_ARR.indexOf(specialization.id) >= 0) {
            Specializations.insert({
              _id: specialization.id,
              name: specialization.name,
            });
          }
        }));

      resolve();
    } catch (error) {
      console.log(error);
    }
  });
}

export function getSpecializations() {
  console.log('Get specializations...');
  Specializations.remove({});
  return fetchHhSpecializations();
}
