import React from 'react';
import Home from './pages/home';
import parseRoute from './lib/parse-route';
import SearchResults from './pages/searchResults';
// For the Navigation Bar //
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

class NavigationBar extends React.Component {
  render() {
    const expand = 'lg';
    return (
      <Navbar variant="dark" expand={expand} className="mb-3 search-green">
        <Container fluid>
          <Navbar.Brand className="text-white"href="#home">Parks</Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
          <Navbar.Offcanvas
                id={`offcanvasNavbar-expand-${expand}`}
                aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                placement="end"
              >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                Menu
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-start flex-grow-1 pe-3">
                <Nav.Link href="#action1">Home</Nav.Link>
                <Nav.Link href="#action2">Link</Nav.Link>
              </Nav>
              <Form className="d-flex">
                <Form.Control
                      type="search"
                      placeholder="Search"
                      className="me-2"
                      aria-label="Search"
                    />
                <Button variant="outline-light">Search</Button>
              </Form>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    );
  }

}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  render() {
    if (this.state.route.path === 'search-results') {
      const search = this.state.route.params.get('search');
      return <SearchResults search={search} />;
    }
    return (
      <>
        <NavigationBar />
        <Home />
      </>
    );
  }
}
