import {apiHost, specializationsStr, userAgent} from './const';
import {Mongo} from 'meteor/mongo';
import {HTTP} from 'meteor/http';
import {Meteor} from 'meteor/meteor';

export const Vacancies = new Mongo.Collection('vacancies');

export function refreshVacancies() {
    console.log('Refresh vacancies...');
    fetchHhVacancies(specializationsStr);
    Meteor.setTimeout(refreshVacancies, 3600000);
}

let hhLink = 'https://hh.ru';

Meteor.methods({
    'getHhLink'() {
        return hhLink;
    }
});

function fetchHhVacancies(specializationStr, page = 0) {
    console.log('Fetch vacancies page: ' + page + ' (' + specializationStr + ')');
    try {
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

        result.data.items.map(hhVacancy => {
                let specializationStrParts = specializationStr.split('=');
                let modifier;

                if (specializationStrParts.length !== 2) {
                    modifier = {
                        $set: {
                            hh_id: hhVacancy.id,
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
                } else {
                    modifier = {
                        $set: {hh_id: hhVacancy.id},
                        $push: {specialization: specializationStrParts[1]}
                    };
                }

                Vacancies.upsert({hh_id: hhVacancy.id}, modifier);
            }
        );

        let nextPage = result.data.page + 1;
        if (nextPage === 1) {
            if (specializationStr.indexOf('&') >= 0) {
                hhLink = result.data.alternate_url;
            }

            while (nextPage < result.data.pages) {
                fetchHhVacancies(specializationStr, nextPage++);
            }
        } else if (nextPage === result.data.pages && specializationStr.indexOf('&') >= 0) {
            specializationStr.split('&').forEach(specializationStr => fetchHhVacancies(specializationStr)); // setting of specializations
        }
    } catch (e) {
        console.log(e);
    }
}