import React, {Component, PropTypes} from 'react';

// Vacancy component - represents a single vacancy
export default class Vacancy extends Component {
    render() {
        return (
            <li><a href={this.props.vacancy.url} target="_blank">{this.props.vacancy.name}</a> ({this.props.vacancy.salary}) - <a href={this.props.vacancy.employer_url} target="_blank">{this.props.vacancy.employer}</a> - {this.props.vacancy.area}</li>
        );
    }
}

Vacancy.propTypes = {
    // This component gets the vacancy to display through a React prop.
    // We can use propTypes to indicate it is required
    vacancy: PropTypes.object.isRequired,
};