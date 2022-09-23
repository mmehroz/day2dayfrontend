import { QueryOptionsType, Product } from '@framework/types';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';

export const fetchRelatedProducts = async (product_slug: string) => {
  //   const [_key, _params] = queryKey;
  const { data } = await http.get(
    `${API_ENDPOINTS.RELATED_PRODUCTS}?product_slug=${product_slug}`
  );
  return data;
};
export const useRelatedProductsQuery = (product_slug: string) => {
  return useQuery<Product[], Error>(
    [API_ENDPOINTS.RELATED_PRODUCTS, product_slug],
    fetchRelatedProducts(product_slug)
  );
};
