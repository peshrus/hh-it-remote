import {Meteor} from 'meteor/meteor';
import {refreshVacancies, Vacancies} from '../imports/api/vacancies.js';
import {getSpecializations, Specializations} from '../imports/api/specializations.js';

Meteor.startup(() => {
    refreshVacancies();
    getSpecializations();

    Meteor.publish('vacancies', function vacanciesPublication() {
        return Vacancies.find();
    });
    Meteor.publish('specializations', function specializationsPublication() {
        return Specializations.find();
    });
});