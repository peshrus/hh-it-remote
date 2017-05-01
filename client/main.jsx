import React from 'react';
import {Meteor} from 'meteor/meteor';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount, withOptions} from 'react-mounter';

import VacanciesComp from '../imports/ui/VacanciesComp.jsx';
import VacanciesNum from '../imports/ui/VacanciesNum.jsx';
import SpecializationsComp from '../imports/ui/SpecializationsComp.jsx';

FlowRouter.route('/', {
    name: 'Vacancies.show',
    action() {
        const mount1 = withOptions({
            rootId: 'vacancies',
        }, mount);
        mount1(VacanciesComp, {main: <VacanciesComp/>});

        const mount2 = withOptions({
            rootId: 'vacancies-num',
        }, mount);
        mount2(VacanciesNum, {main: <VacanciesNum/>});

        const mount3 = withOptions({
            rootId: 'specializations',
        }, mount);
        mount3(SpecializationsComp, {main: <SpecializationsComp/>});
    }
});

FlowRouter.route('/:_id', {
    name: 'Vacancies.specialization.show',
    action(params, queryParams) {
        console.log("Specialization: " + params._id);
        //Session.set('vacanciesSpecialization', params._id);
    }
});

var lastScrollTop = 0;

Meteor.startup(() => {
    Session.set('vacanciesLimit', 15);
    $(window).scroll(function (event) {
        // test if we are near the bottom of the window
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            // where are we in the page?
            const scrollTop = $(window).scrollTop();
            // test if we are going down
            if (scrollTop > lastScrollTop) {
                // yes we are heading down...
                Session.set('vacanciesLimit', Session.get('vacanciesLimit') + 3);
            }

            lastScrollTop = scrollTop;
        }

    });
});