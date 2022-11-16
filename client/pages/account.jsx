import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class AuthPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validated: false,
      error: this.validate('')
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.validate = this.validate.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      this.setState({
        validated: true
      });
    }
  }

  validate(value) {
    const trimmed = value.trim();
    const specialCharacters = /[!@#$%^&*()]/;
    const uppercaseCharacters = /[A-Z]/;
    const digit = /\d/;
    if (!trimmed) return 'A password is required';
    if (trimmed.length < 8) return 'Password must be at least 8 characters and include a capital letter, a digit, and a special character: !@#$%^&*()';
    if (specialCharacters.test(trimmed) && uppercaseCharacters.test(trimmed) && digit.test(trimmed)) {
      return '';
    } else {
      return 'Password needs: a capital letter, a digit, and a special character: !@#$%^&*()';
    }
  }

  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    if (name === 'password') {
      const error = this.validate(value);
      this.setState({
        [name]: value,
        error
      });
    } else {
      this.setState({
        [name]: value
      });
    }

  }

  render() {
    let anchorText = 'Register an account';
    let link = '#sign-up';
    if (this.props.action === 'sign-up') {
      anchorText = 'Sign in';
      link = '#sign-in';
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
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="username">
                <Form.Label>
                  Username
                </Form.Label>
                <Form.Control required name="username" type="text" placeholder="Enter username" onChange={this.handleInputChange}/>
                <Form.Control.Feedback type="invalid">Username required</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>
                  Password
                </Form.Label>
                <Form.Control required name="password" type="password" placeholder="Enter password" onChange={this.handleInputChange}/>
                <Form.Control.Feedback type="invalid" />
                <Form.Text>
                  {this.state.error}
                </Form.Text>
              </Form.Group>
              <a href={link}>
                {anchorText}
              </a>
              <Button type='submit' className='btn-success'>
                Sign Up
              </Button>
            </Form>
          </Row>
        </Container>
      </>
    );
  }
}
