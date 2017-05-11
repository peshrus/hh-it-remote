import React, {Component} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import ReactDOM from 'react-dom';
import {createContainer} from 'meteor/react-meteor-data';

class Search extends Component {
    render() {
        return (
            <form className="navbar-form" onSubmit={this.applyFilter.bind(this)}>
                <div className="form-group">
                    <input type="text" ref="filter" className="form-control" placeholder="Ключевые слова"
                           defaultValue={FlowRouter.getQueryParam('filter')}/>
                </div>
                <button type="submit" className="btn btn-default">Найти</button>
            </form>
        );
    }

    applyFilter(event) {
        event.preventDefault();

        const filter = ReactDOM.findDOMNode(this.refs.filter).value.trim();
        FlowRouter.setQueryParams({filter: encodeURIComponent(filter)});
    }
}

export default createContainer(() => {
    return {};
}, Search);