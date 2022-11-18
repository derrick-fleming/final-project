import React from 'react';
import AppContext from '../lib/app-context';

export default class UserReviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const state = this.props.state;
    const token = window.localStorage.getItem('park-reviews-jwt');
    const header = {
      headers: {
        'X-Access-Token': token
      }
    };
    fetch(`api/reviews/${state}`, header)
      .then(response => response.json())
      .then(result => {
        this.setState({
          result
        });
      });
  }

  render() {
    return <div />;
  }
}

UserReviews.contextType = AppContext;
