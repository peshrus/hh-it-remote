import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {createContainer} from 'meteor/react-meteor-data';

import {Specializations} from '../api/specializations.js';

import Specialization from './Specialization.jsx';

// App component - represents the whole app
class SpecializationsComp extends Component {
    renderSpecializations() {
        return this.props.specializations.map((specialization) => (
            <Specialization key={specialization._id} specialization={specialization}/>
        ));
    }

    render() {
        return (
            <p className="navbar-text navbar-left">{this.renderSpecializations()}</p>
        );
    }
}

SpecializationsComp.propTypes = {
    specializations: PropTypes.array.isRequired,
};

export default createContainer(() => {
    Meteor.subscribe('specializations');

    return {
        specializations: Specializations.find({}/*, {sort: {name: 1}}*/).fetch(),
    };
}, SpecializationsComp);