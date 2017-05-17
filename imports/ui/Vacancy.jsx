/* eslint-disable react/prefer-stateless-function,react/forbid-prop-types */
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class Vacancy extends Component {
  render() {
    let salary = '';

    if (this.props.vacancy.salary) {
      const SAL_FORMAT =
        new Intl.NumberFormat('ru-RU',
          {
            style: 'currency',
            currency: this.props.vacancy.salary.currency.replace('RUR', 'RUB'),
            minimumFractionDigits: 0,
          });
      if (this.props.vacancy.salary.from && this.props.vacancy.salary.to) {
        salary =
          `${SAL_FORMAT.format(this.props.vacancy.salary.from)} - ${SAL_FORMAT.format(this.props.vacancy.salary.to)}`;
      } else if (this.props.vacancy.salary.from) {
        salary = `от ${SAL_FORMAT.format(this.props.vacancy.salary.from)}`;
      } else {
        salary = `до ${SAL_FORMAT.format(this.props.vacancy.salary.to)}`;
      }
    }

    return (
      <div className="col-xs-12 col-md-4" id={this.props.vacancy._id}>
        <div className="thumbnail">
          <div className="caption">
            <h2><a
              href={this.props.vacancy.url}
              target="_blank"
              rel="external noopener noreferrer"
              title="Показать вакансию на сайте hh.ru"
            >{this.props.vacancy.name}</a>
            </h2>
            <p><span className="label label-success">{salary}</span> {this.props.vacancy.employer &&
            <a
              href={this.props.vacancy.employer_url}
              target="_blank"
              rel="noopener noreferrer"
              title="Показать работодателя на сайте hh.ru"
            ><span
              className="label label-primary"
            >{this.props.vacancy.employer}</span></a>} {this.props.vacancy.area &&
            <span className="label label-info">{this.props.vacancy.area}</span>}</p>
            <p>{this.props.vacancy.requirement}</p>
            <p>{this.props.vacancy.responsibility}</p>
          </div>
        </div>
      </div>
    );
  }
}

Vacancy.propTypes = {
  vacancy: PropTypes.object.isRequired,
};
