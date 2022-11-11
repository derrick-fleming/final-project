import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import GoogleMaps from '../components/googleMaps';
import Pagination from 'react-bootstrap/Pagination';

const activities = new Set(['Astronomy', 'Biking', 'Hiking', 'Camping', 'Birdwatching', 'Museum Exhibits', 'Fishing', 'Scenic Driving', 'Kayaking', 'Boating', 'Guided Tours']);
const activitiesOrder = {
  Astronomy: 0,
  Biking: 1,
  Hiking: 2,
  Camping: 3,
  Birdwatching: 4,
  'Museum Exhibits': 5,
  Fishing: 6,
  'Scenic Driving': 7,
  Kayaking: 8,
  Boating: 9,
  'Guided Tours': 10
};

export default class SearchResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      isLoading: true,
      active: 1
    };
    this.fetchData = this.fetchData.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }

  handleClick(event) {
    window.location.hash = 'home';
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.search !== prevProps.search) {
      this.fetchData();
      return;
    }
    if (this.props.page !== prevProps.page) {
      this.fetchData();
    }
  }

  nextPage(event) {
    this.setState({
      active: event.target.id,
      isLoading: true
    });
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const search = this.props.search;
    const parkKey = process.env.PARKS_API;
    let action = 'q=';
    let start = 0;
    if (this.props.action === 'states') {
      action = 'stateCode=';
    }
    if (this.props.page !== null) {
      start = ((Number(this.state.active) * 50) - 50);
    }
    let link = `https://developer.nps.gov/api/v1/parks?${action}${search}&start=${start}&api_key=${parkKey}`;
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
              results: states,
              isLoading: false
            });
          });
      })
      .catch(err => console.error(err));
  }

  render() {
    if (this.state.isLoading === true) {
      return null;
    }
    const maxResults = this.state.results.total;
    let results = `${maxResults} search results found.`;
    if (this.state.results.length === 0) {
      results = 'Sorry, no results found.';
    }
    let pages;
    let pagination;
    let viewingResults;
    if (this.state.results.total > 50) {
      pages = Math.ceil(this.state.results.total / 50);
      const items = [];
      let range = (Number(this.state.active) * 50);
      if (range > maxResults) {
        range = maxResults;
      }
      viewingResults = `Results ${((Number(this.state.active) * 50) - 50)} - ${range}`;
      for (let number = 1; number <= pages; number++) {
        const newParams = new URLSearchParams();
        newParams.set('search', this.props.search);
        newParams.set('page', number);
        items.push(
          <Pagination.Item href={`#search-results?${newParams}`} key={number} id={number} active={number === Number(this.state.active)} onClick={this.nextPage}>
            {number}
          </Pagination.Item>
        );
      }
      pagination =
        <div>
          <Pagination>{items}</Pagination>
          <br />
        </div>;
    }

    return (
      <Container fluid='xl' className='p-4'>
        <Row className='justify-content-between'>
          <Col xs={10}>
            <h4 className='pt-2 pb-0 merriweather fw-light m-0'>
              {results}
            </h4>
            <h6 className='pt-0 open-sans gold fw-bold'>
              {viewingResults}
            </h6>
          </Col>
          <Col xs={2} className='pt-2 px-1 text-end'>
            <a className='go-back text-decoration-none open-sans' onClick={this.handleClick}>
              Go Back
            </a>
          </Col>
        </Row>
        <Row className='justify-content-center'>
          <Col md={11} className='mt-2 mb-4 m'>
            <GoogleMaps results={this.state.results.data}/>
          </Col>
        </Row>
        <Row>
          {
                this.state.results.data.map(park => {
                  const { name, wikiImage, designation, parkCode } = park;
                  const address = `${park.addresses[0].city}, ${park.addresses[0].stateCode}`;
                  let activityList = park.activities.filter(activity => activities.has(activity.name)).map(activity => activity.name).sort((a, b) => activitiesOrder[a] - activitiesOrder[b]);
                  if (activityList.length > 3) {
                    activityList.splice(4);
                  }
                  activityList = activityList.join(' | ');
                  return (
                    <Col key={parkCode} md={6} className='mt-2 mb-2'>
                      <Row className='d-flex justify-content-center'>
                        <Card id={parkCode} className='p-0 open-sans card-width mb-4 shadow-sm'>
                          <Card.Img variant="top" src={wikiImage} alt={name} className='image-size'/>
                          <Card.Body>
                            <Card.Text className='m-0 lh-lg'>
                              {designation}
                            </Card.Text>
                            <Card.Title className='m-0 merriweather fw-Semibold'>{name}</Card.Title>
                            <Card.Text className='m-0 fst-italic fw-light lh-lg'>
                              {activityList}
                            </Card.Text>
                            <Card.Text className='m-0 gold fw-bold pb-2'>
                              {address}
                            </Card.Text>
                            <a className='btn btn-success merriweather lh-lg my-2'>Learn More</a>
                          </Card.Body>
                        </Card>
                      </Row>
                    </Col>
                  );
                })
            }
        </Row>
        {pagination}
      </Container>
    );
  }
}
