import React, { useEffect, useRef, useState } from 'react';
import { isFn } from '@/utils/utils';
import DataEdit from '@/components/EditFrom';
import config from '../config';
import { updateCachedData } from '../../utils';

const nameRE = /collection|approver|assignee/;

/**
 * 更新人员信息
 * @param {Object[]} personnel - 人员列表
 * @param {Object[]} exist - 组件当前缓存数据
 * @param {Object} elementRef - 组件表单数据
 * @return {Object[]}
 */
const updatePersonnelInfo = (personnel, exist, elementRef) => {
    const result = [];
    exist?.forEach(data => {
        const { ...item } = { ...data };

        item.key = item.id;
        if (nameRE.test(item?.label ?? item?.name)) {
            item.name = 'assignee';
            item.value = personnel;
        }
        result.push(item);
    });
    return result;
};

/**
 * 审核人维护
 */
const reviewers = {
    /**
     * 添加审核人
     * @param {Object[]} personnel - 人员列表
     * @param {Object[]} exist - 组件当前缓存数据
     * @param {Object} element - BPMN当前选中图形
     * @param {Object} elementRef - 组件表单数据
     */
    add(personnel, exist, element, elementRef) {
        const [...copy] = [...exist];
        const index = exist.findIndex(item => item.name === 'assignee' && item.id === element.id);
        if (index > -1) {
            copy[index].value = personnel;
        } else {
            copy.push({
                name: 'assignee',
                label: 'assignee',
                value: personnel,
                id: element.id,
                type: element.type,
            });
        }
        return copy;
    },
    detectCategory(data, people, id, type) {
        if (!people?.length) return [];
        const [signType] = data.filter(
            item => item.id === id && /UserTask/gi.test(item.type) && item.name === 'signedTypes'
        );
        if ((signType && signType.value) || type === 'bpmn:ManualTask') {
            return people;
        }
        if (people[0]) return [people[people.length - 1]];
        return [];
    },
};

/**
 * 设置任务节点类型
 * @param {string} type - 节点类型
 * @return {string|'empty'}
 */
function setTaskNodesType(type) {
    const nodeTypeDict = {
        'bpmn:UserTask': 'examineAndApproveNode',
        'bpmn:ManualTask': 'ccNode',
    };
    if (!nodeTypeDict[type]) return 'empty';
    return nodeTypeDict[type];
}

const TaskNode = props => {
    const { onChange, people, echoData, element, procDefKey, expressionForm } = props;
    const [dataSet, setDataSet] = useState([]);
    const [peoples, setPeoples] = useState([]);
    const [taskNodeType, setTaskNodeType] = useState('empty');

    const elementRef = useRef();

    useEffect(() => {
        if (isFn(onChange)) {
            const result = updatePersonnelInfo(
                peoples,
                dataSet.filter(item => item.id === element.id),
                elementRef
            );
            onChange(result);
        }
    }, [dataSet]);

    useEffect(() => {
        const detectCategory = reviewers.detectCategory(dataSet, people, props.element.id, props.element.type);
        const keys = peoples.map(item => item.id);
        const is = people?.filter(item => !keys.includes(item.id))?.length ?? 0;
        setPeoples(detectCategory);
        if (people?.length && is) {
            const dataSetCopy = reviewers.add(detectCategory, dataSet, element, elementRef);
            setDataSet(dataSetCopy);
        }
    }, [people]);

    useEffect(() => {
        const record = {};
        if (echoData?.list) {
            const updateDataSet = [];
            echoData?.list
                ?.filter(item => item.id === element.id)
                .forEach(item => {
                    // 审批人/抄送人
                    if (nameRE.test(item.name) && Array.isArray(item.value)) {
                        setPeoples(item?.value);
                    }
                    // 审批类型
                    if (item.name === 'signedTypes' && !/ccNode/.test(taskNodeType)) {
                        record[item.name] = item.value;
                    }
                    updateDataSet.push({
                        ...item,
                        id: element.id,
                        type: element.type,
                    });
                });
            const res = updateCachedData(updateDataSet, dataSet, procDefKey);
            setDataSet(res);
        }
        elementRef?.current?.props?.form?.setFieldsValue(record);
    }, [echoData]);

    useEffect(() => {
        setTaskNodeType(setTaskNodesType(element.type));
        expressionForm && expressionForm?.(elementRef);
        return () => {
            elementRef?.current?.props?.form?.resetFields();
            setDataSet([]);
            setPeoples([]);
            setTaskNodeType('empty');
        };
    }, []);

    return (
        <DataEdit
            wrappedComponentRef={elementRef}
            controls={config.formData?.[taskNodeType]?.map(con => {
                const { ...item } = { ...con };
                item.disabled = props?.isReadOnly;
                if (item.name === 'signedTypes') {
                    item.onChange = event => {
                        const [...copy] = [...dataSet];
                        const index = dataSet.findIndex(da => da.name === item.name && da.id === element.id);
                        if (event === 0) {
                            let cache = [];
                            if (people?.[0]) {
                                cache = [people[people.length - 1]];
                            }
                            setPeoples(cache);
                        }
                        if (index > -1) {
                            const current = dataSet[index];
                            current.value = event;
                            copy.splice(index, 1, current);
                        } else {
                            copy.push({
                                name: item.name,
                                label: item.name,
                                value: event,
                                id: element.id,
                                type: element.type,
                            });
                        }
                        setDataSet(copy);
                    };
                }
                if (item.name === 'assignee') {
                    item.data = peoples
                        ?.map(item => {
                            if (!item) return;
                            if (item?.type) return item;
                            return {
                                label: item.name ?? item.label,
                                value: item?.value ?? item.id,
                                name: item.name ?? item.label,
                                id: item?.value ?? item.id,
                                disabled: props?.isReadOnly,
                            };
                        })
                        .filter(item => item);
                    // 删除
                    item.onChange = ev => {
                        const update = peoples.filter(item => !ev.includes(item.id));
                        const newDataSet = dataSet.map(da => {
                            const { ...old } = { ...da };
                            if (old.name === item.name) {
                                old.value = update;
                            }
                            return old;
                        });
                        setDataSet(newDataSet);
                        setPeoples(update);
                    };
                }
                return item;
            })}
        />
    );
};

export default TaskNode;
