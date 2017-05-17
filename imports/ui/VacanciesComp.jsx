/* eslint-disable react/forbid-prop-types,no-undef */
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Vacancies, makeCollectionQuery } from '../api/vacancies.js';

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

  return {
    vacancies: Vacancies.find(makeCollectionQuery(), {
      sort: { hh_page: 1, insertedAt: 1 },
      limit: Session.get('vacanciesLimit'),
    }).fetch(),
  };
}, VacanciesComp);
