import React from 'react';
import AppContext from '../lib/app-context';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default class UserReviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      imageUrl: null
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClick(event) {
    this.setState({
      imageUrl: event.target.src,
      show: true
    });
  }

  handleShow(event) {
    this.setState({
      show: true
    });
  }

  handleClose(event) {
    this.setState({
      show: false
    });
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
      const { rating, recommendedActivities, recommendedVisitors, tips } = review;
      const activities = recommendedActivities.split(',');
      const visitors = recommendedVisitors.split(',');
      const parkName = review.details.name;
      const parkImage = review.details.imageUrl;
      const generalThoughts = review.generalThoughts === '' ? 'None Listed' : review.generalThoughts;
      const imageUrl = review.imageUrl === null ? 'No images provided' : <Button onClick={this.handleClick}><Image fluid src={review.imageUrl} alt='User Image'/></Button>;
      return (
        <Card key={parkName}>
          <Card.Img variant="top" src={parkImage} alt={parkName} />
          <Card.Body>
            <Card.Title>{parkName}</Card.Title>
            <Card.Text>
              {rating}
            </Card.Text>
          </Card.Body>
          <Card.Body>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <span className='fa-solid fa-book' />Read Review
                </Accordion.Header>
                <Accordion.Body>
                  <Row id='activities'>
                    <Col xs={12}>
                      <h6>
                        <span className='fa-solid fa-person-biking' />Recommended Activities
                      </h6>
                    </Col>
                    <Col>
                      <ul>
                        <Row>
                          {
                            activities.map(activity => {
                              return (
                                <Col key={activity} xs={6} >
                                  <li className='fw-light'>{activity}</li>
                                </Col>
                              );
                            })
                          }
                        </Row>
                      </ul>
                    </Col>
                  </Row>
                  <Row id='visitors'>
                    <Col xs={12}>
                      <h6>
                        <span className='fa-solid fa-user-group' />Recommended Visitors
                      </h6>
                    </Col>
                    <Col>
                      <ul>
                        <Row>
                          {
                            visitors.map(visitor => {
                              return (
                                <Col key={visitor} xs={6} >
                                  <li className='fw-light'>{visitor}</li>
                                </Col>
                              );
                            })
                          }
                        </Row>
                      </ul>
                    </Col>
                  </Row>
                  <Row id='tips'>
                    <h6>
                      <span className='fa-solid fa-info-circle pe-2' /> Tips
                    </h6>
                    <p className='fw-light'>{tips}</p>
                  </Row>
                  <Row id='generalThoughts'>
                    <h6><span className='fa-solid fa-lightbulb pe-2' />General Thoughts</h6>
                    <p className='fw-light'>{generalThoughts}</p>
                  </Row>
                  <Row id='photo'>
                    <Col xs={12}>
                      <h6><span className='fa-solid fa-camera-retro pe-2' />Photos</h6>
                    </Col>
                    <Col className='fw-light'>
                      {imageUrl}
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Card.Body>
        </Card>
      );

    });
    return (
      <>
        <Container>
          <Row>
            <Col>
              {reviewCards}
            </Col>
          </Row>
        </Container>
        <Modal centered show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              Image
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Image fluid src={this.state.imageUrl} alt='Larger user image' />
          </Modal.Body>
        </Modal>
      </>
    )
    ;
  }
}

UserReviews.contextType = AppContext;
