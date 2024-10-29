// src/utils/url/urlUtils.ts

import { NextRequest } from 'next/server';

/**
 * Gets the value of a search parameter from the URL.
 * @param {string} key - The key of the search parameter.
 * @returns {string | null} - The value of the search parameter, or null if not found.
 */
export const getSearchParam = (key: string): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
};

/**
 * Sets or updates a search parameter in the URL.
 * @param {string} key - The key of the search parameter.
 * @param {string} value - The value of the search parameter.
 */
export const setSearchParam = (key: string, value: string): void => {
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set(key, value);
  window.history.replaceState(null, '', newUrl.toString());
};

/**
 * Deletes a search parameter from the URL.
 * @param {string} key - The key of the search parameter.
 */
export const deleteSearchParam = (key: string): void => {
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.delete(key);
  window.history.replaceState(null, '', newUrl.toString());
};

/**
 * Updates multiple search parameters in the URL.
 * @param {Record<string, string | null>} params - An object containing key-value pairs of search parameters to update.
 */
export const updateSearchParams = (params: Record<string, string | null>): void => {
  const newUrl = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null) {
      newUrl.searchParams.set(key, value);
    } else {
      newUrl.searchParams.delete(key);
    }
  });
  window.history.replaceState(null, '', newUrl.toString());
};

/**
 * Extracts parameters from a query string.
 * @param {string} queryString - The query string to extract parameters from.
 * @returns {Record<string, string | null>} - An object containing the extracted parameters.
 */
export const getParamsFromQueryString = (queryString: string): Record<string, string | null> => {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string | null> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

/**
 * Extracts parameters from a NextRequest object.
 * @param {NextRequest} request - The NextRequest object to extract parameters from.
 * @returns {Record<string, string | null>} - An object containing the extracted parameters.
 */
export const getParamsFromRequest = (request: NextRequest): Record<string, string | null> => {
  const params = new URLSearchParams(request.nextUrl.search);
  const result: Record<string, string | null> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};
