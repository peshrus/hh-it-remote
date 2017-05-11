import React from 'react';
import {Meteor} from 'meteor/meteor';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount, withOptions} from 'react-mounter';

import VacanciesComp from '../imports/ui/VacanciesComp.jsx';
import VacanciesNum from '../imports/ui/VacanciesNum.jsx';
import SpecializationsComp from '../imports/ui/SpecializationsComp.jsx';
import Search from '../imports/ui/Search.jsx';

function mountComponents() {
    const vacanciesMount = withOptions({
        rootId: 'vacancies',
    }, mount);
    vacanciesMount(VacanciesComp, {main: <VacanciesComp/>});

    const vacanciesNumMount = withOptions({
        rootId: 'vacancies-num',
    }, mount);
    vacanciesNumMount(VacanciesNum, {main: <VacanciesNum/>});

    const specializationsMount = withOptions({
        rootId: 'specializations',
    }, mount);
    specializationsMount(SpecializationsComp, {main: <SpecializationsComp/>});

    const searchMount = withOptions({
        rootId: 'search',
    }, mount);
    searchMount(Search, {main: <Search/>});
}

FlowRouter.route('/', {
    name: 'Vacancies.show',
    action() {
        mountComponents();
    }
});

FlowRouter.route('/:specId', {
    name: 'Vacancies.specialization.show',
    action() {
        mountComponents();
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