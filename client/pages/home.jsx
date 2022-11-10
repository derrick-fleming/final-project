import React from 'react';
import SearchBar from '../components/searchBar';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';

/* const activities = ['Astronomy', 'Biking', 'Hiking', 'Camping', 'Birdwatching', 'Museum Exhibits', 'Fishing', 'Scenic Driving', 'Kayaking', 'Boating', 'Guided Tours'];
const states = [
  { state: 'Alabama', code: 'AL' },
  { state: 'Alaska', code: 'AK' },
  { state: 'Arizona', code: 'AZ' },
  { state: 'Arkansas', code: 'AK' },
  { state: 'America Samoa', code: 'AS' },
  { state: 'California', code: 'CA' },
  { state: 'Colorado', code: 'CO' },
  { state: 'Connecticut', code: 'CT' },
  { state: 'Deleware', code: 'DE' },
  { state: 'District of Columbia', code: 'DC' },
  { state: 'Florida', code: 'FL' },
  { state: 'Guam', code: 'GU' },
  { state: 'Georgia', code: 'GA' },
  { state: 'Hawaii', code: 'HI' },
  { state: 'Idaho', code: 'ID' },
  { state: 'Illinois', code: 'IL' },
  { state: 'Indiana', code: 'IN' },
  { state: 'Iowa', code: 'IA' },
  { state: 'Kansas', code: 'KS' },
  { state: 'Kentucky', code: 'KY' },
  { state: 'Louisiana', code: 'LA' },
  { state: 'Maine', code: 'ME' },
  { state: 'Maryland', code: 'MD' },
  { state: 'Michigan', code: 'MI' },
  { state: 'Minnesota', code: 'MN' },
  { state: 'Massachusetts', code: 'MS' },
  { state: 'Montana', code: 'MT' },
  { state: 'Nebraska', code: 'NE' },
  { state: 'Nevada', code: 'NV' },
  { state: 'New Hampshire', code: 'NH' },
  { state: 'New Jersey', code: 'NJ' },
  { state: 'New Mexico', code: 'NM' },
  { state: 'New York', code: 'NY' },
  { state: 'North Carolina', code: 'NC' },
  { state: 'North Dakota', code: 'ND' },
  { state: 'Ohio', code: 'OH' },
  { state: 'Oklahoma', code: 'OK' },
  { state: 'Oregon', code: 'OR' },
  { state: 'Pennsylvania', code: 'PA' },
  { state: 'Puerto Rico', code: 'PR' },
  { state: 'Rhode Island', code: 'RI' },
  { state: 'South Carolina', code: 'SC' },
  { state: 'South Dakota', code: 'SD' },
  { state: 'Tennessee', code: 'TN' },
  { state: 'Texas', code: 'TX' },
  { state: 'Utah', code: 'UT' },
  { state: 'Vermont', code: 'VT' },
  { state: 'Virginia', code: 'VA' },
  { state: 'Virgin Islands', code: 'VI' },
  { state: 'Washington', code: 'WA' },
  { state: 'West Virginia', code: 'WV' },
  { state: 'Wisconsin', code: 'WI' },
  { state: 'Wyoming', code: 'WY' }
];
*/

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }

  handleClose(event) {
    this.setState({
      show: false
    });
  }

  handleShow(event) {
    this.setState({
      show: true
    });
  }

  render() {
    return (
      <>
        <SearchBar />
        <Container>
          <Row className='justify-content-center open-sans'>
            <Col md={6}>
              <Card className='mb-4 shadow-sm home-card'>
                <Card.Img variant="top" alt="Trees illustration" src="/images/placeholder-trees.png" className='image-size' />
                <Card.Body className='m-2'>
                  <Card.Title className='merriweather fw-bold fs-4'>States</Card.Title>
                  <Card.Text className='fs-6 pb-2'>
                    Browse through a list of states to discover national parks found within each state.
                  </Card.Text>
                  <Button variant="success" className='merriweather lh-lg' onClick={this.handleShow}>Select a State</Button>
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

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, reading this text in a modal!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

}
