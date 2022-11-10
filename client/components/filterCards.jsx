import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default class filterResults extends React.Component {
  render() {
    return <Container>
      <Row className='justify-content-center open-sans'>
        <Col md={6}>
          <Card className='mb-4 shadow-sm home-card'>
            <Card.Img variant="top" alt="Trees illustration" src="/images/placeholder-trees.png" className='image-size'/>
            <Card.Body className='m-2'>
              <Card.Title className='merriweather fw-bold fs-4'>States</Card.Title>
              <Card.Text className='fs-6 pb-2'>
                Browse through a list of states to discover national parks found within each state.
              </Card.Text>
              <Button variant="success" className='merriweather lh-lg'>Select a State</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className='shadow-sm home-card'>
            <Card.Img variant="top" alt="Mountain illustration" src="/images/placeholder-yosemite.png" className='image-size'/>
            <Card.Body className='m-2'>
              <Card.Title className='merriweather fw-bold fs-4'>Activities</Card.Title>
              <Card.Text className='fs-6 pb-2'>
                Browse through a list of activities to explore a park that matches your interests.
              </Card.Text>
              <Button variant="success" className='merriweather lh-lg px-4'>Browse</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Container>;
  }
}
