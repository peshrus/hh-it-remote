/* eslint-env mocha */
import {Meteor} from 'meteor/meteor';
import {refreshVacancies, Vacancies} from './vacancies.js';
import {apiHost, specializationsStr, userAgent} from './const';
import {HTTP} from 'meteor/http';
import {assert} from 'meteor/practicalmeteor:chai';

if (Meteor.isServer) {
    describe('vacancies', () => {
        describe('api', () => {
            it('refreshVacancies', function testRefreshVacancies() {
                this.timeout(80000);

                return refreshVacancies().then(() => {
                    assert.equal(
                        Vacancies.find().count(),
                        HTTP.get(
                            apiHost + 'vacancies',
                            {
                                params: {
                                    'schedule': 'remote',
                                    'order_by': 'salary_desc',
                                    'per_page': '500',
                                },
                                headers: {'User-Agent': userAgent},
                                query: 'employment=full&employment=part&employment=project&' + specializationsStr
                            }
                        ).data.found - 1 // https://github.com/hhru/api/issues/242
                    );
                });
            });
        });
    });
}