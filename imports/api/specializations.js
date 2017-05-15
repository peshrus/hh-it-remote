import {apiHost, specializationsStr, userAgent} from './const';
import {Mongo} from 'meteor/mongo';
import {HTTP} from 'meteor/http';

export const Specializations = new Mongo.Collection('specializations');

export function getSpecializations() {
    console.log('Get specializations...');
    Specializations.remove({});
    return fetchHhSpecializations();
}


function fetchHhSpecializations() {
    return new Promise((resolve, reject) => {
        let result = HTTP.get(apiHost + 'specializations', {headers: {'User-Agent': userAgent}});

        let specializationsArr = specializationsStr.split('&').map(specKeyValue => specKeyValue.split('=')[1]);
        console.log('Requested specializations: ' + specializationsArr);

        result.data.map(profession => profession.specializations.map(specialization => {
            if (specializationsArr.indexOf(specialization.id) >= 0) {
                Specializations.insert({
                    _id: specialization.id,
                    name: specialization.name
                });
            }
        }));

        resolve();
    });
}