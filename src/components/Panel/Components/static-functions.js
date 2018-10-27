import React  from 'react';

export function capitalizeWord(string) {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function modifyOptionsData(data) {
    let options = [];
    if ( data !== null ) {
        for (let i = 0; i < Object.keys(data).length; i++) {
            let key = Object.keys(data)[i];
            options.push({
                label: data[key],
                value: key
            });
        }
    }
    return options;
}

export function paginationShow(activePage, count, totalData, success) {
    if ( !isNaN(totalData) && totalData !== 0  && success) {
        return <span>Showing {(activePage - 1 )* count} to {activePage * count} of <b>{totalData}</b></span>
    } else {
        return <span>{totalData}</span>;
    }
}