import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Accordion from 'react-bootstrap/Accordion';

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
    const { name, wikiImage, description } = park;
    const address =
      `${park.addresses[0].line1}
      ${park.addresses[0].city}, ${park.addresses[0].stateCode}`;
    const activityList = this.state.results.activities.filter(activity => activities.has(activity.name));
    return (
      <Container>
        <Row>
          <h3>{name}</h3>
          <a onClick={this.goBack}>Go Back</a>
        </Row>
        <Row>
          <img src={wikiImage} alt={name} />
        </Row>
        <Row>
          <p>{description}</p>
        </Row>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <span className='fa-solid fa-person-biking' /> Popular Activities
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
              <span className='fa-solid fa-map-location-dot' /> Address & Directions
            </Accordion.Header>
            <Accordion.Body>
              {address}
              <br />
              <br />
              {park.directionsInfo}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
    );
  }
}
