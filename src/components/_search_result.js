import React from 'react';
import PropTypes from 'prop-types';
import {putProductToLocalStorage} from '../utils/local_storage_utils';

export default class SearchResult extends React.Component {
  static propTypes = {
    asin: PropTypes.string.isRequired,
    result: PropTypes.string.isRequired,
    urlPattern: PropTypes.string.isRequired,
    onSaveProductClick: PropTypes.func.isRequired
  }

  static defaultProps = {
    asin: '',
    result: '',
    urlPattern: '',
    onSaveProductClick: () => {}
  }

  state = {
    title: '',
    rating: '',
    rank: '',
    isProductSaved: false
  }

  componentDidMount() {
    if (this.props.result) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(this.props.result, "text/html");
      
      // path to elements, due to rich content it's important to point to the unique identifiers on the page
      const titleRaw = doc.querySelector('#productTitle');
      const ratingStringRaw = doc.querySelector('#acrPopover');

      // As we are scraping the 3rd party page here, at some point the layout and mnemonics can change there.
      // Gracefully handle, indicate data is no longer available.
      const title = !titleRaw ? 'N/A' : titleRaw.innerText.trim();

      let rating = 'N/A';
      if (ratingStringRaw) {
        const ratingString = ratingStringRaw.innerText;
        // Rating string has a shape of "4.7 out of 5 stars". Grab first number in the string.
        const floatRegex = /[+-]?\d+(\.\d+)?/g;
        rating = ratingString.match(floatRegex)[0];
      }

      let rank = this.scrapeRank(doc);
      rank = !rank ? 'N/A' : rank;

      this.setState({
        title,
        rating,
        rank
      });
    }
  }

  scrapeRank = (doc) => {
    // found at least three differents way of sales rank rendering on amazon pages
    let rankString = '';

    // two most typical cases
    const rankHtmlRaw = doc.querySelector('#SalesRank td:nth-child(2)')
      || doc.querySelector('#SalesRank');

    if (rankHtmlRaw) {
      rankString = rankHtmlRaw.innerText;
    } else {
      // less typical case
      const list = doc.querySelectorAll('#productDetails_detailBullets_sections1 > tbody > tr');
      let rankS = null;
      Array.prototype.forEach.call(list, node => {
        if (node.querySelector('th').innerText.toLowerCase().includes('best sellers rank')) {
          rankS = node.querySelector('td').innerText;
        }
      });
      rankString = rankS;
    }

    if (rankString) {
      rankString = rankString
        // clean up
        .replace('Amazon Best Sellers Rank:', '')
        .replace(/\n\s*\n/g, '\n') // ranking html block markup is quite noisy and full of repeated linebreaks, reduce their amount
        .trim()

      // handle different Rank text block formats by keeping only the top rating
      if (rankString.includes(' (')) {
        rankString = rankString.substring(0, rankString.indexOf(' ('));
      } else if (rankString.includes(' > ')) {
        rankString = rankString.substring(0, rankString.indexOf('#', 1));
      }
    }

    return rankString;
  };

  handleSaveProduct = () => {
    const {asin} = this.props;
    const {title, rating, rank} = this.state;

    const timestamp = new Date().getTime();

    // save product to local storage
    putProductToLocalStorage(asin, {title, rating, rank, timestamp});

    // dispatch the message to update UI for products component
    this.props.onSaveProductClick(asin);

    this.setState({isProductSaved: true});
  }

  render() {
    const {title, rating, rank, isProductSaved} = this.state;
    const {urlPattern, asin} = this.props;

    const productUrl = urlPattern + asin;

    const button = isProductSaved
      ? <span className='searchResult-label-saved'>Saved!</span>
      : <button onClick={this.handleSaveProduct}>Add Product</button>;

    // You don't do normally dangerouslySetInnerHTML with content retrieved from elsewhere.
    // Here it's done just for time saving, and with assumption amazon pages is a safe source.
    return (
      <div className="searchResult">
        <table className="searchResult-table">
          <tbody>
            <tr>
              <td className="searchResult-table-label">Title</td>
              <td>{title} <a href={productUrl} className='searchResult-link'> link </a></td>
            </tr>
            <tr>
              <td className="searchResult-table-label">Rating</td>
              <td>{rating} out of 5 stars</td>
            </tr>
            <tr>
              <td className="searchResult-table-label">Rank</td>
              <td><div className="searchResult-table-rank" dangerouslySetInnerHTML={{__html: rank}} /></td>
            </tr>
            </tbody>
        </table>
        <div className="buttonPanel">
          {button}
        </div>
      </div>
    );
  }
}
