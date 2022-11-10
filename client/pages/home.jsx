import React from 'react';
import SearchBar from '../components/searchBar';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

// const activities = ['Astronomy', 'Biking', 'Hiking', 'Camping', 'Birdwatching', 'Museum Exhibits', 'Fishing', 'Scenic Driving', 'Kayaking', 'Boating', 'Guided Tours'];
const states = [
  { name: 'Alabama', code: 'AL' },
  { name: 'Alaska', code: 'AK' },
  { name: 'Arizona', code: 'AZ' },
  { name: 'Arkansas', code: 'AR' },
  { name: 'America Samoa', code: 'AS' },
  { name: 'California', code: 'CA' },
  { name: 'Colorado', code: 'CO' },
  { name: 'Connecticut', code: 'CT' },
  { name: 'Deleware', code: 'DE' },
  { name: 'District of Columbia', code: 'DC' },
  { name: 'Florida', code: 'FL' },
  { name: 'Guam', code: 'GU' },
  { name: 'Georgia', code: 'GA' },
  { name: 'Hawaii', code: 'HI' },
  { name: 'Idaho', code: 'ID' },
  { name: 'Illinois', code: 'IL' },
  { name: 'Indiana', code: 'IN' },
  { name: 'Iowa', code: 'IA' },
  { name: 'Kansas', code: 'KS' },
  { name: 'Kentucky', code: 'KY' },
  { name: 'Louisiana', code: 'LA' },
  { name: 'Maine', code: 'ME' },
  { name: 'Maryland', code: 'MD' },
  { name: 'Michigan', code: 'MI' },
  { name: 'Minnesota', code: 'MN' },
  { name: 'Massachusetts', code: 'MS' },
  { name: 'Montana', code: 'MT' },
  { name: 'Nebraska', code: 'NE' },
  { name: 'Nevada', code: 'NV' },
  { name: 'New Hampshire', code: 'NH' },
  { name: 'New Jersey', code: 'NJ' },
  { name: 'New Mexico', code: 'NM' },
  { name: 'New York', code: 'NY' },
  { name: 'North Carolina', code: 'NC' },
  { name: 'North Dakota', code: 'ND' },
  { name: 'Ohio', code: 'OH' },
  { name: 'Oklahoma', code: 'OK' },
  { name: 'Oregon', code: 'OR' },
  { name: 'Pennsylvania', code: 'PA' },
  { name: 'Puerto Rico', code: 'PR' },
  { name: 'Rhode Island', code: 'RI' },
  { name: 'South Carolina', code: 'SC' },
  { name: 'South Dakota', code: 'SD' },
  { name: 'Tennessee', code: 'TN' },
  { name: 'Texas', code: 'TX' },
  { name: 'Utah', code: 'UT' },
  { name: 'Vermont', code: 'VT' },
  { name: 'Virginia', code: 'VA' },
  { name: 'Virgin Islands', code: 'VI' },
  { name: 'Washington', code: 'WA' },
  { name: 'West Virginia', code: 'WV' },
  { name: 'Wisconsin', code: 'WI' },
  { name: 'Wyoming', code: 'WY' }
];

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      selection: '',
      value: ''
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClose(event) {
    this.setState({
      show: false,
      selection: ''
    });
  }

  handleShow(event) {
    if (event.target.id === 'states') {
      this.setState({
        show: true,
        selection: 'states'
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const userInputValue = this.state.value;
    if (this.state.selection === 'states') {
      window.location.hash = 'state-results?search=' + userInputValue;
    }
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    states.forEach(state => {
    });
    return (
      <>
        <SearchBar />
        <Container>
          <Row className='justify-content-center open-sans'>
            <Col md={6}>
              <Card className='mb-4 shadow-sm home-card'>
                <Card.Img variant="top" alt="Trees illustration" src="/images/placeholder-trees.png" className='image-size' />
                <Card.Body className='m-2'>
                  <Card.Title className='merriweather fw-bold fs-4'>States & Territories</Card.Title>
                  <Card.Text className='fs-6 pb-2'>
                    Browse through a list of states and territories to discover national parks found within each state.
                  </Card.Text>
                  <Button variant="success" className='merriweather lh-lg' onClick={this.handleShow} id='states'>Select a Location</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className='mb-4 shadow-sm home-card'>
                <Card.Img variant="top" alt="Mountain illustration" src="/images/placeholder-yosemite.png" className='image-size' />
                <Card.Body className='m-2'>
                  <Card.Title className='merriweather fw-bold fs-4'>Activities</Card.Title>
                  <Card.Text className='fs-6 pb-2'>
                    Browse through a list of activities to explore a park that matches your interests.
                  </Card.Text>
                  <Button variant="success" className='merriweather lh-lg px-4' onClick={this.handleShow}>Browse</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

        <Modal centered show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title className='merriweather gray-scale'>Select a State</Modal.Title>
          </Modal.Header>
          <Modal.Body className='openSans fs-6 pt-4 gray-scale'>Find a park located near or in a state.
            <Form className='pt-2' onSubmit={this.handleSubmit}>
              <Form.Select arialabel="Default select example" onChange={this.handleChange} value={this.state.value}>
                <option>Choose a state</option>
                {
                states.map(state => <option key={state.code} value={state.code}>{state.name}</option>)
                }
              </Form.Select>
              <Modal.Footer>
                <Button className='merriweather' variant="secondary" onClick={this.handleClose}>
                  Close
                </Button>
                <Button className='merriweather' variant="success" type="submit">
                  Browse
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>

        </Modal>
      </>
    );
  }

}
