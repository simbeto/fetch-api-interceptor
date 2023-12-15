import type { RequestConfig, RequestParams, HttpResponse, InterceptorResponse } from "../../http/types.js"

function isSimbetoApiResponse(data: any) {
    return data.hasOwnProperty('status') && data.hasOwnProperty('model')
}


//----------------------------------------
// Request Interceptors
//----------------------------------------

// Request Interceptor-1
//   - Modify the url param and set method to `POST`
export function reqInterceptor_1(url: string, config: RequestConfig): Promise<RequestParams> {
    return new Promise((resolve) => {
        url = url.replace('{NAME}', 'Anupam')
        const data = { url, config: { ...config, method: 'GET' } }
        return resolve(data)
    })
}

// Request Interceptor-2
//   - Change the domain name in the url
export function reqInterceptor_2(url: string, config: RequestConfig): Promise<RequestParams> {
    // console.log('reqInterceptor_2: ', url, config.method)

    return new Promise((resolve) => {
        if (url.includes('some-url.com'))
            url = url.replace('some-url.com', 'simbeto.com')

        const data = { url, config }

        return resolve(data)
    })
}

// Dummy Json Request
//   Replace url path: `/products` with `/users` or `/posts`
//   Replace url query param: `limit` with `2`
export function reqInterceptor_3_DummyJson(url: string, config: RequestConfig): Promise<RequestParams> {
    // console.log('reqInterceptor_3: ', url)

    return new Promise((resolve) => {
        const u = new URL(url)
        // if (u.searchParams.get('limit'))
        u.searchParams.set('limit', '2')

        if (u.pathname.includes('/products'))
            u.pathname = (u.pathname.replace('/products', '/posts'))

        url = u.href

        const data = { url, config }
        return resolve(data)
    })
}

//----------------------------------------


//----------------------------------------
// Response Interceptors
//----------------------------------------
// Response Interceptor-1
//      Will only return the data back as res & config won't be modified.
export function resInterceptor_1_Returns_Model(data: any, res: Response, config: RequestConfig): InterceptorResponse {
    return new Promise(resolve => {
        // for list request
        // return resolve(data.status &&  data.model? data.model : [])

        // if its Simbeto ApiResponse
        if (isSimbetoApiResponse(data))
            // for list request
            if (Array.isArray(data.model))
                return resolve(data.status && data.model ? data.model : [])

            else if (typeof data.model === 'object')
                // for single model request
                return resolve(data.status ? data.model : {})

        return resolve(data)
    })
}

// Response Interceptor-2
//    Insert a new row in the List model.
export function resInterceptor_2_DependsUpon_1(data: any, res: Response, config: RequestConfig): InterceptorResponse {
    // console.log('resInterceptor_2_DependsUpon_1: ', data)

    return new Promise(resolve => {
        // for list request

        // if its Simbeto ApiResponse
        if (isSimbetoApiResponse(data))
            // here `data` is actual `data.model` from the response
            if (Array.isArray(data.model)) {
                data.model.push({
                    id: 99,
                    name: 'Interceptor-2:  Pushed to   `data.model`   of Original response',
                })
                tags: ['tag-1', 'tag-2']
            } else if (typeof data === 'object') {
                data['New_Property'] = 'Single model:  Added by Interceptor_' + new Date().getTime()
            }

        return resolve(data)
    })
}

// Dummy Json
//  Add custom posts to it.s
export function resInterceptor_3_DummyJson(data: any, res: Response, config: RequestConfig): InterceptorResponse {
    return new Promise(resolve => {
        // for list request

        // console.log('resInterceptor_3_DummyJson: ', data)

        // here `data` is actual `data.model` from the response
        if (data.posts) {
            data.posts.push({
                id: 99,
                name: 'Interceptor-3:  Pushed to   `data.posts`   of Original response',
                tags: ['tag-1', 'tag-2']
            })

        } else if (typeof data === 'object') {
            data['Interceptor_Property'] = 'Single model:  Added by Interceptor_' + new Date().getTime()
        }

        return resolve(data)
    })
}
//----------------------------------------

