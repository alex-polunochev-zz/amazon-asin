import _ from 'lodash';

const AMZ_PRODUCTS_KEY = 'amz_products';

export function getProductFromLocalStorage(asin) {
  let product = {};
  try {
    let products = localStorage.getItem(AMZ_PRODUCTS_KEY);

    if(products) {
      products = JSON.parse(products);
      // not optimal search
      const key = Object.keys(products).filter(nextKey => nextKey === asin);
      product = products[key];
    }
  }
  catch(err) {
    console.error('Couldn\'t recover object from LocalStorage with key %o: %o', AMZ_PRODUCTS_KEY, err);
  }
  return product;
};

export function getProductsFromLocalStorage() {
  let products = {};

  try {
    products = localStorage.getItem(AMZ_PRODUCTS_KEY);

    if(products) {
      products = JSON.parse(products);
    }
  }
  catch(err) {
    console.error('Couldn\'t recover object from LocalStorage with key %o: %o', AMZ_PRODUCTS_KEY, err);
  }

  return products;
};

export function putProductToLocalStorage(id, data) {
  if(id && data && _.isObjectLike(data)) {
    const storedProducts = getProductsFromLocalStorage();
    let recordToSave = {[id]: data};

    if(recordToSave) {
      const newObj = _.merge(storedProducts, recordToSave);
      const serializedObj = JSON.stringify(newObj);

      localStorage.setItem(AMZ_PRODUCTS_KEY, serializedObj);
    }
  }
};
