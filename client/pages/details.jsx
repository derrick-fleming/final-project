import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Accordion from 'react-bootstrap/Accordion';
import Col from 'react-bootstrap/Col';

const activities = new Set(
  ['Astronomy',
    'Biking',
    'Hiking',
    'Camping',
    'Birdwatching',
    'Museum Exhibits',
    'Fishing',
    'Scenic Driving',
    'Kayaking',
    'Boating',
    'Guided Tours',
    'Arts and Culture',
    'Sailing',
    'RV Camping',
    'Climbing',
    'Dining',
    'Hunting',
    'Skiing',
    'Water Skiing',
    'Snowmobiling',
    'Shopping',
    'Wildlife Watching',
    'Junior Ranger Program',
    'Car or Front Country Camping',
    'Auto and ATV',
    'Horseback Riding']);

export default class ParkDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      isLoading: true
    };
    this.goBack = this.goBack.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  goBack() {
    window.history.back();
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {

    const search = this.props.search;
    const parkKey = process.env.PARKS_API;
    const action = 'parkCode=';
    let link = `https://developer.nps.gov/api/v1/parks?${action}${search}&api_key=${parkKey}`;
    link = '/get-parks-results.json';
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
    const { name, wikiImage, description, weatherInfo } = park;
    const address =
      `${park.addresses[0].line1}
      ${park.addresses[0].city}, ${park.addresses[0].stateCode}`;
    // const latitude = park.latitude;
    // const longitude = park.longitude;
    // const apiKey = process.env.GOOGLE_API;
    // const mapLink = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&markers=|${latitude},${longitude}&zoom=12&size=400x400&key=${apiKey}`;
    const entranceFees = park.entranceFees.map((fee, index) => {
      return (
        <div key={index}>
          <p>${fee.cost}</p>
          <p>{fee.title}</p>
          <p>{fee.description}</p>
        </div>
      );
    });
    const activityList = this.state.results.activities.filter(activity => activities.has(activity.name));
    return (
      <Container p-2>
        <Row>
          <Col xs={9}>
            <h2 className='px-2 merriweather fs-bold'>{name}</h2>
          </Col>
          <Col xs={3}>
            <a className='open-sans go-back text-decoration-none fs-bolder' onClick={this.goBack}>Go Back</a>
          </Col>
        </Row>
        <Row className='justify-content-center'>
          <Col xs={11}>
            <img className='shadow-sm p-0 rounded image-details mb-3' src={wikiImage} alt={name} />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <h3 className='px-2 merriweather fs-bold'> Description </h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <p className='p-2 description-text fw-light'>{description}</p>
          </Col>
        </Row>
        <Col>
          <Accordion className='open-sans mb-2' defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <span className='fa-solid fa-person-biking pe-2' /> Popular Activities
              </Accordion.Header>
              <Accordion.Body>
                <ol>
                  {
                    activityList.map(activity => <li key={activity.name}>{activity.name}</li>)
                  }
                </ol>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <span className='fa-solid fa-map-location-dot pe-2' /> Address & Directions
              </Accordion.Header>
              <Accordion.Body>
                {address}
                <br />
                <img className='static-map' src='images/beach.png' />
                <br />
                {park.directionsInfo}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>
                <span className='fa-solid fa-hand-holding-dollar pe-2' /> Fees
              </Accordion.Header>
              <Accordion.Body>
                Entrance Fees:
                {entranceFees}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>
                <span className='fa-solid fa-cloud-sun pe-2' /> Weather Information
              </Accordion.Header>
              <Accordion.Body>
                {weatherInfo}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Container>
    );
  }
}
