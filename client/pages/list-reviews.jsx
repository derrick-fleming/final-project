import React from 'react';
import AppContext from '../lib/app-context';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
// import Accordion from 'react-bootstrap/Accordion';

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
    const reviews = this.state.result;
    if (!this.state.result) {
      return;
    }
    const reviewCards = reviews.map(review => {
      const { rating } = review;
      const parkName = review.details.name;
      const parkImage = review.details.imageUrl;
      return (
        <Card key={parkName}>
          <Card.Img variant="top" src={parkImage} alt={parkName} />
          <Card.Body>
            <Card.Title>{parkName}</Card.Title>
            <Card.Text>
              {rating}
            </Card.Text>
          </Card.Body>
        </Card>
      );

    });
    return (
      <Container>
        <Row>
          <Col>
            {reviewCards}
          </Col>
        </Row>
      </Container>
    )
    ;
  }
}

UserReviews.contextType = AppContext;
