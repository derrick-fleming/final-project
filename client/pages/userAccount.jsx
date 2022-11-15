import React from 'react';
import defaultStates from '../lib/defaultStateCount';

export default class UserAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountId: 1
    };
  }

  componentDidMount() {
    const { accountId } = this.state;
    fetch(`/api/accounts/${accountId}`)
      .then(response => response.json())
      .then(result => {
        result.forEach(element => {
          const stateCode = element.stateCode;
          defaultStates[stateCode].visits = element.visits;
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    return <div />;
  }
}
