import React  from 'react';
import {requests} from "../../../services/request";
import {globalState} from "../../../services/globalstate";

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

export function getActivePlan() {
    let tempPlan = [];
    globalState.removeLocalStorage('activePlan');
    requests.getRequest('plan/plan/getActive')
        .then(data => {
            if (data.success) {
                data.data.services.forEach(e => {
                    if ( e.code === 'amazon_importer' )
                        tempPlan.push('amazonimporter', 'amazon_importer');
                    if ( e.code === 'ebay_importer' )
                        tempPlan.push('ebayimporter', 'ebay_importer');
                });
                globalState.setLocalStorage('activePlan', JSON.stringify(tempPlan));
            }
        });
}