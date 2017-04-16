import React, {Component} from 'react';
import PropTypes from 'prop-types'

// Vacancy component - represents a single vacancy
export default class Vacancy extends Component {
    render() {
        {/*<li><a href={this.props.vacancy.url} target="_blank">{this.props.vacancy.name}</a> ({this.props.vacancy.salary}) - <a href={this.props.vacancy.employer_url} target="_blank">{this.props.vacancy.employer}</a> - {this.props.vacancy.area}</li>*/}
        return (
            <div className="col-xs-12 col-md-3" id="{this.props.vacancy._id}">
                <div className="thumbnail">

                    {/*<a href="/image/{{_id}}"><img class="js-image thumbnail-img" src="{{img_src}}" alt="{{img_alt}}"/></a>*/}

                    <div className="caption">
                        <h2><a href={this.props.vacancy.url} target="_blank">{this.props.vacancy.name}</a></h2>

                        <p>{this.props.vacancy.salary}</p>
                        <p><a href={this.props.vacancy.employer_url} target="_blank">{this.props.vacancy.employer}</a></p>
                        <p>{this.props.vacancy.area}</p>
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