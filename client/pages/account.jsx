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
    if (this.state.error !== null) {
      return;
    }
    const username = this.state.username;
    const password = this.state.password;
    const account = { username, password };
    const { action } = this.props;
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(account)
    };
    fetch(`/api/auth/${action}`, req)
      .then(res => res.json())
      .then(result => {
        if (action === 'sign-up') {
          window.location.hash = 'sign-in';
        }
      });
  }

  validate(value) {
    const trimmed = value.trim();
    const specialCharacters = /[!@#$%^&*()]/;
    const uppercaseCharacters = /[A-Z]/;
    const digit = /\d/;
    if (!trimmed) return 'A password is required';
    if (trimmed.length < 8) return 'Password must be at least 8 characters and include a capital letter, a digit, and a special character: !@#$%^&*()';
    if (specialCharacters.test(trimmed) && uppercaseCharacters.test(trimmed) && digit.test(trimmed)) {
      return null;
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
    let username = 'Username';
    if (this.props.action === 'sign-up') {
      anchorText = 'Sign in';
      link = '#sign-in';
      username = 'Create a username';
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
          <Row className='m-4'>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="username">
                <Form.Label className='merriweather fs-5'>
                  {username}
                </Form.Label>
                <Form.Control required name="username" type="text" placeholder="Enter username" className='mb-4' onChange={this.handleInputChange}/>
                <Form.Control.Feedback type="invalid">Username required</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label className='merriweather fs-5 mt-2'>
                  Password
                </Form.Label>
                <Form.Control required name="password" type="password" placeholder="Enter password" onChange={this.handleInputChange}/>
                <Form.Control.Feedback type="invalid" />
                <Form.Text className='text-danger'>
                  {this.state.error}
                </Form.Text>
              </Form.Group>
              <Row className='mt-4'>
                <Col>
                  <a className='btn merriweather go-back text-decoration-none fs-6 lh-lg' href={link}>
                    {anchorText}
                  </a>
                </Col>
                <Col className='text-end'>
                  <Button type='submit' className='merriweather btn-success lh-lg px-4'>
                    Sign Up
                  </Button>
                </Col>
              </Row>
            </Form>
          </Row>
        </Container>
      </>
    );
  }
}
