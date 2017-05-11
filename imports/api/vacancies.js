import {apiHost, specializationsStrArr, userAgent} from './const';
import {Mongo} from 'meteor/mongo';
import {HTTP} from 'meteor/http';
import {Meteor} from 'meteor/meteor';

export const Vacancies = new Mongo.Collection('vacancies');

export function refreshVacancies() {
    console.log('Refresh vacancies...');
    specializationsStrArr.forEach(specializationStr => fetchHhVacancies(specializationStr));
    Meteor.setTimeout(refreshVacancies, 3600000);
}

function fetchHhVacancies(specializationStr, page = 0) {
    console.log('Fetch vacancies page: ' + page + ' (' + specializationStr + ')');
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
            headers: {'User-Agent': userAgent},
            query: 'employment=full&employment=part&employment=project&' + specializationStr
        },
        (error, result) => {
            if (!error) {
                result.data.items.map(hhVacancy => {
                        Vacancies.upsert(
                            {hh_id: hhVacancy.id},
                            {
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
                                    insertedAt: new Date()
                                },
                                $push: {specialization: specializationStr.split('=')[1]}
                            }
                        );
                    }
                );

                let nextPage = result.data.page + 1;
                if (nextPage === 1) {
                    while (nextPage < result.data.pages) {
                        fetchHhVacancies(specializationStr, nextPage++);
                    }
                }
            } else {
                console.log(error);
            }
        }
    );
}