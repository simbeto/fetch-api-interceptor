import http from "../../http/http.js"
import {
    reqInterceptor_1, reqInterceptor_2, reqInterceptor_3_DummyJson,
    resInterceptor_1_Returns_Model, resInterceptor_2_DependsUpon_1, resInterceptor_3_DummyJson
} from "./my-interceptors.js"

// Add Interceptors
http.interceptors.request.add(reqInterceptor_1)
http.interceptors.request.add(reqInterceptor_2)
http.interceptors.request.add(reqInterceptor_3_DummyJson)

http.interceptors.response.add(resInterceptor_1_Returns_Model)
http.interceptors.response.add(resInterceptor_2_DependsUpon_1)
http.interceptors.response.add(resInterceptor_3_DummyJson)

const data = await http.get('https://dummyjson.com/quotes')
console.log(data);



// -------------------------------------------------- //




