/* eslint-disable react/forbid-prop-types,no-undef */
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Vacancies } from '../api/vacancies.js';

import Vacancy from './Vacancy.jsx';

class VacanciesComp extends Component {
  renderVacancies() {
    return this.props.vacancies.map(vacancy => (
      <Vacancy key={vacancy._id} vacancy={vacancy} />
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
  const query = {};

  if (FlowRouter.getQueryParam('filter')) {
    const filter = new RegExp(FlowRouter.getQueryParam('filter'), 'ig');
    if (!query.$and) {
      query.$and = [];
    }
    query.$and.push({
      $or: [
        { name: filter },
        { requirement: filter },
        { responsibility: filter },
        { area: filter },
        { employer: filter },
      ],
    });
  }

  if (FlowRouter.getParam('specId')) {
    if (!query.$and) {
      query.$and = [];
    }
    query.$and.push({ specialization: FlowRouter.getParam('specId') });
  }

  return {
    vacancies: Vacancies.find(query, {
      sort: { hh_page: 1, insertedAt: 1 },
      limit: Session.get('vacanciesLimit'),
    }).fetch(),
  };
}, VacanciesComp);
