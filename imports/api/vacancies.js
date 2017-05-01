import {apiHost, specializationsStr, userAgent} from './const';
import {Mongo} from 'meteor/mongo';
import {HTTP} from 'meteor/http';
import {Meteor} from 'meteor/meteor';

export const Vacancies = new Mongo.Collection('vacancies');

export function refreshVacancies() {
    console.log('Refresh vacancies...');
    Vacancies.remove({});
    fetchHhVacancies();
}

function fetchHhVacancies(page = 0) {
    HTTP.call(
        'GET',
        apiHost + 'vacancies',
        {
            params: {
                'schedule': 'remote',
                'order_by': 'salary_desc',
                'per_page': '500',
                'page': page
            },
            headers: {
                'User-Agent': userAgent
            },
            query: 'employment=full&employment=part&employment=project&' + specializationsStr
        },
        (error, result) => {
            if (!error) {
                result.data.items.map(hhVacancy => Vacancies.insert({
                    salary: hhVacancy.salary,
                    requirement: hhVacancy.snippet ? hhVacancy.snippet.requirement : '',
                    responsibility: hhVacancy.snippet ? hhVacancy.snippet.responsibility : '',
                    name: hhVacancy.name,
                    area: hhVacancy.area ? hhVacancy.area.name : '',
                    employer: hhVacancy.employer ? hhVacancy.employer.name : '',
                    employer_url: hhVacancy.employer ? hhVacancy.employer.alternate_url : '#',
                    url: hhVacancy.alternate_url,
                    insertedAt: new Date()
                }));

                const nextPage = result.data.page + 1;
                if (nextPage < result.data.pages) {
                    fetchHhVacancies(nextPage);
                } else {
                    Meteor.setTimeout(refreshVacancies, 60000);
                }
            } else {
                console.log(error);
            }
        }
    );
}