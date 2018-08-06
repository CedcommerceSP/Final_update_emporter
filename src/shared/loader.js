import React, { Component } from 'react';
import Loader from 'react-loader-spinner';

import { isUndefined } from 'util';

import './loader.css';

export class PageLoader extends Component {

    render() {
        return (
            <div className="overlay">
                <div className="loader-area">
                    <Loader
                        type={this.props.type}
                        color={this.props.color}
                        height={this.props.height}
                        width={this.props.width}
                    />
                </div>
            </div>
        );
    }
}
