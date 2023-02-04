import React, { useEffect, useState } from 'react';
import { Divider, Tabs } from 'antd';
import TaskNode from './TaskNode/TaskNode';
import Convention from './Convention/Convention';
import Expression from './Expression/Expression';
import OrganizationStructure from './OrganizationStructure/OrganizationStructure';
import SettingDefaultConditions from './SettingDefaultConditions/SettingDefaultConditions';
import Role from './Role/Role';
import { isFn } from '@/utils/utils';
import { auditUnique as unique, updateCachedData } from '../utils/index';

const { TabPane } = Tabs;

/**
 * 按顺序取值
 * @param {Object.<number>[]} order
 * @param {Object.<{id: string, name: string}>[]} value
 * @return {Object.<{id: string, name: string}>[]}
 */
function orderValue(order, value) {
    const result = [];
    order.forEach(item => {
        value.forEach(val => {
            if (val?.id === item) {
                result.push(val);
            }
        });
    });
    return result;
}
/**
 * 根据任务显示节点
 * @param {Object} props
 * @return {JSX.Element}
 * */
const displayNodesBasedOrTasks = props => {
    // 任务节点
    if (/^bpmn:(UserTask|ManualTask)/.test(props.task)) {
        const exist = [];
        const title = /^bpmn:(ManualTask)/.test(props.task) ? '抄送' : '审批(角色)';
        props?.echoData?.list?.forEach(item => {
            if (/collection|approver|assignee/.test(item.name)) {
                if (Array.isArray(item.value)) {
                    exist.push(...item.value);
                }
            }
        });

        return (
            <>
                <Divider />
                <p className='divider-title'>表单</p>
                <TaskNode {...props} />
                <Divider />
                <p className='organization-structure'>添加{title}人</p>
                {props?.isReadOnly ? null : (
                    <Tabs defaultActiveKey='people'>
                        <TabPane tab={`添加${title}人`} key='people'>
                            <OrganizationStructure
                                {...props}
                                exist={exist}
                                loading={props.loading}
                                company={props.company}
                                department={props.department}
                                userList={{
                                    data: props.userList.data,
                                    methods: {
                                        trigger(result, signTypeValue) {
                                            const userList = orderValue(result, props?.userList?.data);
                                            props.onChange([
                                                {
                                                    name: 'assignee',
                                                    value: userList,
                                                    id: props.element.id,
                                                    type: props.element.type,
                                                },
                                            ]);
                                            if (isFn(props.trigger)) {
                                                props.trigger(userList, signTypeValue);
                                            }
                                            if (isFn(props.userList?.methods?.trigger)) {
                                                props?.userList?.methods?.trigger?.(userList);
                                            }
                                        },
                                    },
                                }}
                            />
                        </TabPane>
                        {/^bpmn:(ManualTask)/.test(props.task) ? null : (
                            <TabPane tab='添加审批角色' key='role'>
                                <Role
                                    {...props}
                                    userList={{
                                        data: props.roleList,
                                        methods: {
                                            trigger(result, signTypeValue) {
                                                const userList = orderValue(result, props.roleList);
                                                if (isFn(props.trigger)) {
                                                    props.trigger(userList, signTypeValue);
                                                }
                                                if (isFn(props.userList?.methods?.trigger)) {
                                                    props?.userList?.methods?.trigger?.(userList);
                                                }
                                            },
                                        },
                                    }}
                                />
                            </TabPane>
                        )}
                    </Tabs>
                )}
            </>
        );
    }
    // 网关 设置默认网关
    if (props.task === 'bpmn:ExclusiveGateway') {
        return (
            <>
                <Divider />
                <p className='divider-title'>默认网关设置</p>
                <SettingDefaultConditions {...props} />
            </>
        );
    }
    // 节点流转表达式控制
    if (props.task === 'bpmn:SequenceFlow') {
        return (
            <>
                <Divider />
                <p className='divider-title'>控制条件</p>
                <Expression {...props} />
            </>
        );
    }
    return null;
};
const action = {
    exist(source) {
        const cache = {
            name: [],
            result: [],
        };
        source?.forEach(item => {
            if (!cache.name.includes(item.name)) {
                cache.result.push(item);
                cache.name.push(item.name);
            }
        });
        return cache;
    },
    compare(exist, data) {
        const { result, name } = exist;
        const [...copy] = [...result];

        const notExist = data.filter(item => !name.includes(item.name));
        // 添加新数据
        if (notExist.length) {
            copy.push(...notExist);
        }
        data.forEach(item => {
            const updateIndex = copy.findIndex(idx => idx.name === item.name);
            if (updateIndex > -1) {
                copy.splice(updateIndex, 1, item);
            }
        });
        return copy;
    },
    unique(source, data) {
        if (!source?.length) return data;
        return action.compare(action.exist(source), data);
    },
};
const ElementTemplate = props => {
    const { onChange, procDefKey } = props;

    const [cache, setCache] = useState([]);
    const [existUser, setExistUser] = useState([]);
    const [defaultConditions, setDefaultConditions] = useState(false);

    useEffect(() => {
        if (isFn(onChange)) {
            onChange(cache);
        }
    }, [cache]);

    useEffect(() => {
        return () => {
            setExistUser([]);
            setCache([]);
            setDefaultConditions(false);
        };
    }, []);
    return (
        <>
            <p className='divider-title'>常规</p>
            <Convention {...props} onChange={data => setCache(updateCachedData(data, cache, procDefKey))} />
            {displayNodesBasedOrTasks({
                ...props,
                people: existUser,
                defaultConditions,
                onChange: data => {
                    const caches = {
                        existUser: null,
                        defaultConditions: null,
                    };
                    data?.forEach(item => {
                        if (item.name === 'assignee') {
                            caches.existUser = item.value;
                        }
                        if (item.name === 'defaultConditions') {
                            caches.defaultConditions = item.value;
                        }
                    });
                    setCache(updateCachedData(data, cache, procDefKey));
                    setExistUser(caches.existUser);
                    setDefaultConditions(caches.defaultConditions);
                },
                trigger(people, type) {
                    setExistUser(unique(props.userList.data, people, existUser, type));
                },
            })}
        </>
    );
};
export default ElementTemplate;
