import React, {Component} from 'react';
import PropTypes from 'prop-types'

// Vacancy component - represents a single vacancy
export default class Vacancy extends Component {
    render() {
        {/*<li><a href={this.props.vacancy.url} target="_blank">{this.props.vacancy.name}</a> ({this.props.vacancy.salary}) - <a href={this.props.vacancy.employer_url} target="_blank">{this.props.vacancy.employer}</a> - {this.props.vacancy.area}</li>*/}
        return (
            <div className="col-xs-12 col-md-6" id="{this.props.vacancy._id}">
                <div className="thumbnail">
                    <div className="caption">
                        <h2><a href={this.props.vacancy.url} target="_blank">{this.props.vacancy.name}</a></h2>
                        <p><span className="label label-success">{this.props.vacancy.salary}</span> <a href={this.props.vacancy.employer_url} target="_blank"><span className="label label-primary">{this.props.vacancy.employer}</span></a> <span className="label label-info">{this.props.vacancy.area}</span></p>
                        <p>{this.props.vacancy.requirement}</p>
                        <p>{this.props.vacancy.responsibility}</p>
                    </div>
                </div>
            </div>
        );
    }
}

Vacancy.propTypes = {
    // This component gets the vacancy to display through a React prop.
    // We can use propTypes to indicate it is required
    vacancy: PropTypes.object.isRequired,
};