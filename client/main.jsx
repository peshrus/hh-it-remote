import React from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';

import VacanciesComp from '../imports/ui/VacanciesComp.jsx';
import VacanciesNum from '../imports/ui/VacanciesNum.jsx';
import SpecializationsComp from '../imports/ui/SpecializationsComp.jsx';

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

    render(<VacanciesNum />, document.getElementById('vacancies-num'));
    render(<VacanciesComp />, document.getElementById('vacancies'));
    render(<SpecializationsComp />, document.getElementById('specializations'));
});