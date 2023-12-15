export type RequestConfig = Partial<Request>

export type RequestParams = { url: string, config: RequestConfig }
export type RequestFn = (url: string, config: RequestConfig) => RequestFnReturns
export type RequestFnReturns = Promise<RequestParams>

export type ResponseFn = (
    data: any,
    res: Response,
    config: RequestConfig
) => ResponseFnReturns

export type ResponseFnReturns = Promise<{ data: any }>
export type FinalResponse = Promise<{ data: any, response: Response }>

export type Settings = {
    responseType?: 'blob' | 'json' | 'text',
    debug?: Boolean,

    /**
     * Base Url to be prefixed to all requests.
     */
    baseUrl?: string,

    /**
     * When true will automatically set the base url to all requests which has a relative url.
     * If the `baseUrl` is not set, current location's origin will be used as base url.
     */
    prefixBaseUrl?: Boolean,

}