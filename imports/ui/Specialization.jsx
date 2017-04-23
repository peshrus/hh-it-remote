import React, {Component} from 'react';
import PropTypes from 'prop-types'

export default class Specialization extends Component {
    render() {
        return (

            <span id={this.props.specialization._id} className="label label-warning">{this.props.specialization.name}</span>
        );
    }
}

Specialization.propTypes = {
    specialization: PropTypes.object.isRequired,
};