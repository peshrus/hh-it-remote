import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Specialization extends Component {
    render() {
        return (
            <li><a id={this.props.specialization.hh_id} href={'/' + this.props.specialization.hh_id}>{this.props.specialization.name}</a></li>
        );
    }
}

Specialization.propTypes = {
    specialization: PropTypes.object.isRequired,
};