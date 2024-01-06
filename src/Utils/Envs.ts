export const API_URL =
    import.meta.env.VITE_NODE_ENV === "development"
        ? import.meta.env.VITE_API_URL_DEV
        : import.meta.env.VITE_API_URL_PROD;

export const APP_URL =
    import.meta.env.VITE_NODE_ENV === "development"
        ? import.meta.env.VITE_APP_URL_DEV
        : import.meta.env.VITE_APP_URL_PROD;

export const APP_NAME = import.meta.env.VITE_APP_NAME ?? "Expenses";

export const CHECK_PASSWORD = import.meta.env.VITE_CHECK_PASSWORD === "true" ? true : false;

export const TOTAL_EXPENSES_PER_PAGE = Number(import.meta.env.VITE_TOTAL_EXPENSES_PER_PAGE as number) ?? 10;
