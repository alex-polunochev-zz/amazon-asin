export const addProduct = ({asin, title, rating, rank}) => ({
  type: 'ADD_PRODUCT',
  asin,
  title,
  rating,
  rank
});

