import React from 'react';
// import Home from './pages/home';
import parseRoute from './lib/parse-route';
import SearchResults from './pages/searchResults';
// For the Navigation Bar //
import SearchBar from './components/searchBar';
import NavigationBar from './components/navigationBar';
// import Col from 'react-bootstrap/Col';

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
      return (
        <>
          <NavigationBar />
          <SearchResults search={search} />
        </>
      );
    }
    return (
      <AppContext.Provider value={this.state.route}>
        <NavigationBar />
        <SearchBar />
      </ AppContext.Provider>
    );
  }
}

const AppContext = React.createContext();
