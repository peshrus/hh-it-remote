import React, {Component} from 'react';
import PropTypes from 'prop-types'

// Vacancy component - represents a single vacancy
export default class Vacancy extends Component {
    render() {
        let salary = '';

        if (this.props.vacancy.salary) {
            let salaryFormat =
                new Intl.NumberFormat('ru-RU',
                    {
                        style: 'currency',
                        currency: this.props.vacancy.salary.currency.replace('RUR', 'RUB'),
                        minimumFractionDigits: 0
                    });
            if (this.props.vacancy.salary.from && this.props.vacancy.salary.to) {
                salary = salaryFormat.format(this.props.vacancy.salary.from) + ' - ' + salaryFormat.format(this.props.vacancy.salary.to);
            } else if (this.props.vacancy.salary.from) {
                salary = 'от ' + salaryFormat.format(this.props.vacancy.salary.from);
            } else {
                salary = 'до ' + salaryFormat.format(this.props.vacancy.salary.to);
            }
        }

        return (
            <div className="col-xs-12 col-md-4" id={this.props.vacancy._id}>
                <div className="thumbnail">
                    <div className="caption">
                        <h2><a href={this.props.vacancy.url} target="_blank">{this.props.vacancy.name}</a></h2>
                        <p><span className="label label-success">{salary}</span> {this.props.vacancy.employer && <a href={this.props.vacancy.employer_url} target="_blank"><span className="label label-primary">{this.props.vacancy.employer}</span></a>} {this.props.vacancy.area && <span className="label label-info">{this.props.vacancy.area}</span>}</p>
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