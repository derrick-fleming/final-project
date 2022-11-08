import React from 'react';
import SearchBar from '../components/searchBar';
import NavigationBar from '../components/navigationBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
export default class SearchResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: []
    };
  }

  componentDidMount() {
    const search = this.props.search;
    const parkKey = 'p5Y4lLDLTYGsRUqXW3uQj242loZZ1WX6v1qBuW7U';
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
              states: states.data
            });
          });
      })
      .catch(err => console.error(err));

  }

  render() {
    const results = this.state.results.length;
    if (results === 0) {
      return null;
    }
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
            <h1> Component</h1>
          </Row>
        </Container>
      </>
    );
  }
}
