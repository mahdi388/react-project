import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from 'react-router-dom'
import {Provider} from "react-redux"
import store from './redux/store'
import axios from 'axios'

axios.defaults.baseURL="http://192.168.1.10:3030/"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BrowserRouter><Provider store={store}><App /></Provider></BrowserRouter>);