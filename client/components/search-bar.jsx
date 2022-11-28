import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import AppContext from '../lib/app-context';

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
    if (userInputValue !== '') {
      window.location.hash = 'search-results?search=' + userInputValue;
    }
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({ search: value });
  }

  render() {
    let searchText = (
      <h4 className='merriweather lh-base fw-light'>Search for a park or browse through different states or activities.</h4>
    );
    if (this.context.route.path === '' || this.context.route.path === 'home') {
      searchText = null;
    }
    return (
      <Container fluid='xl' className='p-4 mt-2'>
        <Row className='mb-2'>
          {searchText}
        </Row>
        <Row>
          <Form className='d-flex' onSubmit={this.handleSubmit}>
            <Form.Control
              type="search"
              placeholder="Search for a park"
              className="me-2"
              aria-label="Search"
              onChange={this.handleChange}
            />
            <Button className="merriweather btn-success " onClick={this.handleSubmit}>Search</Button>
          </Form>
        </Row>
      </Container>
    );
  }
}

SearchBar.contextType = AppContext;
