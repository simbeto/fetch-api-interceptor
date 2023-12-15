# Simple Fetch API Interceptor

Native Fetch API doesn't facilitate Interceptors and calling relative urls.

This library allows to add multiple Interceptors for both Request & Response when using the native fetch api in the browser and NodeJs and facilitates to call relative urls after specifying `baseUrl` in its settings.

<!-- Although you should avoid adding too many interceptors as it may delay you request triggering; as each interceptor depends and works upon the awaited result of its previous Interceptor.
So if thats what and how your application requests needs to be processed then use it that way.
Thats how Interceptors must work. -->

You may though combine code of multiple interceptors into one function and just add that one.

There is an example using all the features in the repo.


## 📄 Installation

```
npm i @simbeto/fetch-api-interceptor
or
pnpm i @simbeto/fetch-api-interceptor
or
yarn add @simbeto/fetch-api-interceptor
```

<br/>

## 📑 How to Use

### Import the library and define your Interceptor functions

1. Import the Library
2. Define your Interceptor functions
3. Add your Interceptor functions
4. Make your Fetch API requests

<br/>

🟡 Write the code of adding the Interceptors in some script in your application which is called only once.

```ts
import http from '@simbeto/fetch-api-interceptor'

http.interceptors.request.add(yourRequestInterceptor_Function)
http.interceptors.response.add(yourResponseInterceptor_Function)
```


### 📄 Example
#### Lets take an example of getting some data from `dummyjson.com` and modify the request using the Request Interceptor

```ts

// app-init.ts
import http from '@simbeto/fetch-api-interceptor'
import requestInterceptor_DummyJson from './my-interceptors.ts'

http.interceptors.request.add(requestInterceptor_DummyJson)


// my-interceptors.ts
export function requestInterceptor_DummyJson(url: string, config: RequestConfig): RequestFnResult {
    return new Promise((resolve) => {
        const u = new URL(url)

        if (u.hostname.startsWith('dummyjson')) {
            // get only 2 records
            setQueryLimit(u)

            // switch url path params to get something entirely different
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


```

### That's basically it!
Now make your fetch api calls, as below.

```js

const list = await http.get('https://dummyjson.com/quotes')
//
<pre> { list.data } </pre>

```

<br/>


### 📄 Request Interceptors

Each Request Interceptor gets these parameters and must return them in a Promise after processing them.

| Prop | Description |
| ---- | ----------- |
| url  | The url of the request
| config | The Request config

<br/>

### 📄 Response Interceptors
Each Response Interceptor gets `data`, `response` & request `config` and must return `data` in a Promise.

| Prop | Description |
| ---- | ----------- |
| data | The response data after processing it. <br/> Each Interceptor gets the `data` returned by its previous Interceptor. <br/> The first one get the original response data.

<br/>

### 📄 The Final Response
All requests returns a Promise with the response `data` and the original `response` object.
<br/>In the below example `list.data` will contain the response data after being handled by all the Response Interceptors.

| Prop | Description |
| ---- | ----------- |
| data | Response data after processed by all the Response Interceptors.
| response | The original response object returned by the server


```ts

const list = await http.get('https://dummyjson.com/products')
// => Promise<{ data: any, response: Response }>
//
<pre> { list.data } </pre>
```

<br/>

### 📄 Interceptor Methods

| Methods | Description |
| ------- | ----------- |
|  get    | Gets the list of interceptors added
|  add    | Add interceptor
|  clear  | Remove all existing interceptors

```js

// See the list of added interceptors
console.log(http.interceptors.request.get())
console.log(http.interceptors.response.get())

```

### 📄 Default Options

| Methods | Description |
| ------- | ----------- |
| config  | Getter and Setter for the default request config
| settings| Getter and Setter for default options for this library. <br/> <strong>These can also be set separately for individual requests.</strong>
|         |  - `responseType` `<string: 'json' \| 'text' \| 'blob'>`: The response data return format. **Default is `'json'`** 
|         | - `debug` `<boolean>` : When true will log output to console.
|         | - `baseUrl` `<string>` : Base Url to be prefixed to all requests.
|         | - `prefixBaseUrl` `<boolean>` : When true will automatically set the base url to all requests which has a relative url. <br/>If the `baseUrl` is not set, current location's origin will be used as base url.



```ts

// get the list of default request config and settings.
console.log(http.config);
console.log(http.settings);

```


<br/>

```ts

// set the default request config to be used by all requests
http.config = {
    authorization: 'Bearer uYXV0aDAuY29tLyIsImF1ZCI6Imh0dHB',
    // ...
}

// set the default base url and response data format to return by all requests
http.settings = {
    responseType: 'blob',
    debug: true,
    baseUrl: 'http://your-app-base-url.com',
    prefixBaseUrl: true;
}

// Now the default response data type will be of 'blob' type
// Base Url will be prefixed to the request
const res = await http.get('/quotes')

// blob data
console.log(await res.data.type) // application/json
const list = JSON.parse(await res.data.text()) // parse json string
// 
<pre> { JSON.stringify(list.data, null, 2) } </pre>

```

<br/>
