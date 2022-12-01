import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import states from '../lib/states';
import Dropdown from 'react-bootstrap/Dropdown';

export default class UserReviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      imageUrl: null,
      isLoading: true,
      networkError: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.renderReviews = this.renderReviews.bind(this);
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

  renderReviews() {
    const reviews = this.state.result;
    const reviewCards = reviews.map(review => {
      const { recommendedActivities, recommendedVisitors, tips } = review;
      const datesVisited = review.datesVisited.split(',');
      const startDate = datesVisited[0].split('[')[1].split('-').splice(1, 2).join('/');
      let endDate = datesVisited[1].split(')')[0].split('-');
      endDate = `${endDate[1]}/${endDate[2]}/${endDate[0]}`;
      const activities = recommendedActivities.split(',');
      const visitors = recommendedVisitors.split(',');
      const parkName = review.details.name;
      const parkImage = review.details.imageUrl;
      const generalThoughts = review.generalThoughts === '' ? 'None Listed' : review.generalThoughts;
      let image;
      if (review.imageUrl === null) {
        image = 'No images provided';
      } else {
        image = (
          <Button variant="link" onClick={this.handleClick}>
            <Image thumbnail className='thumbnail shadow-sm' src={review.imageUrl} alt='User Image' />
          </Button>
        );
      }
      const stars = [1, 2, 3, 4, 5];
      const rating = stars.map((star, index) => {
        if ((index + 1) <= review.rating) {
          return <span key={index} className='fa-solid fa-star green ps-1' />;
        } else {
          return <span key={index} className='fa-regular fa-star ps-1' />;
        }
      });
      return (
        <Col key={parkName} className='my-2' xs={12} lg={6}>
          <Card className='open-sans shadow-sm'>
            <Card.Img variant="top" className='image-size' src={parkImage} alt={parkName} />
            <Card.Body className='border border-bottom-2'>
              <Row>
                <Col xs={9}>
                  <Card.Title className='merriweather fw-Semibold mb-1 fs-2'>{parkName}</Card.Title>
                </Col>
                <Col className='text-end'>
                  <Dropdown align='end' xs={3}>
                    <Dropdown.Toggle variant='no-link' id='edit-drop'>
                      <span className='fa-solid fa-ellipsis grayscale' />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href={`#edit-review?parkCode=${review.parkCode}`}>Edit Review</Dropdown.Item>
                      <Dropdown.Item>Delete Review </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>

              <Card.Text className='mb-1'>
                Rating: {rating}
              </Card.Text>
              <Card.Text>
                Dates Visited: {startDate} - {endDate}
              </Card.Text>
            </Card.Body>
            <Accordion className='shadow-sm'>
              <Accordion.Item eventKey="0" style={{
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
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
    return reviewCards;
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
          result,
          isLoading: false
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          networkError: true,
          isLoading: false
        });
      });
  }

  render() {
    const spinner = this.state.isLoading === true
      ? (<div className="lds-ring"><div /><div /><div /><div /></div>)
      : '';

    if (this.state.isLoading) {
      return spinner;
    }
    if (this.state.networkError) {
      return (
        <Container>
          <h3 className='lh-lg pt-4 mt-4 merriweather text-center'>Sorry, there was an error connecting to the network! Please check your internet connection and try again.</h3>
        </Container>
      );
    }
    if (this.state.result.length === 0) {
      return (
        <>
          <h3 className='m-5 merriweather text-center'>Sorry, 0 reviews found. </h3>
          <h5 className='merriweather text-center'>Return to your <a href='#accounts/user'>account page</a> or start writing reviews by <a href='#home?browse=states'>browsing states</a></h5>
        </>
      );
    }

    const state = states.find(state => state.code === this.props.state);
    const stateName = state.name;
    return (
      <>
        <div className='mb-4 position-relative hero-background text-center'>
          <img src='images/mountain-scene.webp' alt='Mountain view' className='hero-image' />
          <h2 className='merriweather fw-bold position-absolute top-50 start-50 translate-middle text-white'>
            Your Reviews:
            <br />
            {stateName}
          </h2>
        </div>
        <Container>
          <Row className='justify-content-center'>
            <Col xl={11} md={10} lg={12}>
              <Row>
                {this.renderReviews()}
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
        <Modal centered show={this.state.showDelete} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title className='merriweather gray-scale w-100 text-center ms-4'>Remove Review?</Modal.Title>
          </Modal.Header>
          <Modal.Body className='open-sans fs-5 fw-light pt-4 gray-scale text-center'>
            Are you sure you want to delete your review?
            <br />
            <span className='fst-italic'>Note: All saved data will be lost.</span>
          </Modal.Body>
          <Modal.Footer>
            <Col>
              <Button variant="secondary" onClick={this.handleClose} className='merriweather lh-lg px-4'>
                NO
              </Button>
            </Col>
            <Col className='text-end'>
              <a className='merriweather btn btn-success lh-lg px-4' onClick={this.handleDelete} > YES</a>
            </Col>
          </Modal.Footer>
        </Modal>
      </>
    )
    ;
  }
}
