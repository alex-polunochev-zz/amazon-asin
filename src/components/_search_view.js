import React, { Component } from 'react';

export default class SearchView extends React.Component {

  componentDidMount() {
    let url = 'https://www.amazon.com/dp/B002QYW8LW?th=1';
    this.cors_api_url = 'https://alex-asin-test.herokuapp.com/';
    

    this.doCORSRequest({
      method: 'GET',
      url: url
    },
    this.handleAmazonResponse
    );
  }

  doCORSRequest = (options, callback) => {
    const x = new XMLHttpRequest();
    x.open(options.method, this.cors_api_url + options.url);
    x.onload = x.onerror = function() {
      callback({status: x.status, response: x.response});
        // options.method + ' ' + options.url + '\n' +
        // x.status + ' ' + x.statusText + '\n\n' +
        // (x.responseText || '')
    };
    if (/^POST/i.test(options.method)) {
      x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    x.send(options.data);
  };

  handleAmazonResponse = ({status = -1, response = ''}) => {
    if(status === 200){
      console.log("Status 200, parsing...");
      // parse response here
    } else {
      console.log("Response: failure");
    }
  };

  render() {
    return (
      <div className='search-container'>
        <div className="paddedContainerHeader">
          <h2>Enter ASIN to Find product</h2>
          <div className='paddedContainerBody'>
            Here goes the form
          </div>
        </div>
      </div>
    );
  };
};
