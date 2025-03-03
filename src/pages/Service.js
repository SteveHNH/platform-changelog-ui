import React, { useEffect, useState } from "react";

import {
    PageSection,
    PageSectionVariants,
    TextContent,
    Text,
    TextVariants,
    TextListVariants,
    TextListItemVariants,
    TextListItem,
    TextList,
    Tabs, 
    Tab, 
    TabTitleText,
} from "@patternfly/react-core";
import { GithubIcon, GitlabIcon } from '@patternfly/react-icons';

import { useParams } from "react-router-dom";
import Moment from 'react-moment';

import { NotificationsContext, NotificationsPortal } from 'components/notifications';
import {
    CommitTable,
    DeployTable,
} from 'components/tables';

import {
    Timelines
} from 'components';

const NONE_SPECIFIED = "None specified";
const NONE_FOUND = "None found";

export default function Service() {
    const notifications = React.useContext(NotificationsContext);

    const name = useParams().name;

    const [service, setService] = useState({
        id: 0, 
        name: "",
        display_name: "",
        gh_repo: "",
        gl_repo: "", 
        deploy_file: "", 
        namespace: "",
        branch: "",
    });

    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        fetchService(`/api/v1/services/${name}`);
    }, []);

    async function fetchService(path) {
        fetch(path).then(res => {
            if (!res.ok) {
                throw new Error(`Service ${service.name} not found`);
            }
            return res.json();
        }).then(data => {
            if (data == undefined || data == null) {
                // service not found
                notifications.sendError(`Service ${service.name} not found`);
                return null;
            }
            
            if (data.length > 0) { // Duplicate names, it's possible...
                setService(data[0]);
            }

            setService(data);
        }).catch(error => {
            notifications.sendError(error.message);
        });
    }

    function handleTabClick(_event, tabIndex) {
        setActiveTab(tabIndex);
    }

    return (
        <>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text className="fullWidth" component="h1">
                        {service.display_name == "" ? name : service.display_name}
                        <div className="right">
                            {service.gh_repo && <a href={service.gh_repo} target="_blank" rel="noreferrer"><GithubIcon /></a>}
                            {service.gl_repo && <a href={service.gl_repo} target="_blank" rel="noreferrer"><GitlabIcon /></a>}
                        </div>
                    </Text>
                </TextContent>
            </PageSection>

            <Tabs
                activeKey={activeTab}
                onSelect={handleTabClick}
                isBox={false}
                aria-label="Select between commits and deploys tabs"
                style={{overflow: "visible"}}
            >
                <Tab key={0} eventKey={0} title={<TabTitleText>Details</TabTitleText>}>
                    <PageSection variant={PageSectionVariants.light}>
                        <TextContent>
                            <TextList component={TextListVariants.dl}>
                                <TextListItem component={TextListItemVariants.dt}>Namespace</TextListItem>
                                <TextListItem component={TextListItemVariants.dd}>{service.namespace ? service.namespace : NONE_SPECIFIED}</TextListItem>

                                <TextListItem component={TextListItemVariants.dt}>Branch</TextListItem>
                                <TextListItem component={TextListItemVariants.dd}>{service.branch ? service.branch : NONE_SPECIFIED}</TextListItem>
                            </TextList>
                        </TextContent>
                    </PageSection>
                </Tab>

                {service.id > 0 && <>
                    <Tab key={1} eventKey={1} title={<TabTitleText>Timeline</TabTitleText>}>
                        <Timelines dataPath={`/api/v1/services/${name}/timelines`} gh_url={service.gh_repo} gl_url={service.gl_repo} />
                    </Tab>

                    <Tab key={2} eventKey={2} title={<TabTitleText>Commits</TabTitleText>}>
                        <CommitTable key={service.id} dataPath={`/api/v1/services/${name}/commits`} gh_url={service.gh_repo} gl_url={service.gl_repo} />
                    </Tab>

                    <Tab key={3} eventKey={3} title={<TabTitleText>Deploys</TabTitleText>}>
                        <DeployTable key={service.name} dataPath={`/api/v1/services/${name}/deploys`} />
                    </Tab>
                </>}
            </Tabs>
        </>
    );
}

