import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const userInputValue = this.state.search;
    window.location.hash = 'search-results?search=' + userInputValue;
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({ search: value });
  }

  render() {
    return (
      <Container fluid className='p-4'>
        <Row className='mb-4'>
          <h3 className='merriweather'>Search for a park.</h3>
        </Row>
        <Row>
          <Form className='d-flex' onSubmit={this.handleSubmit}>
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              onChange={this.handleChange}
            />
            <Button variant="success" onClick={this.handleSubmit}>Search</Button>
          </Form>
        </Row>
      </Container>
    );
  }
}
