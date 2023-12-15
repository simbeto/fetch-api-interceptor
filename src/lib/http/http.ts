import type {
    RequestFn, ResponseFn, RequestConfig, RequestParams,
    FinalResponse,
    Settings,
    RequestFnReturns,
    ResponseFnReturns,
} from "./types.js"

let debug: boolean = false

/**
 * Checks whether the given url is a relative or an absolute url.
 * @param url 
 * @returns 
 */
function isRelativeUrl(url: string) {
    return !/^(http|https|ftp):\/\//.test(url)
}

//----------------------------------------
// Settings
//----------------------------------------
let defaultOptions: Settings = {
    responseType: 'json',
    debug: false,

    baseUrl: '',
    prefixBaseUrl: false
}

function setOptions(options: Settings = {}) {
    return { ...defaultOptions, ...options }
}
//----------------------------------------


//----------------------------------------
// Main function
//----------------------------------------
function reset() {
    setOptions()
    console.groupEnd()
}

function httpRequest() {
    // Request config defaults, set by the user
    let config: RequestConfig = {
        // default headers, etc.
    }

    const interceptors = interceptorsSetup()

    return {
        get config() { return config },
        set config(options: RequestConfig) { config = options }, // set as is, no merging as no defaults are set here.

        get settings() { return defaultOptions },
        set settings(options: Settings) { defaultOptions = setOptions(options) }, // merge it with the default settings.

        interceptors: interceptors,

        // http request methods
        get, post, put, patch,
        delete: deleteReq,
        head, options,
    }
}

// Setup the http Wrapper. Create the default instance to be exported
export const http = httpRequest()
export default http
//----------------------------------------


function interceptorsSetup() {
    let request: RequestFn[] = []
    let response: ResponseFn[] = []

    function actions<T extends RequestFn | ResponseFn>(thisArg: T[]) {
        return {
            get: () => {
                return thisArg
            },
            add: (fn: T) => {
                // skip if the same function is already added
                if (thisArg.includes(fn)) return
                thisArg.push(fn)
            },
            clear: () => {
                thisArg = []
            },
        }
    }

    return {
        request: actions<RequestFn>(request),
        response: actions<ResponseFn>(response),
    }
}

/**
 * Make the fetch() request
 * 
 * @param url 
 * @param config 
 * @returns 
 */
async function makeRequest(url: string, config: RequestConfig, options?: Settings): FinalResponse {
    return new Promise(async (resolve, rejects) => {
        try {
            // Merge the default config with the given config
            config = { ...http.config, ...config }

            // Merge the settings
            options = setOptions(options)
            debug = options.debug
            debug && console.group()

            // if the url is relative, then add the baseUrl
            if (isRelativeUrl(url) && typeof window !== 'undefined') {

                // if the baseUrl is not set, then use the current location's origin
                options.baseUrl = options.baseUrl || window.location.origin

                if (options.prefixBaseUrl && options.baseUrl)
                    url = options.baseUrl + url
            }


            // 1. Intercept Requests: Work on url and request config
            const finalReqConfig = await runRequestInterceptors(url, config)

            // 2. Make the request
            const res = await fetch(finalReqConfig.url, finalReqConfig.config)

            // Debug: Log res headers
            if (debug) {
                console.log("Original Resp & Headers: ", res)
                console.table(Object.fromEntries([...res.headers.entries()]))
            }

            // set the data based on the Response Type settings
            // by default text() will be returned
            const data = await (options.responseType === 'json' && res.headers.get('content-type')?.includes('application/json')
                ? res.json()
                : options.responseType === 'blob'
                    ? res.blob()
                    : res.text()
            )

            // Debug
            debug && console.log('Original Data: ', data)


            // 3. Intercept Response: Work on response data
            const finalResData = await runResponseInterceptors(res, config, data)

            // Debug
            if (debug) {
                console.log('\n Final Request Config: ', finalReqConfig.url, finalReqConfig)
                console.log('\n Final Response Data: ', finalResData)
            }

            // reset to defaults
            reset()

            // expose the original res, intercepted res data
            return resolve({
                data: finalResData,
                response: res
            })
        } catch (error) {
            // reset to defaults
            reset()
            return rejects(error)
        }
    })
}

//----------------------------------------
// Interceptor Workers
//----------------------------------------
/**
 * Run each Request Interceptors
 * @param url 
 * @param config 
 * @returns 
 */
async function runRequestInterceptors(url: string, config: RequestConfig): RequestFnReturns {
    // to use the result of the previous interceptor and pass to the next
    let result: RequestParams = { url, config }

    return (async () => {
        for (const fn of http.interceptors.request.get()) {
            debug && console.log(`Running Request Interceptor: ${fn.name}`)
            result = await fn(result.url, result.config)
        }
        return result
    })()
}

/**
 * Run each Response Interceptor
 * @param res 
 * @param config 
 * @param data 
 * @returns 
 */
async function runResponseInterceptors(res: Response, config: RequestConfig, data: any): ResponseFnReturns {
    return (async () => {
        for (const fn of http.interceptors.response.get()) {
            debug && console.log(`Running Resp Interceptor: ${fn.name}`)
            data = await fn(data, res, config)
        }

        return data
    })()
}
//----------------------------------------


//----------------------------------------
// Request Methods
//----------------------------------------
function get(url: string, config: RequestConfig = {}, options?: Settings): FinalResponse {
    return makeRequest(url, { ...config, method: 'GET' }, options)
}

function post(url: string, config: RequestConfig = {}, options?: Settings): FinalResponse {
    return makeRequest(url, { ...config, method: 'POST' }, options)
}

function put(url: string, config: RequestConfig = {}, options?: Settings): FinalResponse {
    return makeRequest(url, { ...config, method: 'PUT' }, options)
}

function patch(url: string, config: RequestConfig = {}, options?: Settings): FinalResponse {
    return makeRequest(url, { ...config, method: 'PATCH' }, options)
}

function deleteReq(url: string, config: RequestConfig = {}, options?: Settings): FinalResponse {
    return makeRequest(url, { ...config, method: 'DELETE' }, options)
}

function head(url: string, config: RequestConfig = {}, options?: Settings): FinalResponse {
    return makeRequest(url, { ...config, method: 'HEAD' }, options)
}

function options(url: string, config: RequestConfig = {}, options?: Settings): FinalResponse {
    return makeRequest(url, { ...config, method: 'OPTIONS' }, options)
}
//----------------------------------------
