import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default class filterResults extends React.Component {
  render() {
    return <>
      <Container>
        <Row>
          <Col md={6}>
            <Card style={{ width: '18rem' }} className='m-3'>
              <Card.Img variant="top" src="holder.js/100px180" />
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the
                  bulk
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card style={{ width: '18rem' }} className='m-3'>
              <Card.Img variant="top" src="holder.js/100px180" />
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the
                  bulk
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

      </Container>

      <div />;
    </>;
  }
}
