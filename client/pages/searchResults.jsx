import React from 'react';
import SearchBar from '../components/searchBar';
import NavigationBar from '../components/navigationBar';

export default class SearchResult extends React.Component {
  render() {
    return (
      <>
        <NavigationBar />
        <SearchBar />
      </>
    );
  }
}
