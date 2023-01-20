import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import GoogleMaps from '../components/google-maps';
import Pagination from 'react-bootstrap/Pagination';
import states from '../lib/states';

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
      active: 1,
      networkError: false
    };
    this.fetchData = this.fetchData.bind(this);
    this.nextPage = this.nextPage.bind(this);
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

  async fetchData() {

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
    const link = `https://developer.nps.gov/api/v1/parks?${action}${search}&start=${start}&api_key=${parkKey}`;
    try {
      const response = await fetch(link);
      const states = await response.json();
      const apiEndPoint = 'https://en.wikipedia.org/w/api.php';
      const imageFetches = await Promise.all(states.data.map(state => {
        const title = state.fullName.replaceAll(' ', '%20');
        const params = `action=query&format=json&prop=pageimages&titles=${title}&redirects=1&formatversion=2&piprop=thumbnail&pithumbsize=500&pilimit=3`;
        const url = apiEndPoint + '?' + params + '&origin=*';
        return (fetchWikiImage(url, state));
      }));
      this.setState({
        results: states,
        isLoading: false,
        imageFetches
      });
    } catch (err) {
      console.error(err);
      this.setState({
        networkError: true,
        isLoading: false
      });
    }
  }

  render() {
    const spinner = this.state.isLoading === true
      ? (<div className="lds-ring"><div /><div /><div /><div /></div>)
      : '';

    if (this.state.isLoading === true) {
      return spinner;
    }

    if (this.state.networkError) {
      return (
        <Container>
          <h3 className='lh-lg pt-4 mt-4 merriweather text-center'>Sorry, there was an error connecting to the network! Please check your internet connection and try again.</h3>
        </Container>
      );
    }

    const maxResults = this.state.results.total;
    let results = `${maxResults} search results found.`;
    if (maxResults === '0') {
      results = 'Sorry, no results found. Try searching again.';
    }
    if (this.props.action === 'states') {
      const state = states.find(state => state.code === this.props.search);
      results = `${maxResults} search results found in or related to ${state.name}.`;
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
        <Row >
          <Col xs={10}>
            <h4 className='pt-2 merriweather fw-light m-0'>
              {results}
            </h4>
            <h6 className='open-sans gold fw-bold'>
              {viewingResults}
            </h6>
          </Col>
        </Row>
        <Row className='justify-content-center'>
          <Col md={11} className='mt-2 mb-4 m'>
            <GoogleMaps results={this.state.results.data}/>
          </Col>
        </Row>
        <Row className='justify-content-center'>
          <Col xl={11} sm={9} md={11}>
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
                      <Col key={parkCode} xs={12} md={6} className='mt-2 mb-2'>
                        <Card id={parkCode} className='open-sans mb-4 shadow-sm'>
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
                            <a href={`#details?park=${parkCode}`} className='btn btn-success merriweather lh-lg my-2'>Learn More</a>
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  })
              }
            </Row>
          </Col>
        </Row>
        {pagination}
      </Container>
    );
  }
}

async function fetchWikiImage(url, state) {
  try {
    const response = await fetch(url);
    const image = await response.json();
    if (image.query.pages[0].thumbnail === undefined) {
      state.wikiImage = '/images/mountains.webp';
    } else {
      state.wikiImage = image.query.pages[0].thumbnail.source;
    }
  } catch (err) {
    console.error(err);
  }
}
