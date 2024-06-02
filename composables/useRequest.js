const createRequest = async (url, method, body = null) => {
    const config = useRuntimeConfig();
    const { data, pending, error, refresh } = await useFetch(url, {
        baseURL: config.public.baseURL,
        onRequest({ request, options }) {
            options.method = method;
            options.headers = options.headers || {};
            options.headers.Authorization = accessToken() ? `Bearer ${accessToken()}` : '';
            options.headers.accept = 'application/json'

            if (body) {
                options.body = body;
                options.headers.contentType = 'multipart/form-data'
            }
        },
        onRequestError({ request, options, error }) {
            // Handle the request errors
        },
        onResponse({ request, response, options }) {
            // Handle the response object

        },
        onResponseError({ request, response, options }) {
            // Handle the response errors
        }
    });

    return { data, pending, error, refresh };
}

export const getData = async (url) => {
    return createRequest(url, 'GET');
};

export const postData = async (url, body) => {
    return createRequest(url, 'POST', body);
};

export const deleteData = async (url) => {
    return createRequest(url, 'DELETE');
};
