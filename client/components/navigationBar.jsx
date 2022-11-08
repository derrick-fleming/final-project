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
      <Navbar variant="dark" expand={expand} className="mb-3 search-green">
        <Container fluid className="flex-nowrap">
          <a className="text-white nav-title" href="#home">Parks</a>
          <div className='d-flex'>
            <Form className={buttonClass}>
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-light">Search</Button>
            </Form>
            <button className='navbar-toggler no-outline text-white' onClick={this.revealSearch}>
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
