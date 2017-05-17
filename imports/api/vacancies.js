import { HTTP } from 'meteor/http';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { API_HOST, SPECIALIZATIONS_STR, USER_AGENT } from './const';

export const Vacancies = new Mongo.Collection('vacancies');

let hhLink = 'https://hh.ru';

Meteor.methods({
  'getHhLink'() {
    return hhLink;
  },
});

function fetchHhVacancies(specializationStr, page = 0) {
  return new Promise((resolve) => {
    console.log(`Fetch vacancies page: ${page} (${specializationStr})`);
    HTTP.get(
      `${API_HOST}vacancies`,
      {
        params: {
          schedule: 'remote',
          order_by: 'salary_desc',
          per_page: '500',
          page,
        },
        headers: { 'User-Agent': USER_AGENT },
        query: `employment=full&employment=part&employment=project&${specializationStr}`,
      },
      (error, result) => {
        if (!error) {
          const specializationStrParts = specializationStr.split('=');
          const allSpecVacanciesFetched = specializationStrParts.length > 2;
          Array.prototype.forEach.call(result.data.items, (hhVacancy) => {
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
                  insertedAt: new Date(),
                },
              };
            } else { // only one specialization vacancies are fetched
              modifier = {
                $set: { _id: hhVacancy.id },
                $addToSet: { specialization: specializationStrParts[1] },
              };
            }

            Vacancies.upsert({ _id: hhVacancy.id }, modifier);
          });

          if (allSpecVacanciesFetched && result.data.page === 0) {
            hhLink = result.data.alternate_url;
            console.log(`Found vacancies: ${result.data.found}`);
          }

          const nextPage = result.data.page + 1;
          if (nextPage < result.data.pages) {
            resolve(fetchHhVacancies(specializationStr, nextPage));
          } else {
            resolve();
          }
        } else {
          console.log(error);
          resolve();
        }
      },
    );
  });
}

export function refreshVacancies() {
  console.log('Refresh vacancies...');
  // eslint-disable-next-line max-len
  return Promise.all(Array.of(fetchHhVacancies(SPECIALIZATIONS_STR), ...SPECIALIZATIONS_STR.split('&').map(specializationStr => fetchHhVacancies(specializationStr))))
    .then(() => Promise.resolve({
      then: Meteor.setTimeout(refreshVacancies, 60000),
    }));
}
