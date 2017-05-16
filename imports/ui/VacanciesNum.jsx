import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {createContainer} from 'meteor/react-meteor-data';
import {FlowRouter} from 'meteor/kadira:flow-router';

import {Vacancies} from '../api/vacancies.js';

class VacanciesNum extends Component {
    render() {
        return (
            <p className="navbar-text">Найдено вакансий на <a href={this.props.hhLink} target="_blank"
                                                              className="navbar-link"
                                                              title="Показать найденные вакансии на сайте hh.ru">hh.ru</a>:<span
                className="label label-success">{this.props.count}</span></p>
        );
    }
}

VacanciesNum.propTypes = {
    count: PropTypes.number.isRequired,
    hhLink: PropTypes.string
};

export default createContainer(() => {
    Meteor.subscribe('vacancies');
    let query = {};

    if (FlowRouter.getQueryParam('filter')) {
        let filter = new RegExp(FlowRouter.getQueryParam('filter'), 'ig');
        if (!query.$and) {
            query.$and = [];
        }
        query.$and.push({
            $or: [
                {name: filter},
                {requirement: filter},
                {responsibility: filter},
                {area: filter},
                {employer: filter}
            ]
        });
    }

    if (FlowRouter.getParam('specId')) {
        if (!query.$and) {
            query.$and = [];
        }
        query.$and.push({specialization: FlowRouter.getParam('specId')});
    }

    Meteor.call('getHhLink', (error, result) => {
        if (!error) {
            Session.set('hhLink', result);
        } else {
            console.log(error);
        }
    });

    return {
        count: Vacancies.find(query).count(),
        hhLink: Session.get('hhLink')
    };
}, VacanciesNum);