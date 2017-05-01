import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {createContainer} from 'meteor/react-meteor-data';

import {Vacancies} from '../api/vacancies.js';

// App component - represents the whole app
class VacanciesNum extends Component {
    render() {
        return (
            <span>{this.props.count}</span>
        );
    }
}

VacanciesNum.propTypes = {
    count: PropTypes.number.isRequired
};

export default createContainer(() => {
    Meteor.subscribe('vacancies');

    return {
        count: Vacancies.find({}).count()
    };
}, VacanciesNum);