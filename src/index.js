import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';

import { App } from './App';
import { ToastContainer } from 'react-toastify';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((
    <div>
        <BrowserRouter>
            <App />
        </BrowserRouter>
        <ToastContainer />
    </div>
), document.getElementById('root'));
registerServiceWorker();
