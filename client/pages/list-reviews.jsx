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
import states from '../lib/states';

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
      const { recommendedActivities, recommendedVisitors, tips } = review;
      const datesVisited = review.datesVisited.split(',');
      const startDate = datesVisited[0].split('[')[1].split('-').splice(1, 2).join('/');
      let endDate = datesVisited[1].split(')')[0].split('-').splice(1, 2).join('/');
      const year = datesVisited[1].split(')')[0].split('-').splice(0, 1);
      endDate = `${endDate}/${year}`;
      const activities = recommendedActivities.split(',');
      const visitors = recommendedVisitors.split(',');
      const parkName = review.details.name;
      const parkImage = review.details.imageUrl;
      const generalThoughts = review.generalThoughts === '' ? 'None Listed' : review.generalThoughts;
      const image = review.imageUrl === null ? 'No images provided' : <Button variant="link" onClick={this.handleClick}><Image thumbnail className='thumbnail shadow-sm' src={review.imageUrl} alt='User Image'/></Button>;
      const stars = [1, 2, 3, 4, 5];
      const rating = stars.map((star, index) => {
        if (index <= review.rating) {
          return <span key={index} className='fa-solid fa-star green ps-1' />;
        } else {
          return <span key={index} className='fa-regular fa-star ps-1' />;
        }
      });
      return (
        <Col key={parkName} className='my-4' xs={12} lg={6}>
          <Card className='open-sans shadow-sm'>
            <Card.Img variant="top" className='image-size' src={parkImage} alt={parkName} />
            <Card.Body className='border border-bottom-2'>
              <Card.Title className='merriweather fw-Semibold mb-1 fs-2'>{parkName}</Card.Title>
              <Card.Text className='mb-1'>
                Rating: {rating}
              </Card.Text>
              <Card.Text>
                Dates Visited: {startDate} - {endDate}
              </Card.Text>
            </Card.Body>
            <Accordion className='shadow-sm'>
              <Accordion.Item eventKey="0" style={{
                'border-top-left-radius': 0,
                'border-top-right-radius': 0,
                '--bs-accordion-inner-border-radius': 0
              }}>
                <Accordion.Header className='merriweather'>
                  <span className='pe-2 fa-solid fa-book gray-scale' />Read Review
                </Accordion.Header>
                <Accordion.Body>
                  <Row id='activities'>
                    <Col xs={12}>
                      <h6 className='border-bottom border-dark mb-2 pb-1 merriweather fw-bold'>
                        <span className='pe-2 fa-solid fa-person-biking' />Recommended Activities
                      </h6>
                      <ul className='list-style ps-4'>
                        <Row>
                          {
                            activities.map(activity => {
                              return (
                                <Col key={activity} xs={6} >
                                  <li className='fw-light lh-lg'>{activity}</li>
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
                      <h6 className='border-bottom border-dark mb-2 pb-1 merriweather fw-bold'>
                        <span className='fa-solid fa-user-group pe-2' />Recommended Visitors
                      </h6>
                      <ul className='list-style ps-4'>
                        <Row>
                          {
                            visitors.map(visitor => {
                              return (
                                <Col key={visitor} xs={6} >
                                  <li className='fw-light lh-lg'>{visitor}</li>
                                </Col>
                              );
                            })
                          }
                        </Row>
                      </ul>
                    </Col>
                  </Row>
                  <Row id='tips'>
                    <Col>
                      <h6 className='border-bottom border-dark mb-2 pb-1 merriweather fw-bold'>
                        <span className='fa-solid fa-info-circle pe-2' /> Tips
                      </h6>
                      <p className='fw-light ps-4'>{tips}</p>
                    </Col>
                  </Row>
                  <Row id='generalThoughts'>
                    <Col>
                      <h6 className='border-bottom border-dark mb-2 pb-1 merriweather fw-bold'><span className='fa-solid fa-lightbulb pe-2' />General Thoughts</h6>
                      <p className='fw-light ps-4'>{generalThoughts}</p>
                    </Col>
                  </Row>
                  <Row id='photo'>
                    <Col xs={12}>
                      <h6 className='border-bottom border-dark mb-2 pb-1 merriweather fw-bold'><span className='fa-solid fa-camera-retro pe-2' />Photos</h6>
                    </Col>
                    <Col className='ps-4 fw-light'>
                      {image}
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Card>
        </Col>
      );

    });
    const state = states.find(state => state.code === this.props.state);
    const stateName = state.name;
    return (
      <>
        <div className='mb-4 position-relative hero-background text-center'>
          <img src='images/mountain-scene.png' alt='Mountain view' className='hero-image' />
          <h2 className='merriweather fw-bold position-absolute top-50 start-50 translate-middle text-white'>
            Your Reviews:
            <br />
            {stateName}
          </h2>
        </div>
        <Container>
          <Row className='justify-content-center'>
            <Col xl={10} md={11} lg={12}>
              <Row>
                {reviewCards}
              </Row>
            </Col>
          </Row>
        </Container>
        <Modal centered show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton className='light-box'>
            <Modal.Title />
          </Modal.Header>
          <Modal.Body className='light-box'>
            <Image fluid src={this.state.imageUrl} alt='Larger user image' />
          </Modal.Body>
          <Modal.Footer className='light-box' />
        </Modal>
      </>
    )
    ;
  }
}

UserReviews.contextType = AppContext;
