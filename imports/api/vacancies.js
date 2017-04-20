import {Mongo} from 'meteor/mongo';
import {HTTP} from 'meteor/http';
import {Meteor} from 'meteor/meteor';

export const Vacancies = new Mongo.Collection('vacancies');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('vacancies', function vacanciesPublication() {
        return Vacancies.find();
    });
}

export function refreshVacancies() {
    console.log('Refresh vacancies...');
    Vacancies.remove({});
    callHh();
}

function callHh(page = 0) {
    HTTP.call(
        'GET',
        'https://api.hh.ru/vacancies',
        {
            params: {
                'schedule': 'remote',
                'order_by': 'salary_desc',
                'per_page': '500',
                'page': page
            },
            headers: {
                'User-Agent': 'hh-it-remote.ru'
            },
            query: 'employment=full&employment=part&employment=project&specialization=1.474&specialization=1.9&specialization=1.82&specialization=1.89&specialization=1.113&specialization=1.221&specialization=1.270&specialization=1.272&specialization=1.274&specialization=1.277&specialization=1.295'
        },
        (error, result) => {
            if (!error) {
                result.data.items.map(item => Vacancies.insert({
                    salary: item.salary ? (((item.salary.from && item.salary.to) ? (item.salary.from + ' - ' + item.salary.to) : (item.salary.from ? 'от ' + item.salary.from : 'до ' + item.salary.to)) + ' ' + item.salary.currency) : '',
                    requirement: item.snippet ? item.snippet.requirement : '',
                    responsibility: item.snippet ? item.snippet.responsibility : '',
                    name: item.name,
                    area: item.area ? item.area.name : '',
                    employer: item.employer ? item.employer.name : '',
                    employer_url: item.employer ? item.employer.alternate_url : '#',
                    url: item.alternate_url,
                    inserted: new Date()
                }));

                const nextPage = result.data.page + 1;
                if (nextPage < result.data.pages) {
                    callHh(nextPage);
                } else {
                    Meteor.setTimeout(refreshVacancies, 60000);
                }
            } else {
                console.log(error);
            }
        }
    );
}