import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Nav from 'react-bootstrap/Nav';
import AppContext from '../lib/app-context';

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
    let accountText = 'My Account';
    const { user } = this.context;
    if (!user) {
      accountText = 'Log In / Register';
    }
    const expand = 'md';
    let iconClass = 'fa-magnifying-glass';
    let buttonClass = 'search-hide';
    if (this.state.toggleGlass) {
      iconClass = 'fa-xmark';
      buttonClass = 'd-flex';
    }
    return (
      <Navbar collapseOnSelect variant="dark" expand={expand} className="p-0 mb-0 search-green">
        <Container fluid='xl' className="flex-nowrap">
          <a className="pe-4 text-white nav-title fs-1" href="#home">Park-Advisor</a>
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title className='gray-scale merriweather fs-2' id={`offcanvasNavbarLabel-expand-${expand}`}>
                Menu
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-start flex-grow-1 pe-3">
                <Nav.Link className='merriweather fs-6' href="#home">Home</Nav.Link>
                <NavDropdown className='merriweather fs-6'
                  title="Browse"
                  id={`offcanvasNavbarDropdown-expand-${expand}`}
                >
                  <NavDropdown.Item href="#home?browse=states">Browse States</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#home?browse=activities">
                    Browse Activities
                  </NavDropdown.Item>
                </NavDropdown>
                <hr />
                <Nav.Link className='merriweather fs-6' href="#accounts/user">{accountText}</Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
          <div className='d-flex'>
            <Navbar.Toggle className='border-0 px-1' aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Form className={buttonClass} onSubmit={this.handleSubmit}>
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-1"
                aria-label="Search"
                onChange={this.handleChange}
              />
              <Button variant="outline-light" onClick={this.handleSubmit} className='nav-search open-sans'>Search</Button>
            </Form>
            <button className='navbar-toggler border-0 text-white open-sans px-1' onClick={this.revealSearch}>
              <span>
                <i className={`fa-solid ${iconClass} nav-icon`} />
              </span>
            </button>
          </div>
        </Container>
      </Navbar>
    );
  }

}

NavigationBar.contextType = AppContext;
