import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

export default class ReviewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      isLoading: true
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const search = this.props.park;
    const parkKey = process.env.PARKS_API;
    const action = 'parkCode=';
    let link = `https://developer.nps.gov/api/v1/parks?${action}${search}&api_key=${parkKey}`;
    link = 'get-parks-results.json';
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
      return <div />;
    }
    const { name } = this.state.results;
    return (
      <Container>
        <h2>{name}</h2>
        <Form>
          <Form.Group className='d-flex'>
            <Col xs={2} md={1}>
              <Form.Label htmlFor='rating-5' className='pb-0 m-0'>
                Rating:
              </Form.Label>
            </Col>
            <Col xs={3}>
              <div className='star-radio d-flex flex-row-reverse justify-content-end'>
                <input required id='rating-5' className='px-1' type='radio' name='rating' value='5' />
                <label htmlFor="rating-5" className='pt-1 fa-solid fa-star'/>
                <input className='px-1' id='rating-4' type='radio' name='rating' value='4' />
                <label htmlFor="rating-4" className='pt-1 fa-solid fa-star d-inline'/>
                <input className='px-1' id='rating-3' type='radio' name='rating' value='3' />
                <label htmlFor="rating-3" className='pt-1 fa-solid fa-star'/>
                <input className='px-1' id='rating-2' type='radio' name='rating' value='2' />
                <label htmlFor="rating-2" className='pt-1 fa-solid fa-star'/>
                <input className='px-1' id='rating-1' type='radio' name='rating' value='1' />
                <label htmlFor="rating-1" className='pt-1 fa-solid fa-star'/>
              </div>
            </Col>
          </Form.Group>
          <Row />
        </Form>
      </Container>
    );
  }
}
