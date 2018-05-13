import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

export default class ProductRow extends React.Component {

  static propTypes = {
    asin: PropTypes.string.isRequired,
    data: PropTypes.shape({
      title: PropTypes.string.isRequired,
      rating: PropTypes.string.isRequired,
      rank: PropTypes.string,
      timestamp: PropTypes.number.isRequired
    })
  }

  static defaultProps = {
    asin: '',
    data: {
      title: '',
      rating: '',
      rank: '',
      timestamp: 0
    }
  }

  render() {
    const {asin} = this.props;
    const {title, rating, rank, timestamp} = this.props.data;
    const productUrl = 'https://www.amazon.com/dp/' + asin;

    const asinLink = <a href={productUrl} onClick={(e) => {e.stopPropagation()}}>{asin}</a>; 
    const addedAt = moment(timestamp).format("MM/DD/YY");

    const rankRender = rank.substring(0, rank.indexOf(' ('));

    return (
      <div className="product-row">
        <div className="product-row-item" data-asin={asin}>{asinLink}</div> 
        <div className="product-row-item wider-col-2" data-title={title}>{title}</div>
        <div className="product-row-item narrow-col" data-rating={rating}>{rating}</div>
        <div className="product-row-item" data-timestamp={rankRender}>{rankRender}</div>
        <div className="product-row-item" data-timestamp={timestamp}>{addedAt}</div>
      </div>
    );
  }
}
