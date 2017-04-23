import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {createContainer} from 'meteor/react-meteor-data';

import {Vacancies} from '../api/vacancies.js';

import Vacancy from './Vacancy.jsx';

// App component - represents the whole app
class VacanciesComp extends Component {
    renderVacancies() {
        return this.props.vacancies.map((vacancy) => (
            <Vacancy key={vacancy._id} vacancy={vacancy}/>
        ));
    }

    render() {
        return (
            <div className="row">
                {this.renderVacancies()}
            </div>
        );
    }
}

VacanciesComp.propTypes = {
    vacancies: PropTypes.array.isRequired,
};

export default createContainer(() => {
    Meteor.subscribe('vacancies');

    return {
        vacancies: Vacancies.find({}, {sort: {inserted: 1}, limit: Session.get('vacanciesLimit')}).fetch(),
    };
}, VacanciesComp);