import React, { Component } from 'react';

import { Page,
    TextStyle,
    Button,
    ResourceList,
    Card,
    ProgressBar,
    Label,
    Banner } from '@shopify/polaris';

import { requests } from '../../../services/request';
import { notify } from '../../../services/notify';

import './circle.css';
let intervalRunning;
export class QueuedTask extends Component {

    constructor() {
        super();
        this.state = {
          queuedTasks: [],
          totalQueuedTasks: 0,
          recentActivities: [],
          totalRecentActivities: 0
        };
        this.getAllNotifications();
        this.getAllQueuedTasks();
        intervalRunning = setInterval(() => {
            const activeUrl = this.props.history.location.pathname;
            if (activeUrl === '/panel/queuedtasks') {
                this.getAllNotifications();
                this.getAllQueuedTasks();
            }
        }, 3000);
    }
    componentWillUnmount() {
        clearInterval(intervalRunning);
    }
    getAllQueuedTasks() {
        requests.getRequest('connector/get/allQueuedTasks', {}, false, true)
            .then(data => {
                if (data.success) {
                    this.state.queuedTasks = this.modifyQueuedTaskData(data.data.rows);
                    this.state.totalQueuedTasks = data.data.count;
                    this.updateState();
                }
            });
    }

    modifyQueuedTaskData(data) {
        for (let i = 0; i < data.length; i++) {
            data[i].progress = Math.ceil(data[i].progress);
        }
        return data;
    }

    getAllNotifications() {
        requests.getRequest('connector/get/allNotifications', { count: 3, activePage: 0 }, false, true)
            .then(data => {
                if (data.success) {
                    this.state.recentActivities = data.data.rows;
                    this.state.totalRecentActivities = data.data.count;
                    this.updateState();
                }
            });
    }
    handleClearAllActivity = () => {
        requests.getRequest('/connector/get/clearNotifications').then(data => {
            if ( data.success ) {
                notify.success(data.message);
            } else {
                notify.error(data.message);
            }
        })
    };
    render() {
        return (
            <Page
                title="Queued Tasks">
                <div className="row p-sm-5 p-0">
                    <div className="col-12">
                        <Card>
                            <Card title="Recent Activities">
                                <div className="row p-5">
                                    <div className="col-12 p-5">
                                        {
                                            this.state.recentActivities.map(activity => {
                                                return (
                                                    <Banner status={activity.severity} key={this.state.recentActivities.indexOf(activity)}>
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <Label>{activity.message}</Label>
                                                            </div>
                                                            <div className="col-12 text-right">
                                                                <p>{activity.created_at}</p>
                                                            </div>
                                                        </div>
                                                    </Banner>
                                                );
                                            })
                                        }
                                        {
                                            this.state.recentActivities.length === 0 &&
                                            <Banner status="info">
                                                <Label>No Recent Activities</Label>
                                            </Banner>
                                        }
                                    </div>
                                    {
                                        this.state.totalRecentActivities > 3 &&
                                        <div className="col-12 pb-0 pl-5 pr-5 pt-5 text-right">
                                                    <span className="pr-4">
                                                        <Button onClick={this.handleClearAllActivity}>
                                                        Clear All Activities
                                                    </Button>
                                                    </span>
                                            <Button onClick={() => {
                                                this.redirect("/panel/queuedtasks/activities");
                                            }} primary>View All Activities</Button>
                                        </div>
                                    }
                                </div>
                            </Card>
                        </Card>
                    </div>
                    <div className="col-12 mt-4">
                        <Card title="Currently Running Processes">
                            <div className="p-5">
                                {
                                    this.state.queuedTasks.length === 0 &&
                                    <Banner status="info">
                                        <Label>All Processes Completed</Label>
                                    </Banner>
                                }
                                {
                                    this.state.queuedTasks.length > 0 &&
                                    <ResourceList
                                        resourceName={{singular: 'customer', plural: 'customers'}}
                                        items={this.state.queuedTasks}
                                        renderItem={(item) => {
                                            const {id, message, progress} = item;
                                            const progressClass = "c100 p" + progress + " small polaris-green";
                                            return (
                                                <ResourceList.Item
                                                    id={id}
                                                    accessibilityLabel={message}
                                                >
                                                    <div className="row">
                                                        <div className="col-md-2 col-sm-2 col-12">
                                                            <div className={progressClass}>
                                                                <span>{progress}%</span>
                                                                <div className="slice">
                                                                    <div className="bar"/>
                                                                    <div className="fill"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-10 col-sm-10 col-12">
                                                            <h5>
                                                                <TextStyle variation="strong">{message}</TextStyle>
                                                            </h5>
                                                            <div><ProgressBar progress={progress} /></div>
                                                        </div>
                                                    </div>
                                                </ResourceList.Item>
                                            );
                                        }}
                                    />
                                }
                            </div>
                        </Card>
                    </div>
                </div>
            </Page>
        );
    }

    redirect(url) {
        this.props.history.push(url);
    }

    updateState() {
        const state = this.state;
        this.setState(state);
    }
}