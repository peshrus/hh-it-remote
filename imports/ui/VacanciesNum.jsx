import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {createContainer} from 'meteor/react-meteor-data';
import {FlowRouter} from 'meteor/kadira:flow-router';

import {Vacancies} from '../api/vacancies.js';

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
    let filter = new RegExp(FlowRouter.getQueryParam('filter'), 'ig');

    return {
        count: Vacancies.find(
            {
                $or: [
                    {name: filter},
                    {requirement: filter},
                    {responsibility: filter},
                    {area: filter},
                    {employer: filter}
                ]
            }
        ).count()
    };
}, VacanciesNum);