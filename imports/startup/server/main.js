import { Meteor } from 'meteor/meteor';
import { getSpecializations, Specializations } from '../../api/specializations.js';
import { refreshVacancies, Vacancies } from '../../api/vacancies.js';

Meteor.startup(() => {
  console.log('hh-it-remote starting...');
  Vacancies.remove({});

  refreshVacancies();
  getSpecializations();

  Meteor.publish('vacancies', () => Vacancies.find());
  Meteor.publish('specializations', () => Specializations.find());
});
