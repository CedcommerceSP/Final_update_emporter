import React, { Component } from 'react';

import { Page,
    TextStyle,
    ResourceList,
    Card,
    ProgressBar,
    Banner } from '@shopify/polaris';

import { requests } from '../../../services/request';

import './circle.css';

export class QueuedTask extends Component {

    constructor() {
        super();
        this.state = {
          queuedTasks: [
              {
                  id: 1,
                  message: 'Product import from amazon in progress',
                  progress: 89
              },
              {
                  id: 2,
                  message: 'Product upload to shopify in progress',
                  progress: 42
              },
              {
                  id: 3,
                  message: 'Product import from ebay in progress',
                  progress: 71
              }
          ]
        };
    }

    render() {
        return (
            <Page
                breadcrumbs={[{content: 'Queued Tasks'}]}
                title="Queued Tasks">
                <Card>
                    {
                        this.state.queuedTasks.length === 0 &&
                        <Banner title="You have no queued tasks">
                            <p>None of the queued tasks are running currently.</p>
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
                                                        <div className="bar"></div>
                                                        <div className="fill"></div>
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
                </Card>
            </Page>
        );
    }
}