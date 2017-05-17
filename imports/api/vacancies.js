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
    try {
      console.log(`Fetch vacancies page: ${page} (${specializationStr})`);
      const HH_RESPONSE = HTTP.get(
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
      );

      const specializationStrParts = specializationStr.split('=');
      const allSpecVacanciesFetched = specializationStrParts.length > 2;
      Array.prototype.forEach.call(HH_RESPONSE.data.items, (hhVacancy) => {
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
              hh_page: HH_RESPONSE.data.page ? HH_RESPONSE.data.page : 0,
              insertedAt: new Date(),
            },
          };
        } else { // only one specialization vacancies are fetched
          modifier = {
            $set: { _id: hhVacancy.id },
            $addToSet: { specialization: specializationStrParts[1] },
          };
        }

        const upsertResult = Vacancies.upsert({ _id: hhVacancy.id }, modifier);

        if (allSpecVacanciesFetched && !upsertResult.insertedId) {
          console.log(`!!! Not inserted: ${hhVacancy.id}`);
        }
      },
      );

      let nextPage = HH_RESPONSE.data.page + 1;
      if (nextPage === 1) {
        if (allSpecVacanciesFetched) {
          hhLink = HH_RESPONSE.data.alternate_url;
          console.log(`Found vacancies: ${HH_RESPONSE.data.found}`);
        }

        while (nextPage < HH_RESPONSE.data.pages) {
          fetchHhVacancies(specializationStr, nextPage++);
        }
      }

      resolve();
    } catch (error) {
      console.log(error);
    }
  });
}

export function refreshVacancies() {
  console.log('Refresh vacancies...');
  const result = new Promise((resolve) => {
    fetchHhVacancies(SPECIALIZATIONS_STR);
    // setting of specializations
    SPECIALIZATIONS_STR.split('&').forEach(specializationStr => fetchHhVacancies(specializationStr));
    resolve();
  });
  Meteor.setTimeout(refreshVacancies, 3600000);

  return result;
}
