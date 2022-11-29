import React from 'react';
import parseRoute from './lib/parse-route';
import SearchResults from './pages/search-results';
import Home from './pages/home';
import NavigationBar from './components/navigation-bar';
import SearchBar from './components/search-bar';
import ParkDetails from './pages/park-details';
import ReviewPage from './pages/review-form';
import UserAccount from './pages/user-account';
import AppContext from './lib/app-context';
import AuthPage from './pages/auth-page';
import jwtDecode from 'jwt-decode';
import UserReviews from './pages/user-reviews';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      user: null,
      isAuthorizing: true
    };
    this.handleSignIn = this.handleSignIn.bind(this);
  }

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('park-reviews-jwt', token);
    this.setState({ user });
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
    if (path === 'reviews' || path === 'edit-review') {
      const review = this.state.route.params.get('parkCode');
      let edit = false;
      if (path === 'edit-review') {
        edit = true;
      }
      return <ReviewPage park={review} edit={edit}/>;
    }
    if (path === 'accounts/user') {
      return <UserAccount />;
    }
    if (path === 'sign-in' || path === 'sign-up') {
      return <AuthPage action={path} onSignIn={this.handleSignIn}/>;
    }
    if (path === 'accounts/reviews') {
      const state = this.state.route.params.get('state');
      return <UserReviews state={state} />;
    }
  }

  render() {
    if (this.state.isAuthorizing) return null;
    const { handleSignIn } = this;
    const { user, route } = this.state;
    const contextValue = { user, route, handleSignIn };
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
