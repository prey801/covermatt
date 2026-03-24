/**
 * Formats a number as a currency string without relying on system locale,
 * avoiding React hydration mismatches between server and client.
 */
export const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Ensures a value is only rendered on the client to prevent hydration errors.
 * Useful for dates, times, or anything that might differ from the server.
 */
export const isBrowser = typeof window !== 'undefined';
