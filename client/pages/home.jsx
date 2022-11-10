import React from 'react';
import SearchBar from '../components/searchBar';
import FilterCards from '../components/filterCards';

export default function Home(props) {
  return (
    <>
      <SearchBar />
      <FilterCards />
    </>
  );
}
