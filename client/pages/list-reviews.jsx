import React from 'react';
import AppContext from '../lib/app-context';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default class UserReviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null
    };
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
    if (!this.state.result) {
      return;
    }
    return (
      <Container>
        <Row>
          <Col>
            <div />
          </Col>
        </Row>
      </Container>
    )
    ;
  }
}

UserReviews.contextType = AppContext;
