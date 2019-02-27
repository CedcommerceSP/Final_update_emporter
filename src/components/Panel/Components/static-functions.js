import React  from 'react';

export function capitalizeWord(string) {
    string = modifyName(string);
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function modifyName(string) {
    console.log(string);
    switch (string.toLowerCase()) {
        case 'shopifygql': return 'Shopify';
        case 'amazonimporter': return 'Amazon';
        case 'ebayimporter': return 'Ebay';
        case 'walmartimporter': return 'Walmart';
        case 'etsyimporter': return 'Etsy';
        default: return string;
    }
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

export function validateImporter(code) {
    if ( code === 'product_sync'
        || code === 'product_import'
        || code === 'shopify_importer'
        ||  code === 'amazon_affiliate') {
        return false;
    }
    return true;
}

export function modifyAccountConnectedInfo(accounts) {
    let value = [];
    accounts.forEach((e) => {
        let title  = e;
        switch (e) {
            case 'amazonimporter':
            case 'amazon_importer': title = 'Amazon';break;
            case 'ebayimporter':
            case 'ebay_importer': title = 'Ebay';break;
            case 'walmartimporter':
            case 'walmart_importer': title = 'Walmart';break;
            case 'etsyimporter': title = 'Etsy';break;
            default: title = e;
        }
        if ( e !== 'shopify' ) {
            value.push({
                title: title,
                code: e
            })
        }
    });
    return value;
}