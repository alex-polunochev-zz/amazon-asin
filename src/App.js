import React from 'react';
import PageHeader from './components/_page_header';
import SearchView from './components/_search_view';
import VisibleProducts from './containers/VisibleProducts';
import './App.css';

const App = () => (
  <div className="app">
    <PageHeader />
    <div className="app-view-container">
      <SearchView />
      <VisibleProducts />
    </div>
  </div>
);

export default App;
