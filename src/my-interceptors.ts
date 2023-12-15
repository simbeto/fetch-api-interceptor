import type { RequestConfig, RequestFnReturns } from '$lib/index.js';
import http from '$lib/index.js';


export function setupInterceptors() {
    console.log('setting up Interceptors()');
    // Clearing all interceptors before adding.
    // These should be added once per app instance.
    // http.interceptors.request.clear()
    // http.interceptors.response.clear()

    http.interceptors.request.add(reqInterceptor_3_DummyJson)

    http.settings = {
        // responseType: 'blob'
        debug: true,
        baseUrl: 'https://dummyjson.com',
        prefixBaseUrl: true,
    }

    console.log(http.settings);
    // console.log(http.interceptors.request.get());
}

//----------------------------------------
// My Fetch API Interceptors
//----------------------------------------
// Dummy Json Request
export function reqInterceptor_3_DummyJson(url: string, config: RequestConfig): RequestFnReturns {
    return new Promise((resolve) => {
        const u = new URL(url)
        // console.log(u);

        if (u.hostname.startsWith('dummyjson')) {
            setQueryLimit(u)

            //  switch url request to get something entirely different.
            switchRequestPaths(u)
        }

        // After all changes done, set the full url
        url = u.href

        return resolve({ url, config })
    })
}

function setQueryLimit(u: URL) {
    u.searchParams.set('limit', '2')
}

function switchRequestPaths(u: URL) {
    if (u.pathname.startsWith('/products'))
        u.pathname = '/posts'

    else if (u.pathname.startsWith('/posts'))
        u.pathname = '/quotes'

    else if (u.pathname.startsWith('/quotes'))
        u.pathname = '/products'
}

//----------------------------------------
