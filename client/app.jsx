import React from 'react';
// import Home from './pages/home';
import parseRoute from './lib/parse-route';
import SearchResults from './pages/searchResults';
// For the Navigation Bar //
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';

class NavigationBar extends React.Component {
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
          <a className="text-white nav-title"href="#home">Parks</a>
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

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
  }

  render() {
    if (this.state.route.path === 'search-results') {
      const search = this.state.route.params.get('search');
      return <SearchResults search={search} />;
    }
    return (
      <AppContext.Provider value={this.state.route}>
        <NavigationBar />
        <HomePage />
      </ AppContext.Provider>
    );
  }
}

const AppContext = React.createContext();

class HomePage extends React.Component {
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

HomePage.contextType = AppContext;
