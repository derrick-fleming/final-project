import React from 'react';
import Home from './pages/home';
import parseRoute from './lib/parse-route';
import SearchResults from './pages/searchResults';

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
    return <Home />;
  }
}
