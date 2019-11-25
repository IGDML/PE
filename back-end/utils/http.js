// import axios from 'axios'
var axios = require('axios')

const http = axios.create({
  baseURL: 'http://35.193.130.44:8000/', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

module.exports = http
