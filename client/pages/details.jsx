import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Accordion from 'react-bootstrap/Accordion';
import Col from 'react-bootstrap/Col';
import SinglePointMap from '../components/oneLocationMap';
import activities from '../lib/details';
import AppContext from '../lib/app-context';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default class ParkDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      isLoading: true
    };
    this.goBack = this.goBack.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.showRating = this.showRating.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  goBack() {
    window.history.back();
  }

  showRating() {
    const park = this.props.search;
    fetch(`/api/parksCache/${park}`)
      .then(response => response.json())
      .then(result => {
        this.setState({
          parkRating: result
        });
      });
  }

  handleShow(event) {
    if (!this.context.user) {
      this.setState({
        show: true
      });
    } else {
      window.location.hash = `#reviews?parkCode=${this.state.results.parkCode}`;
    }
  }

  handleClose(event) {
    this.setState({
      show: false
    });
  }

  componentDidMount() {
    this.fetchData();
    this.showRating();
  }

  fetchData() {
    const search = this.props.search;
    const parkKey = process.env.PARKS_API;
    const action = 'parkCode=';
    const link = `https://developer.nps.gov/api/v1/parks?${action}${search}&api_key=${parkKey}`;
    fetch(link)
      .then(response => response.json())
      .then(states => {
        const apiEndPoint = 'https://en.wikipedia.org/w/api.php';
        const imageFetches = states.data.map(state => {
          const title = state.fullName.replaceAll(' ', '%20');
          const params = `action=query&format=json&prop=pageimages&titles=${title}&redirects=1&formatversion=2&piprop=thumbnail&pithumbsize=500&pilimit=3`;
          return (
            fetch(apiEndPoint + '?' + params + '&origin=*')
              .then(response => response.json())
              .then(image => {
                if (image.query.pages[0].thumbnail === undefined) {
                  state.wikiImage = '/images/mountains.png';
                } else {
                  state.wikiImage = image.query.pages[0].thumbnail.source;
                }
              })
              .catch(err => console.error(err))
          );
        });
        Promise
          .all(imageFetches)
          .then(results => {
            this.setState({
              results: states.data[0],
              isLoading: false
            });
          });
      })
      .catch(err => console.error(err));
  }

  render() {
    if (this.state.isLoading) {
      return;
    }
    const park = this.state.results;
    let rating;
    if (this.state.parkRating.rating === null) {
      rating = 'N/A';
    } else {
      let score = Number(this.state.parkRating.rating);
      score = Math.round(score);
      const stars = [1, 2, 3, 4, 5];
      rating = stars.map((star, index) => {
        if (index <= score - 1) {
          return <span key={index} className='fa-solid fa-star green' />;
        } else {
          return <span key={index} className='fa-regular fa-star' />;
        }
      });
    }

    const { name, wikiImage, description, weatherInfo } = park;
    const address1 = `${park.addresses[0].line1}`;
    const address2 = `${park.addresses[0].city}, ${park.addresses[0].stateCode} ${park.addresses[0].postalCode}`;

    const entranceFees = park.entranceFees.map((fee, index) => {
      return (
        <div key={index}>
          <hr />
          <p className='fw-bold m-0'>${fee.cost}</p>
          <p className='fst-italic'>{fee.title}</p>
          <p className='fw-light'>{fee.description}</p>
        </div>
      );
    });
    const activityList = this.state.results.activities.filter(activity => activities.has(activity.name));
    activityList.sort((a, b) => a.name.localeCompare(b.name));

    return (
      <>
        <div className='mb-4 position-relative hero-background text-center'>
          <img src='images/lake.png' alt='Mountain view with lake' className='hero-image' />
          <h2 className='merriweather fw-bold position-absolute top-50 start-50 translate-middle text-white'><span className='fa-solid fa-info-circle pe-2' />Park Info</h2>
        </div>
        <Container>
          <Row className='mb-2 large-screen-spacing justify-content-center'>
            <Col xs={9} xl={8}>
              <h2 className=' merriweather fw-bold'>{name}</h2>
            </Col>
            <Col xs={3} className='text-end'>
              <a className='open-sans go-back text-decoration-none fw-bold' onClick={this.goBack}>Go Back</a>
            </Col>
          </Row>
          <Row className='justify-content-center large-screen-spacing'>
            <Col xs={12} md={6} xl={5}>
              <img className='shadow-sm p-0 rounded image-details mt-1 mb-3' src={wikiImage} alt={name} />
            </Col>
            <Col xs={12} md={6}>
              <h3 className='px-0 px-1-sm merriweather fw-bold'> Description <span className='fs-6 ps-1 ps-sm-5 ps-md-2 ps-lg-5'>Rating: {rating}</span></h3>
              <p className='p-1 description-text fw-light fs-6'>{description}</p>
            </Col>
          </Row>
          <Row className='justify-content-center mb-4'>
            <Col xs={12} xl={11}>
              <Accordion className='open-sans large-screen-spacing shadow-sm'>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <h6 className='mb-0 merriweather'><span className='fa-solid fa-person-biking pe-2' /> Popular Activities </h6>
                  </Accordion.Header>
                  <Accordion.Body className='large-screen-spacing'>
                    <p className='fst-italic'>Here are some popular activities:</p>
                    <ul>
                      <Row>
                        {
                      activityList.map(activity => {
                        return (
                          <Col key={activity.name} xs={12} md={6} xl={4}>
                            <li className='fw-light'>{activity.name}</li>
                          </Col>
                        );
                      })
                    }
                      </Row>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    <h6 className='mb-0 merriweather'><span className='fa-solid fa-map-location-dot pe-2' /> Address & Directions </h6>
                  </Accordion.Header>
                  <Accordion.Body className="large-screen-spacing">
                    <p className='mb-0 fst-italic'>
                      {address1}
                    </p>
                    <p className='mb-3 fst-italic'>
                      {address2}
                    </p>
                    <SinglePointMap className='google-map' results={this.state.results} />
                    <p className="description-text fw-light pt-4">
                      {park.directionsInfo}
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>
                    <h6 className='mb-0 merriweather'><span className='fa-solid fa-hand-holding-dollar pe-2' /> Fees </h6>
                  </Accordion.Header>
                  <Accordion.Body className='large-screen-spacing'>
                    Entrance Fees:
                    {entranceFees}
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                  <Accordion.Header>
                    <h6 className='mb-0 merriweather'><span className='fa-solid fa-cloud-sun pe-2' /> Weather Information </h6>
                  </Accordion.Header>
                  <Accordion.Body className='fw-light description-text large-screen-spacing'>
                    {weatherInfo}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
          <Row className='justify-content-center mb-2'>
            <Col xl={11}>
              <Button onClick={this.handleShow} className='btn-success merriweather lh-lg my-2 large-screen-spacing'> <span className='fa-solid fa-pen-to-square pe-2' />Write a Review </Button>
            </Col>
          </Row>
        </Container>
        <Modal centered show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title className='merriweather gray-scale w-100 text-center ms-4'>Account Needed</Modal.Title>
          </Modal.Header>
          <Modal.Body className='open-sans fs-5 fw-light pt-4 gray-scale text-center'>Sign in or create an account to leave reviews on state parks and to keep track of the parks you&apos;ve visited.</Modal.Body>
          <Modal.Footer>
            <Col>
              <Button variant="secondary" onClick={this.handleClose} className='merriweather lh-lg px-4'>
                Close
              </Button>
            </Col>
            <Col className='text-end'>
              <a className='merriweather btn btn-success lh-lg px-4' href='#sign-in' > Sign In</a>
            </Col>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

ParkDetails.contextType = AppContext;
