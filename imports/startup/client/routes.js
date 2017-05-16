import React from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount, withOptions} from 'react-mounter';

import VacanciesComp from '../../ui/VacanciesComp.jsx';
import VacanciesNum from '../../ui/VacanciesNum.jsx';
import SpecializationsComp from '../../ui/SpecializationsComp.jsx';
import Search from '../../ui/Search.jsx';

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