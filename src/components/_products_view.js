import React from 'react';
import {getProductsFromLocalStorage} from '../utils/local_storage_utils';
import ProductRow from './_product_row';
import _ from 'lodash';
import PropTypes from 'prop-types';

export default class ProductsView extends React.Component {

  static propTypes = {
    products: PropTypes.object
  }

  static defaultProps = {
    products: {}
  }

  state = {
    products: {}
  }

  componentDidMount() {
    const products = getProductsFromLocalStorage();
    this.setState({products});
  }

  componentWillReceiveProps(nextProps) {
    console.log('NextProps: %o', nextProps);
  }

  handleTableClick = (e) => {
    // Sorting implementation
    const container = document.querySelector('#productsTableContainer');
    const selected = e.target;
    const filter = selected.dataset.field;
    [].slice
      .call(container.querySelectorAll('[data-' + filter +']'))
      .sort((a,b) => { 
        return (a.dataset[filter].toLowerCase() > b.dataset[filter].toLowerCase()) - (a.dataset[filter].toLowerCase() < b.dataset[filter].toLowerCase()); 
      })
      .map((n,i) => {
        n.parentElement.style.order = i+1; 
        return n;
      });
  };

  renderProducts = () => {
    const {products} = this.state;

    console.log('Products: %o', Object.keys(products));

    const productsRows = Object.keys(products).map(asin => {
      const data = products[asin];
      return <ProductRow key={asin} asin={asin} data={data}/>;
    });

    const productsTableContainer = (
      <div id="productsTableContainer" onClick={(e) => this.handleTableClick(e)}>
        <div className="product-row product-row-header">
          <div title='sort a-z' className="product-row-item" data-field="asin">ASIN</div>
          <div title='sort a-z' className="product-row-item wider-col-2" data-field="title">Title</div>
          <div title='sort 0-5' className="product-row-item narrow-col" data-field="rating"><i className="fa fa-star"></i></div>
          <div title='sort 1-9999' className="product-row-item" data-field="rank">Rank</div>
          <div title='sort a-z' className="product-row-item" data-field="timestamp">Added</div>
        </div>
        {productsRows}
      </div>
    );

    return productsTableContainer;
  };

  render() {
    const {products} = this.state;

    const productTable = _.isObjectLike(products) && !_.isEmpty(products)
      ? this.renderProducts()
      : 'Database is empty';

    return (
      <div className="listing-container">
        <div className="paddedContainerHeader">
          <h2>Saved products</h2>
          <div className="paddedContainerBody">
            <div className="content">
              {productTable}
            </div>
          </div>
        </div>
      </div>
    );
  };
};
