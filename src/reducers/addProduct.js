const addProduct = (state = [], action) => {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return  action.asin;
    default:
      return state
  }
};

export default addProduct