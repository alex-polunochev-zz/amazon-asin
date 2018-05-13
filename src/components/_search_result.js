import React from 'react';
import PropTypes from 'prop-types';

export default class SearchResult extends React.Component {
  static propTypes = {
    asin: PropTypes.string,
    result: PropTypes.string,
    urlPattern: PropTypes.string
  }

  static defaultProps = {
    asin: '',
    result: '',
    urlPattern: ''
  }

  state = {
    title: '',
    rating: '',
    rank: ''
  }

  componentDidMount() {
    if (this.props.result) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(this.props.result, "text/html");
      
      // path to elements, due to rich content it's important to point to the unique identifiers on the page
      const titleRaw = doc.querySelector('#productTitle');
      const ratingStringRaw = doc.querySelector('#acrPopover');
      // found at least two variants of layout for sales rank data
      const rankHtmlRaw = doc.querySelector('#SalesRank td:nth-child(2)') || doc.querySelector('#SalesRank');

      // As we are scraping the 3rd party page here, at some point the layout and mnemonics can change there.
      // Gracefully handle, indicate data is no longer available.
      const title = !titleRaw ? 'N/A' : titleRaw.innerText.trim();
      const ratingString = !ratingStringRaw ? 'N/A' : ratingStringRaw.innerText;

      const rank = !rankHtmlRaw 
        ? 'N/A' 
        // in case of layout ver.2, the text string is within the div, needs to be removed
        : rankHtmlRaw.innerHTML.replace('<b>Amazon Best Sellers Rank:</b>', '');
 
      // Rating string has a shape of "4.7 out of 5 stars". Grab first number in the string.
      const floatRegex = /[+-]?\d+(\.\d+)?/g;
      const rating = ratingString.match(floatRegex)[0];

      this.setState({
        title: title,
        rating: rating,
        rank: rank
      });
    }
  }

  render() {
    const {title, rating, rank} = this.state;
    const {urlPattern, asin} = this.props;

    const productUrl = urlPattern + asin;

    // You don't do normally dangerouslySetInnerHTML with content retrieved from elsewhere.
    // Here it's done just for time saving, and with assumption amazon pages is a safe source.
    return (
      <div className="searchResult">
        <table className="searchResult-table">
          <tbody>
            <tr>
              <td className="label">Title</td>
              <td>{title} <a href={productUrl} className='searchResult-link'> link </a></td>
            </tr>
            <tr>
              <td className="label">Rating</td>
              <td>{rating} out of 5 stars</td>
            </tr>
            <tr>
              <td className="label">Rank</td>
              <td><div dangerouslySetInnerHTML={{__html: rank}} /></td>
            </tr>
            </tbody>
        </table>
      </div>
    );
  }
}
