import _ from 'lodash';

const AMZ_PRODUCTS_KEY = 'amz_products';

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
