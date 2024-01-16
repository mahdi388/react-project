import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import {Provider} from "react-redux"
import store from './redux/store'
import axios from 'axios'
import AdminMain from "./components/admin/Main";

axios.defaults.baseURL="http://192.168.1.10:3030/"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BrowserRouter>
    <Provider store={store}>
        <Routes>
            <Route path="/admin/*" element={<AdminMain/>}></Route>
            <Route path="*" element={<App />}></Route>
        </Routes>
    </Provider>
</BrowserRouter>);