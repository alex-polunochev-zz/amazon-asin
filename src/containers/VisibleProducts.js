import { connect } from 'react-redux';
// import { toggleTodo } from '../actions';
import ProductsView from '../components/_products_view';
// import { VisibilityFilters } from '../actions';

const getVisibleProducts = (products) => {
  // switch (filter) {
  //   case VisibilityFilters.SHOW_ALL:
  //     return todos
  //   case VisibilityFilters.SHOW_COMPLETED:
  //     return todos.filter(t => t.completed)
  //   case VisibilityFilters.SHOW_ACTIVE:
  //     return todos.filter(t => !t.completed)
  //   default:
  //     throw new Error('Unknown filter: ' + filter)
  // }

  console.log('Products container recieved a published message');

  return products;
}

const mapStateToProps = state => ({
  products: getVisibleProducts(state.products)
})

// const mapDispatchToProps = dispatch => ({
//   toggleTodo: id => dispatch(toggleTodo(id))
// })

export default connect(
  mapStateToProps
)(ProductsView)
