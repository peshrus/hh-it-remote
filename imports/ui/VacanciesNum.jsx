import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {createContainer} from 'meteor/react-meteor-data';

import {Vacancies} from '../api/vacancies.js';

// App component - represents the whole app
class VacanciesNum extends Component {
    render() {
        return (
            <p className="navbar-text navbar-right">Найдено вакансий на <a href="https://hh.ru/" target="_blank" className="navbar-link">hh.ru</a>: <span id="vacancies-num" className="label label-success">{this.props.count}</span></p>
        );
    }
}

VacanciesNum.propTypes = {
    count: PropTypes.number.isRequired,
};

export default createContainer(() => {
    Meteor.subscribe('vacancies');

    return {
        count: Vacancies.find({}).count()
    };
}, VacanciesNum);