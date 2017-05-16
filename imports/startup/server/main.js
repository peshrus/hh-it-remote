import {Meteor} from 'meteor/meteor';
import {refreshVacancies, Vacancies} from '../../api/vacancies.js';
import {getSpecializations, Specializations} from '../../api/specializations.js';

Meteor.startup(() => {
    console.log('hh-it-remote starting...');
    Vacancies.remove({});

    refreshVacancies();
    getSpecializations();

    Meteor.publish('vacancies', () => {
        return Vacancies.find();
    });
    Meteor.publish('specializations', () => {
        return Specializations.find();
    });
});