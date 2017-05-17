/* eslint-disable react/forbid-prop-types,max-len,react/prefer-stateless-function */
import { FlowRouter } from 'meteor/kadira:flow-router';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class Specialization extends Component {
  render() {
    return (
      <li className={FlowRouter.getParam('specId') === this.props.specialization._id ? 'active' : ''}><a
        id={this.props.specialization._id}
        href={`/${this.props.specialization._id}${FlowRouter.getQueryParam('filter') ? `?filter=${encodeURIComponent(FlowRouter.getQueryParam('filter'))}` : ''}`}
        title="Показать вакансии для этой специализации"
      >{this.props.specialization.name}</a>
      </li>
    );
  }
}

Specialization.propTypes = {
  specialization: PropTypes.object.isRequired,
};
