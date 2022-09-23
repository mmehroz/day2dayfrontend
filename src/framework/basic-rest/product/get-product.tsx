import { Product } from '@framework/types';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import shuffle from 'lodash/shuffle';

export const fetchProduct = async (product_slug: string) => {
  const { data } = await http.get(
    `${API_ENDPOINTS.SINGLE_PRODUCT}?product_slug=${product_slug}`
  );
  // ${API_ENDPOINTS.PRO}${1}
  return data;
};
export const useProductQuery = (product_slug: string) => {
  return useQuery<Product, Error>(
    [API_ENDPOINTS.SINGLE_PRODUCT, product_slug],
    () => fetchProduct(product_slug)
  );
};
