import React from 'react';
import parseRoute from './lib/parse-route';
import SearchResults from './pages/searchResults';
import Home from './pages/home';
import NavigationBar from './components/navigationBar';
import SearchBar from './components/searchBar';
import ParkDetails from './pages/details';
import ReviewPage from './pages/reviews';
import UserAccount from './pages/userAccount';
import AppContext from './lib/app-context';
import AuthPage from './pages/auth-page';
import jwtDecode from 'jwt-decode';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      user: null,
      isAuthorizing: true
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
    const token = window.localStorage.getItem('park-reviews-jwt');
    const user = token ? jwtDecode(token) : null;
    this.setState({ user, isAuthorizing: false });
  }

  renderPage() {
    const { path } = this.state.route;
    if (path === '' || path === 'home') {
      const browse = this.state.route.params.get('browse');
      return <Home browse={browse} />;
    }
    if (path === 'search-results') {
      const search = this.state.route.params.get('search');
      const page = this.state.route.params.get('page');
      return (
        <>
          <SearchBar />
          <SearchResults search={search} action='search' page={page} />
        </>
      );
    }
    if (path === 'state-results') {
      const search = this.state.route.params.get('search');
      return <SearchResults search={search} action='states' />;
    }
    if (path === 'details') {
      const park = this.state.route.params.get('park');
      return <ParkDetails search={park} />;
    }
    if (path === 'reviews') {
      const review = this.state.route.params.get('parkCode');
      return <ReviewPage park={review} />;
    }
    if (path === 'accounts/user') {
      return <UserAccount />;
    }
    if (path === 'sign-in' || path === 'sign-up') {
      return <AuthPage action={path} />;
    }
  }

  render() {
    if (this.state.isAuthorizing) return null;

    const { user, route } = this.state;
    const contextValue = { user, route };
    return (
      <AppContext.Provider value={contextValue}>
        <>
          <NavigationBar />
          {
            this.renderPage()
          }
        </>
      </AppContext.Provider>
    );

  }
}
