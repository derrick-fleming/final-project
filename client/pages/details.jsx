import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

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
              results: states,
              isLoading: false
            });
          });
      })
      .catch(err => console.error(err));
  }

  render() {
    if (this.state.isLoading || !this.state.isLoading) {
      return;
    }
    const { name, wikiImage, description } = this.props.info;
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
      </Container>
    );
  }
}
