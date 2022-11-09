import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';

export default class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleGlass: false
    };
    this.revealSearch = this.revealSearch.bind(this);
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

  revealSearch() {
    if (this.state.toggleGlass) {
      this.setState({ toggleGlass: false });
    } else {
      this.setState({ toggleGlass: true });
    }
  }

  render() {

    const expand = 'md';
    let iconClass = 'fa-magnifying-glass';
    let buttonClass = 'search-hide';
    if (this.state.toggleGlass) {
      iconClass = 'fa-xmark';
      buttonClass = 'd-flex';
    }
    return (
      <Navbar variant="dark" expand={expand} className="p-0 mb-3 search-green">
        <Container fluid='xl' className="flex-nowrap">
          <a className="text-white nav-title" href="#home">Parks</a>
          <div className='d-flex'>
            <Form className={buttonClass} onSubmit={this.handleSubmit}>
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                onChange={this.handleChange}
              />
              <Button variant="outline-light" onClick={this.handleSubmit} className='nav-search open-sans'>Search</Button>
            </Form>
            <button className='navbar-toggler border-0 text-white open-sans' onClick={this.revealSearch}>
              <span>
                <i className={`fa-solid ${iconClass}`} />
              </span>
            </button>
          </div>

        </Container>
      </Navbar>
    );
  }

}
