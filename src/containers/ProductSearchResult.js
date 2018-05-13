import { connect } from 'react-redux';
import { addProduct } from '../actions';
import SearchResult from '../components/_search_result';

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSaveProductClick: () => dispatch(addProduct(ownProps.asin))
})

export default connect(
  null,
  mapDispatchToProps
)(SearchResult)
