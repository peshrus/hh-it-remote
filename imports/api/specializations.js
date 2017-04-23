import {apiHost, userAgent, specializationsStr} from './const';
import {Mongo} from 'meteor/mongo';
import {HTTP} from 'meteor/http';

export const Specializations = new Mongo.Collection('specializations');

export function getSpecializations() {
    console.log('Get specializations...');
    Specializations.remove({});
    fetchHhSpecializations();
}


function fetchHhSpecializations() {
    HTTP.call(
        'GET',
        apiHost + 'specializations',
        {
            headers: {
                'User-Agent': userAgent
            }
        },
        (error, result) => {
            if (!error) {
                let specializationsArr = specializationsStr.split('&').map(specKeyValue => specKeyValue.split('=')[1]);
                console.log('Requested specializations: ' + specializationsArr);

                result.data.map(profession => profession.specializations.map(specialization => {
                    if (specializationsArr.indexOf(specialization.id) >= 0) {
                        Specializations.insert({
                            name: specialization.name
                        });
                    }
                }));
            } else {
                console.log(error);
            }
        }
    );
}