import {Meteor} from 'meteor/meteor';
import {refreshVacancies} from '../imports/api/vacancies.js';

Meteor.startup(() => {
    refreshVacancies();
});