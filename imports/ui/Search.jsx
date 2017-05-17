/* eslint-disable react/no-find-dom-node,react/no-string-refs */
import { FlowRouter } from 'meteor/kadira:flow-router';
import React, { Component } from 'react';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = { filter: '' };

    this.handleChange = this.handleChange.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
  }

  handleChange(event) {
    this.setState({ filter: event.target.value });
  }

  applyFilter(event) {
    event.preventDefault();

    FlowRouter.setQueryParams({ filter: encodeURIComponent(this.state.filter) });
  }

  render() {
    return (
      <form className="navbar-form" onSubmit={this.applyFilter}>
        <div className="form-group">
          <input
            type="text"
            ref="filter"
            className="form-control"
            placeholder="Ключевые слова"
            value={this.state.filter}
            onChange={this.handleChange}
          />
        </div>
        <button type="submit" className="btn btn-default">Найти</button>
      </form>
    );
  }
}
