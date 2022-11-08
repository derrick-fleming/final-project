import React from 'react';
import SearchBar from '../components/searchBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';

export default class SearchResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      isLoading: true,
      search: this.props.search
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidUpdate() {
    if (this.state.search !== this.props.search) {
      this.fetchData();
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const search = this.props.search;
    const parkKey = process.env.PARKS_API;
    fetch(`https://developer.nps.gov/api/v1/parks?q=${search}&api_key=${parkKey}`)
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
              results: states.data,
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
    let results = `${this.state.results.length} search results found.`;
    if (this.state.results.length === 0) {
      results = 'Sorry, no results found.';
    }
    const activities = ['Astronomy', 'Biking', 'Hiking', 'Camping', 'Birdwatching', 'Museum Exhibits', 'Fishing', 'Scenic Driving', 'Kayaking', 'Boating', 'Guided Tours'];
    this.state.results.map(park => {
      const activityList = [];
      const parkList = [];
      park.activities.map(activity => {
        parkList.push(activity.name);
        return parkList;
      });
      for (let i = 0; i < activities.length; i++) {
        if (activityList.length > 2) {
          break;
        }
        if (parkList.includes(activities[i])) {
          activityList.push(activities[i]);
        }
      }
      park.activityList = activityList.join(' | ');
      return park;
    });
    return (
      <>
        <SearchBar />
        <Container fluid='xl' className='p-4'>
          <Row className='pb-4'>
            <h3 className='merriweather'>
              {results}
            </h3>
          </Row>
          <Row>
            {
                this.state.results.map(park => {
                  const { name, wikiImage, activityList, designation } = park;
                  const address = `${park.addresses[0].city}, ${park.addresses[0].stateCode}`;
                  return (
                    <Col key={name} md={6} className='mt-2 mb-2'>
                      <Row className='d-flex justify-content-center'>
                        <Card key={name} className='p-0 open-sans card-width mb-4 shadow-sm'>
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
                          </Card.Body>
                        </Card>
                      </Row>
                    </Col>
                  );
                })
            }
          </Row>
        </Container>
      </>
    );
  }
}
