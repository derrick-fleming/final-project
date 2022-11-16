import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

export default class AuthPage extends React.Component {
  render() {
    let passwordDescription = '';
    if (this.props.action === 'sign-up') {
      passwordDescription = 'Password must be at least 8 characters and contain a number, an uppercase letter, and a unique character: @$!_&*';
    }
    return (
      <>
        <div />
        <Container>
          <Row>
            <Col className='open-sans text-center'>
              <h5 className='fw-light'>
                Sign in to access your reviews, ratings, and state tracker.
              </h5>
              <h5 className='fw-light fst-italic'>
                Don&apos;t have an account?
              </h5>
              <h5 className='fw-light'>
                Click &apos;Register&apos; to create one.
              </h5>
            </Col>
          </Row>
          <Row>
            <Form>
              <Form.Group controlId="username">
                <Form.Label>
                  Username
                </Form.Label>
                <Form.Control name="username" type="text" placeholder="Enter username"/>
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>
                  Password
                </Form.Label>
                <Form.Control name="password" type="password" placeholder="Enter password" />
                <Form.Text>
                  {passwordDescription}
                </Form.Text>
              </Form.Group>
            </Form>
          </Row>
        </Container>
      </>
    );
  }
}
