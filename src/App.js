import React, { Component } from 'react';
import PageHeader from './components/_page_header';
import SearchView from './components/_search_view';
import ListingView from './components/_listing_view';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <PageHeader />
        <div className="app-view-container">
          <SearchView />
          <ListingView />
        </div>
      </div>
    );
  }
}

export default App;
