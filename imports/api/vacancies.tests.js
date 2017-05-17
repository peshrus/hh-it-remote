import { HTTP } from 'meteor/http';
import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { API_HOST, SPECIALIZATIONS_STR, USER_AGENT } from './const';
import { refreshVacancies, Vacancies } from './vacancies.js';

if (Meteor.isServer) {
  describe('vacancies', () => {
    describe('api', () => {
      it('refreshVacancies', function testRefreshVacancies() {
        this.timeout(80000); // such huge timeout is for Travis CI

        return refreshVacancies().then(() => {
          assert.equal(
            Vacancies.find().count(),
            HTTP.get(
              `${API_HOST}vacancies`,
              {
                params: {
                  schedule: 'remote',
                  order_by: 'salary_desc',
                  per_page: '500',
                },
                headers: { 'User-Agent': USER_AGENT },
                query: `employment=full&employment=part&employment=project&${SPECIALIZATIONS_STR}`,
              },
            ).data.found,
          );
        });
      });
    });
  });
}
