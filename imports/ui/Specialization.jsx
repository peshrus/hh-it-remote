import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FlowRouter} from 'meteor/kadira:flow-router';

export default class Specialization extends Component {
    render() {
        return (
            <li className={FlowRouter.getParam('specId') === this.props.specialization.hh_id ? 'active' : ''}><a
                id={this.props.specialization.hh_id}
                href={'/' + this.props.specialization.hh_id + (FlowRouter.getQueryParam('filter') ? '?filter=' + encodeURIComponent(FlowRouter.getQueryParam('filter')) : '')}>{this.props.specialization.name}</a>
            </li>
        );
    }
}

Specialization.propTypes = {
    specialization: PropTypes.object.isRequired,
};