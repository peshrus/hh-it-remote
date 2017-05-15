import {Meteor} from 'meteor/meteor';
import {refreshVacancies, Vacancies} from '../imports/api/vacancies.js';
import {getSpecializations, Specializations} from '../imports/api/specializations.js';

Meteor.startup(() => {
    console.log('hh-it-remote starting...');
    Vacancies.remove({});

    refreshVacancies();
    getSpecializations().catch(error => {
        console.log(error);
    });

    Meteor.publish('vacancies', () => {
        return Vacancies.find();
    });
    Meteor.publish('specializations', () => {
        return Specializations.find();
    });
});