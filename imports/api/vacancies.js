import {apiHost, specializationsStr, userAgent} from './const';
import {Mongo} from 'meteor/mongo';
import {HTTP} from 'meteor/http';
import {Meteor} from 'meteor/meteor';

export const Vacancies = new Mongo.Collection('vacancies');

export function refreshVacancies() {
    console.log('Refresh vacancies...');
    let result = new Promise((resolve, reject) => {
        fetchHhVacancies(specializationsStr);
        specializationsStr.split('&').forEach(specializationStr => fetchHhVacancies(specializationStr)); // setting of specializations
        resolve();
    });
    Meteor.setTimeout(refreshVacancies, 3600000);

    return result;
}

let hhLink = 'https://hh.ru';

Meteor.methods({
    'getHhLink'() {
        return hhLink;
    }
});

function fetchHhVacancies(specializationStr, page = 0) {
    return new Promise((resolve, reject) => {
        try {
            console.log('Fetch vacancies page: ' + page + ' (' + specializationStr + ')');
            let result = HTTP.get(
                apiHost + 'vacancies',
                {
                    params: {
                        'schedule': 'remote',
                        'order_by': 'salary_desc',
                        'per_page': '500',
                        'page': page
                    },
                    headers: {'User-Agent': userAgent},
                    query: 'employment=full&employment=part&employment=project&' + specializationStr
                }
            );

            let specializationStrParts = specializationStr.split('=');
            let allSpecVacanciesFetched = specializationStrParts.length > 2;
            result.data.items.map(hhVacancy => {
                    let modifier;

                    if (allSpecVacanciesFetched) {
                        modifier = {
                            $set: {
                                _id: hhVacancy.id,
                                salary: hhVacancy.salary,
                                requirement: hhVacancy.snippet ? hhVacancy.snippet.requirement : '',
                                responsibility: hhVacancy.snippet ? hhVacancy.snippet.responsibility : '',
                                name: hhVacancy.name,
                                area: hhVacancy.area ? hhVacancy.area.name : '',
                                employer: hhVacancy.employer ? hhVacancy.employer.name : '',
                                employer_url: hhVacancy.employer ? hhVacancy.employer.alternate_url : '#',
                                url: hhVacancy.alternate_url,
                                hh_page: result.data.page ? result.data.page : 0,
                                insertedAt: new Date()
                            }
                        };
                    } else { // only one specialization vacancies are fetched
                        modifier = {
                            $set: {_id: hhVacancy.id},
                            $addToSet: {specialization: specializationStrParts[1]}
                        };
                    }

                    let upsertResult = Vacancies.upsert({_id: hhVacancy.id}, modifier);

                    if (allSpecVacanciesFetched && !upsertResult.insertedId) {
                        console.log('!!! Not inserted: ' + hhVacancy.id);
                    }
                }
            );

            let nextPage = result.data.page + 1;
            if (nextPage === 1) {
                if (allSpecVacanciesFetched) {
                    hhLink = result.data.alternate_url;
                    console.log('Found vacancies: ' + result.data.found);
                }

                while (nextPage < result.data.pages) {
                    fetchHhVacancies(specializationStr, nextPage++);
                }
            }

            resolve();
        } catch (error) {
            console.log(error);
        }
    });
}