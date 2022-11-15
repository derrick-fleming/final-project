import React from 'react';

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
      })
      .catch(err => console.error(err));
  }

  render() {
    return <div />;
  }
}
