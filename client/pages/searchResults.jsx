import React from 'react';
import SearchBar from '../components/searchBar';
import NavigationBar from '../components/navigationBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';

export default class SearchResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      isLoading: true
    };
  }

  componentDidMount() {
    const search = this.props.search;
    const parkKey = '';
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
                if (image.query.pages[0].thumbnail !== undefined) {
                  state.wikiImage = image.query.pages[0].thumbnail.source;
                } else {
                  state.wikiImage = 'https://thumbs.dreamstime.com/b/illustration-glacier-national-park-mountains-lake-trees-85111728.jpg';
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
    const results = this.state.results.length;
    const activities = ['Astronomy', 'Biking', 'Hiking', 'Camping', 'Guided Tours', 'Museum Exhibits', 'Fishing', 'Scenic Driving'];
    this.state.results.map(park => {
      const activityList = [];
      park.activities.filter(activity => {
        if (activities.includes(activity.name)) {
          activityList.push(activity.name);
        }
        return activity;
      });
      park.activityList = activityList.join(' | ');
      return park;
    });
    return (
      <>
        <NavigationBar />
        <SearchBar />
        <Container fluid className='m-2'>
          <Row>
            <h3 className='merriweather'>
              {results} search results found.
            </h3>
          </Row>
          <Row>
            {
                this.state.results.map(state => {
                  const { name, wikiImage, activityList } = state;
                  return (
                    <Col key={name} md={6} className='mt-2 mb-2'>
                      <Card key={name} style={{ width: '18rem' }}>
                        <Card.Img variant="top" src={wikiImage} alt={name} />
                        <Card.Body>
                          <Card.Title>{name}</Card.Title>
                          <Card.Text>
                            {activityList}
                          </Card.Text>
                          <Button variant="primary">Learn More</Button>
                        </Card.Body>
                      </Card>
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
