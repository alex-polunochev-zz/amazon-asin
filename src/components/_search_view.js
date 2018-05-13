import React from 'react';
import ProductSearchResult from '../containers/ProductSearchResult';
import classNames from 'classnames';

export default class SearchView extends React.Component {

  state = {
    value: 'B009ZM9R4O', // keep it here temporarily for easier testing
    valid: true,
    isProcessing: false,
    searchResult: '',
    searchStatus: ''
  };

  componentDidMount() {
    const textInput = this.refs.searchInput;

    if (textInput) {
      textInput.focus();
    }

    this.amazonUrl = 'https://www.amazon.com/dp/';
    this.cors_api_url = 'https://alex-asin-test2.herokuapp.com/';
  }

  doCORSRequest = (options, callback) => {
    const x = new XMLHttpRequest();
    x.open(options.method, this.cors_api_url + options.url);
    x.onload = x.onerror = function() {
      callback({status: x.status, response: x.response});
    };
    x.send(options.data);
  };

  handleAmazonResponse = ({status = 0, response = ''}) => {
    let searchResult = '';

    if (status === 200){
      searchResult = response;
    }

    this.setState({isProcessing: false, searchResult: searchResult, searchStatus: status});
  };

  handleChange = (event) => {
    const newValue = event.target.value

    // ASIN is an alphanumeric string up to 10 characters. 0 character is ok (default state)
    const validInput = newValue.length === 0 || (newValue.length <= 10 && newValue.match(/^[a-z0-9]+$/i));

    this.setState({value: newValue, valid: validInput});
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.state.valid && !this.state.isProcessing
      && this.state.value && this.state.value.trim().length) {
      this.setState({isProcessing: true, searchStatus: ''});

      this.doCORSRequest({
          method: 'GET',
          url: this.amazonUrl + this.state.value
        },
        this.handleAmazonResponse
      );
    }
  };

  render() {
    const {isProcessing, valid, searchStatus, searchResult} = this.state;

    const inputClasses = classNames({
      "input": true,
      "input--invalid": !valid,
      "input--waiting": isProcessing,
      "input--disabled": isProcessing
    });

    const searchIconClasses = classNames({
      "fa": true,
      "fa-search": true,
      "fa-search--disabled": isProcessing || !valid,
      "fa-search--waiting": isProcessing
    });

    const invalidInputMessage = (
      <div className="search-form-smallFont">
        {valid ? '' : '* Amazon Standard Identification Numbers (ASINs) are unique blocks of 10 letters and/or numbers that identify items.'}
      </div>
    );

    const spinner = isProcessing
      ? <i className="fa fa-circle-o-notch fa-spin"></i>
      : '';

    let foundStatus;
    if (searchStatus){
      foundStatus = (
        <div className="search-foundStatus">
          Product
          {searchStatus !== 200 ? ' not ' : ' '}
          found
        </div>
      );
    }

    const foundProductDetails = searchStatus === 200 && searchResult
      ? <ProductSearchResult
          result={searchResult}
          urlPattern={this.amazonUrl}
          asin={this.state.value} />
      : null;

    return (
      <div className="search-container">
        <div className="paddedContainerHeader">
          <h2>Enter ASIN to research product</h2>
          <div className="paddedContainerBody">
            <form onSubmit={this.handleSubmit}>
              <div className="search-form">
                <input
                  type="text"
                  ref="searchInput"
                  placeholder="Type ASIN, e.g. B002QYW8LW"
                  className={inputClasses}
                  value={this.state.value}
                  onChange={this.handleChange}
                  disabled = {isProcessing} />

                <div className={searchIconClasses} title="Submit search" onClick={this.handleSubmit} />
              </div>
              {invalidInputMessage}
            </form>
            <div className="content">
              {spinner}
              {foundStatus}
              {foundProductDetails}
            </div>
          </div>
        </div>
      </div>
    );
  };
};
