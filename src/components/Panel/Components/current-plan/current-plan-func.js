import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarCheck, faCalendarTimes, faCogs, faDollarSign, faHeadphones} from "@fortawesome/free-solid-svg-icons";
import React from "react";

const primaryColor = "#9c27b0";
const warningColor = "#ff9800";
const dangerColor = "#f44336";
const successColor = "#4caf50";
const infoColor = "#00acc1";
const roseColor = "#e91e63";
const grayColor = "#999999";

export function displayArray(data) {
    return ({
        description: 'You Can Add Your Description Here', // lvl 2
        card: [// lvl 1
            {
                text: '199$',
                text_info: 'Price',
                icon: <FontAwesomeIcon icon={faDollarSign} size="5x" color={primaryColor}/>,
            },
            {
                text: '15 Days Left',
                text_info: 'validity',
                icon: <FontAwesomeIcon icon={faCalendarTimes} size="5x" color={warningColor}/>,
            },
            {
                text: '29-03-2018',
                text_info: 'Plan Started',
                icon: <FontAwesomeIcon icon={faCalendarCheck} size="5x" color={successColor}/>,
            },
        ],
        card_service_group_name: ['service Group 1','service Group 2'], // title of service 'card_service' lvl 3
        card_service: [ // lvl 4
            [
                {
                    text: '24X7',
                    text_info: 'Service 1',
                    icon: <FontAwesomeIcon icon={faHeadphones} size="5x" color={infoColor}/>,
                },
                {
                    text: 'Technical Support',
                    text_info: 'Service 2',
                    icon: <FontAwesomeIcon icon={faCogs} size="5x" color={grayColor}/>,
                },
            ],
            [
                {
                    text: '24X7',
                    text_info: 'Service 1',
                    icon: <FontAwesomeIcon icon={faHeadphones} size="5x" color={infoColor}/>,
                },
                {
                    text: 'Technical Support',
                    text_info: 'Service 2',
                    icon: <FontAwesomeIcon icon={faCogs} size="5x" color={grayColor}/>,
                },
            ]
        ]
    });
}