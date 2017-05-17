/* eslint-disable react/prefer-stateless-function,react/require-default-props,no-undef */
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Vacancies, makeCollectionQuery } from '../api/vacancies.js';

class VacanciesNum extends Component {
  render() {
    return (
      <p className="navbar-text">Найдено вакансий на <a
        href={this.props.hhLink}
        target="_blank"
        rel="noopener noreferrer"
        className="navbar-link"
        title="Показать найденные вакансии на сайте hh.ru"
      >hh.ru</a>:<span
        className="label label-success"
      >{this.props.count}</span></p>
    );
  }
}

VacanciesNum.propTypes = {
  count: PropTypes.number.isRequired,
  hhLink: PropTypes.string,
};

export default createContainer(() => {
  Meteor.subscribe('vacancies');

  Meteor.call('getHhLink', (error, result) => {
    if (!error) {
      Session.set('hhLink', result);
    } else {
      console.log(error);
    }
  });

  return {
    count: Vacancies.find(makeCollectionQuery()).count(),
    hhLink: Session.get('hhLink'),
  };
}, VacanciesNum);
