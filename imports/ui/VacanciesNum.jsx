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

    return {
        count: Vacancies.find(query).count()
    };
}, VacanciesNum);