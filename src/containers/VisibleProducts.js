import { connect } from 'react-redux';
import ProductsView from '../components/_products_view';
import {getProductsFromLocalStorage} from '../utils/local_storage_utils';

const mapStateToProps = state => ({
  products: getProductsFromLocalStorage()
});

export default connect(
  mapStateToProps
)(ProductsView)
