import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import activities from '../lib/activities';
import Button from 'react-bootstrap/Button';

const visitors = ['Everyone', 'History Buffs', 'Families', 'Casual Travelers', 'Teens & Adults', 'Outdoor Enthusiast', 'Nature Lovers'];

export default class ReviewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validated: false,
      results: [],
      isLoading: true,
      rating: '',
      activities: [],
      visitors: [],
      tips: '',
      generalThoughts: '',
      startDate: '',
      endDate: ''
    };
    this.fileInputRef = React.createRef();
    this.fetchData = this.fetchData.bind(this);
    this.handleRating = this.handleRating.bind(this);
    this.handleCheckBox = this.handleCheckBox.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  handleClose() {
    window.location.hash = `#details?park=${this.props.park}`;
  }

  handleRating(event) {
    this.setState({
      rating: event.target.value
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleCheckBox(event) {
    const target = event.target;
    const name = event.target.name;
    const array = this.state[name];
    if (target.checked === true) {

      this.setState({
        name: array.push(event.target.id)
      });
    } else if (target.checked === false) {
      const index = array.indexOf(event.target.id);
      this.setState({
        name: array.splice(index, 1)
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      this.setState({
        validated: true
      });
      return;
    }

    const parkDetails = {
      name: this.state.results.name,
      imageUrl: this.state.results.wikiImage
    };
    const dates = [this.state.startDate, this.state.endDate];
    let imageUrl = null;
    if (this.fileInputRef.current.files[0]) {
      imageUrl = this.fileInputRef.current.files[0];
    }
    const formData = new FormData();
    formData.append('accountId', 1);
    formData.append('image', imageUrl);
    formData.append('parkCode', this.props.park);
    formData.append('recommendedActivities', this.state.activities);
    formData.append('recommendedVisitors', this.state.visitors);
    formData.append('tips', this.state.tips);
    formData.append('generalThoughts', this.state.generalThoughts);
    formData.append('rating', this.state.rating);
    formData.append('datesVisited', dates);
    formData.append('stateCode', this.state.results.addresses[0].stateCode);
    formData.append('parkDetails', JSON.stringify(parkDetails));
    fetch('/api/reviews', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(result => {
        this.setState({
          results: [],
          rating: '',
          activities: [],
          visitors: [],
          tips: '',
          generalThoughts: '',
          startDate: '',
          endDate: ''
        });
        this.fileInputRef.current.value = null;
        window.location.hash = `#details?park=${this.props.park}`;
      })
      .catch(err => console.error(err));
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
        <h2 className='mt-4 merriweather fw-bold'>{name}</h2>
        <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit} className='open-sans gray-scale'>
          <Form.Group className='d-flex'>
            <Col xs={2} md={1}>
              <Form.Label htmlFor='rating-5' className='fs-6 pb-4 m-0'>
                Rating:
              </Form.Label>
            </Col>
            <Col xs={3}>
              <div className='star-radio d-flex flex-row-reverse justify-content-end'>
                <input required id='rating-5' className='px-1' type='radio' name='rating' value='5' onClick={this.handleRating} />
                <label htmlFor="rating-5" className='pt-1 fa-solid fa-star'/>
                <input className='px-1' id='rating-4' type='radio' name='rating' value='4' onClick={this.handleRating}/>
                <label htmlFor="rating-4" className='pt-1 fa-solid fa-star d-inline'/>
                <input className='px-1' id='rating-3' type='radio' name='rating' value='3' onClick={this.handleRating}/>
                <label htmlFor="rating-3" className='pt-1 fa-solid fa-star'/>
                <input className='px-1' id='rating-2' type='radio' name='rating' value='2' onClick={this.handleRating}/>
                <label htmlFor="rating-2" className='pt-1 fa-solid fa-star'/>
                <input className='px-1' id='rating-1' type='radio' name='rating' value='1' onClick={this.handleRating}/>
                <label htmlFor="rating-1" className='pt-1 fa-solid fa-star'/>
                <Form.Control.Feedback type="invalid">Missing rating.</Form.Control.Feedback>
              </div>
            </Col>
          </Form.Group>
          <Row>
            <Col sm={12} lg={6}>
              <Form.Group className='mb-3'>
                <h5 className='mb-0 pb-1'><span className='fa-regular fa-calendar-days pe-2' />Dates Visited*</h5>
                <hr className='mt-0'/>
                <div>
                  <Form.Label htmlFor='start-dates' className='pe-2 fw-light'> Start Date: </Form.Label>
                  <input className='border border-1' required id='start-dates' type='date' name='startDate' onChange={this.handleInputChange}/>
                  <Form.Control.Feedback type="invalid">Missing end date.</Form.Control.Feedback>
                </div>
                <div>
                  <Form.Label htmlFor='end-dates' className='pe-3 fw-light'> End Date: </Form.Label>
                  <input className='border border-1' required id='end-dates' type='date' name='endDate' onChange={this.handleInputChange}/>
                  <Form.Control.Feedback type="invalid">Missing end date.</Form.Control.Feedback>
                </div>
              </Form.Group>
              <Form.Group className='mb-3'>
                <h5 className='mb-0 pb-1'><span className="fa-solid fa-person-biking pe-2" />Recommended Activities*</h5>
                <hr className='mt-0'/>
                <Row>
                  {
                activities.map(activity => {
                  return (
                    <Col xs={6} key={activity.name}>
                      <input type='checkbox' id={activity.name} name='activities' value={activity.name} onChange={this.handleCheckBox}/>
                      <label htmlFor={activity.name} className='fw-light ps-2 lh-lg'>{activity.name}</label>
                    </Col>
                  );
                })
              }
                </Row>
              </Form.Group>
              <Form.Group className='mb-3'>
                <h5 className='mb-0 pb-1'><span className="fa-solid fa-user-group pe-2" />Recommended Visitors*</h5>
                <hr className='mt-0'/>
                <Row>
                  {
                visitors.map(visitor => {
                  return (
                    <Col xs={6} key={visitor}>
                      <input type='checkbox' id={visitor} name='visitors' value={visitor} onChange={this.handleCheckBox} />
                      <label htmlFor={visitor} className='fw-light ps-2 lh-lg'>{visitor}</label>
                    </Col>
                  );
                })
              }
                </Row>
              </Form.Group>
            </Col>
            <Col sm={12} lg={6}>
              <Form.Group className='mb-3'>
                <Form.Label htmlFor='tips' className='mb-0 pb-1 fs-5'>
                  <span className='fa-solid fa-info-circle pe-2' />Tips*
                </Form.Label>
                <hr className='my-0' />
                <Form.Text className='fs-6 fst-italic fw-light'>
                  Provide future visitors with tips for a great experience at {this.state.results.name}.
                </Form.Text>
                <Form.Control placeholder='Provide tips here' className='text-box mt-3' required id='tips' name='tips' as='textarea' value={this.state.tips} onChange={this.handleInputChange} />
                <Form.Control.Feedback type="invalid">Write at least one tip</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Label htmlFor='generalThoughts' className='mb-0 pb-1 fs-5'>
                  <span className='fa-solid fa-lightbulb pe-2' />General Thoughts
                </Form.Label>
                <hr className='my-0' />
                <Form.Text className='fs-6 fst-italic fw-light'>
                  Explain your rating or mention other activites someone should know about this park.
                </Form.Text>
                <Form.Control id='generalThoughts' name='generalThoughts' as='textarea' className='text-box mt-3' value={this.state.generalThoughts} onChange={this.handleInputChange} placeholder='Write your thoughts here' />
                <Form.Control.Feedback type="valid">General Thoughts are optional</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} lg={6}>
              <Form.Group className='mb-3'>
                <Form.Label htmlFor='imageUrl' className='mb-0 pb-1 fs-5'>
                  <span className='fa-solid fa-camera-retro pe-2' />Photos
                </Form.Label>
                <hr className='my-0' />
                <Form.Text className='fs-6 fst-italic fw-light'>
                  Upload your favorite photos from this park.
                </Form.Text>
                <Form.Control id='imageUrl' className='mt-3' name='imageUrl' type='file' accept='.png, .jpg, .jpeg, .gif' ref={this.fileInputRef} />
                <Form.Control.Feedback type="valid">Photo is optional</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className='my-2'>
            <Col>
              <Button className='merriweather lh-lg px-4' variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
            </Col>
            <Col className='text-end'>
              <Button className='merriweather lh-lg px-4' variant="success" type='submit'>
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    );
  }
}
