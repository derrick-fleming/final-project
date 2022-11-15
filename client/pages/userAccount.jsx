import React from 'react';
import defaultStates from '../lib/defaultStateCount';

export default class UserAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountId: 1
    };
    this.renderInforgraphic = this.renderInforgraphic.bind(this);
  }

  componentDidMount() {
    const { accountId } = this.state;
    fetch(`/api/accounts/${accountId}`)
      .then(response => response.json())
      .then(result => {
        result.forEach(element => {
          const stateCode = element.stateCode;
          if (defaultStates[stateCode]) {
            defaultStates[stateCode].visits = element.visits;
          }
        });
        this.renderInforgraphic();
      })
      .catch(err => console.error(err));
  }

  renderInforgraphic() {
    const dataObject = {};
    for (const key in defaultStates) {
      const stateName = defaultStates[key].name;
      const visits = defaultStates[key].visits;
      dataObject[stateName] = visits;
    }
  }

  render() {
    return <div />;
  }
}
