import axios from 'axios';

const server_url = 'https://api.dayanatura.com'
const local_url = 'http://localhost:3000'

export default axios.create({
    baseURL: local_url
})