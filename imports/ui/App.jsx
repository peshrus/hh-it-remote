import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

import {Vacancies} from '../api/vacancies.js';

import Vacancy from './Vacancy.jsx';

// App component - represents the whole app
class App extends Component {
    renderVacancies() {
        return this.props.vacancies.map((vacancy) => (
            <Vacancy key={vacancy._id} vacancy={vacancy}/>
        ));
    }

    render() {
        return (
            <div className="container">
                <header>
                    <h1>Удалённая работа в IT ({this.props.count})</h1>
                </header>

                <ul>
                    {this.renderVacancies()}
                </ul>
            </div>
        );
    }
}

App.propTypes = {
    vacancies: PropTypes.array.isRequired,
};

export default createContainer(() => {
    Meteor.subscribe('vacancies');

    return {
        vacancies: Vacancies.find({}, {sort: {inserted: 1}}).fetch(),
        count: Vacancies.find({}).count()
    };
}, App);