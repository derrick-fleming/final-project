import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

export default class AuthPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      duplicate: '',
      error: '',
      isLoading: false,
      show: false,
      username: 'demoAccount',
      password: 'dem0@accounT'
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.validate = this.validate.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  async handleSubmit(event) {
    this.setState({
      isLoading: true
    });
    event.preventDefault();
    if (this.state.error !== null && this.props.action === 'sign-up') {
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
    try {
      const res = await fetch(`/api/auth/${action}`, req);
      if (res.status === 401) {
        this.setState({
          duplicate: 'Invalid login',
          error: 'Invalid login',
          isLoading: false
        });
      }
      if (res.status === 409) {
        this.setState({
          duplicate: 'Username has already been taken',
          isLoading: false
        });
      }
      const result = await res.json();
      if (result.error) {
        return;
      }
      if (action === 'sign-up') {
        window.location.hash = 'sign-in';
        this.setState({
          isLoading: false
        });
      } else if (result.user && result.token) {
        this.props.onSignIn(result);
        window.location.hash = 'accounts/user';
      }
    } catch (err) {
      console.error(err);
      this.setState({
        isLoading: false,
        show: true
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
      return null;
    } else {
      return 'Password needs: a capital letter, a digit, and a special character: !@#$%^&*()';
    }
  }

  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    if (name === 'password' && this.props.action === 'sign-up') {
      const error = this.validate(value);
      this.setState({
        [name]: value,
        error
      });
    } else {
      this.setState({
        [name]: value,
        duplicate: '',
        error: ''
      });
    }
  }

  handleClose(event) {
    this.setState({
      show: false
    });
  }

  render() {
    const spinner = this.state.isLoading === true
      ? (<div className="lds-ring"><div /><div /><div /><div /></div>)
      : '';

    if (this.state.isLoading) {
      return spinner;
    }

    const serverError = this.state.show
      ? (
        <Alert variant='danger' onClose={this.handleClose} dismissible>
          <Alert.Heading> Server Error</Alert.Heading>
          <p>Sorry, an unexpected error occurred. Please try again later.</p>
        </Alert>)
      : null;

    let anchorText = 'Register';
    let link = '#sign-up';
    let username = 'Username';
    let heroImage = 'images/arches.webp';
    let heroText = 'Sign In';
    let buttonText = 'Sign In';
    let openingText = (
      <>
        <h5 className='fw-light'>
          Sign in to access your reviews, ratings, and state tracker.
        </h5>
        <h5 className='fw-light fst-italic mb-0 mt-4'>
          Don&apos;t have an account?
        </h5>
        <h5 className='fw-light'>
          Click &apos;Register&apos; to create one.
        </h5>
      </>
    );
    if (this.props.action === 'sign-up') {
      anchorText = 'Sign in';
      link = '#sign-in';
      username = 'Create a username';
      heroImage = 'images/beach.webp';
      heroText = 'Create an Account';
      buttonText = 'Sign Up';
      openingText = (
        <h5 className='fw-light'>
          Create an account to write reviews,
          rate different parks, and keep track of all the places you&apos;ve visited.
        </h5>
      );
    }

    return (
      <>
        <div className='mb-4 position-relative hero-background text-center'>
          <img src={heroImage} alt='view of nature' className='account-hero-image' />
          <h2 className='w-100 merriweather fw-bold position-absolute top-50 start-50 translate-middle text-white'>{heroText}</h2>
        </div>
        <Container>
          {serverError}
          <Row className='justify-content-center'>
            <Col xs={10} md={9} className='open-sans text-center'>
              {openingText}
            </Col>
          </Row>
          <Row className='m-4 justify-content-center'>
            <Col xs={12} md={9}>
              <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="username">
                  <Form.Label className='merriweather fs-5'>
                    {username}
                  </Form.Label>
                  <Form.Control autoComplete="username" required name="username" type="text" value={this.state.username} placeholder="Enter username" onChange={this.handleInputChange}/>
                  <Form.Text className="open-sans text-danger">{this.state.duplicate}</Form.Text>
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label className='merriweather fs-5 mt-5'>
                    Password
                  </Form.Label>
                  <Form.Control autoComplete="current-password" required name="password" type="password" value={this.state.password} placeholder="Enter password" onChange={this.handleInputChange}/>
                  <Form.Control.Feedback type="invalid" />
                  <Form.Text className='open-sans text-danger'>
                    {this.state.error}
                  </Form.Text>
                </Form.Group>
                <Row className='mt-4'>
                  <Col>
                    <a className='btn merriweather go-back fs-6' href={link}>
                      {anchorText}
                    </a>
                  </Col>
                  <Col className='text-end'>
                    <Button type='submit' className='merriweather btn-success lh-lg px-4'>
                      {buttonText}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
