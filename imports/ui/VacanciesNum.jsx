/* eslint-disable react/prefer-stateless-function,react/require-default-props,no-undef,react/forbid-prop-types */
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Specializations } from '../api/specializations.js';

import { makeCollectionQuery, Vacancies } from '../api/vacancies.js';

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
      >{this.props.count}</span>{this.props.specialization ?
        <span
          className="label label-primary"
          title={this.props.specialization.name}
        >{this.props.specialization.name}</span> : ''}</p>
    );
  }
}

VacanciesNum.propTypes = {
  count: PropTypes.number.isRequired,
  hhLink: PropTypes.string,
  specialization: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('vacancies');
  Meteor.subscribe('specializations');

  Meteor.call('getHhLink', (error, result) => {
    if (!error) {
      Session.set('hhLink', result);
    } else {
      console.log(error);
    }
  });

  return {
    count: Vacancies.find(makeCollectionQuery()).count(),
    // eslint-disable-next-line max-len
    hhLink: Session.get('hhLink') ? Session.get('hhLink').replace(/((?:&specialization=[0-9.]+)+)/g, FlowRouter.getParam('specId') ? `&specialization=${FlowRouter.getParam('specId')}` : '$1') : '',
    specialization: Specializations.findOne({ _id: FlowRouter.getParam('specId') }),
  };
}, VacanciesNum);
