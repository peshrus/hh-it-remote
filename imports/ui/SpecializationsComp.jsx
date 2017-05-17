/* eslint-disable jsx-a11y/href-no-hash,max-len,react/forbid-prop-types */
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Specializations } from '../api/specializations.js';

import Specialization from './Specialization.jsx';

// App component - represents the whole app
class SpecializationsComp extends Component {
  renderSpecializations() {
    return this.props.specializations.map(specialization => (
      <Specialization key={specialization._id} specialization={specialization} />
    ));
  }

  render() {
    return (
      <li className="dropdown">
        <a
          href="#"
          className="dropdown-toggle"
          data-toggle="dropdown"
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
        >Специализация <span className="caret" /></a>
        <ul className="dropdown-menu">
          <li className={FlowRouter.getParam('specId') ? '' : 'active'}>
            <a
              href={`/${FlowRouter.getQueryParam('filter') ? `?filter=${encodeURIComponent(FlowRouter.getQueryParam('filter'))}` : ''}`}
              title="Показать вакансии для всех специализаций"
            >Все</a>
          </li>
          <li role="separator" className="divider" />
          {this.renderSpecializations()}
        </ul>
      </li>
    );
  }
}

SpecializationsComp.propTypes = {
  specializations: PropTypes.array.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('specializations');

  return {
    specializations: Specializations.find({}, { sort: { name: 1 } }).fetch(),
  };
}, SpecializationsComp);
