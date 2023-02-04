import React, { useEffect, useState } from 'react';
import MenuTree from './MenuTree';
import { Row, Col, Checkbox, Divider } from 'antd';
import { removeDuplicate } from '@/components/ApprovalFlowSettings/utils';

const NODE_TYPE = 4;
const OrganizationStructure = props => {
    const { company, department, userList, dataCache, element } = props;

    const [checkAll, setCheckAll] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);
    const [checkedList, setCheckedList] = useState([]);
    const [plain, setPlain] = useState([]);
    const [signTypeValue, setSignTypeValue] = useState(0);
    // 全选/取消
    const onCheckAllChange = e => {
        setCheckedList(e.target.checked ? plain : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };
    const onChange = checkedLists => {
        const list = [];

        if (typeof signTypeValue === 'number' && signTypeValue === 0) {
            const cache = checkedList.flatMap(item => checkedLists.filter(items => items !== item));

            if (cache?.length) {
                list.push(...cache);
            } else {
                list.push(...checkedLists);
            }
        } else {
            const update = [];

            checkedList.forEach(item => {
                if (checkedLists.includes(item)) {
                    update.push(item);
                }
            });

            const unlike = checkedLists.filter(item => !checkedList.includes(item));

            const cache = removeDuplicate([...update, ...unlike], null);

            list.push(...cache);
            setIndeterminate(!!list.length && list.length < plain.length);
        }
        setCheckAll(list.length === plain.length);
        setCheckedList(list);
    };

    useEffect(() => {
        if (element?.type === 'bpmn:ManualTask') {
            setSignTypeValue(NODE_TYPE);
        }
        return () => {
            setCheckedList([]);
            setPlain([]);
            setIndeterminate(false);
            setCheckAll(false);
            setSignTypeValue(0);
        };
    }, []);

    useEffect(() => {
        setIndeterminate(false);
        setCheckAll(false);
        setPlain(userList?.data.map(item => item.id));
    }, [userList?.data]);

    useEffect(() => {
        userList.methods.trigger(checkedList, signTypeValue);
    }, [checkedList]);

    useEffect(() => {
        const [cache] = dataCache?.filter?.(item => item.name === 'signedTypes' && item.id === element.id);
        if (cache && typeof cache?.value === 'number' && signTypeValue !== cache?.value) {
            if (element?.type !== 'bpmn:ManualTask') {
                setSignTypeValue(cache.value);
                if (cache?.value === 0) {
                    setIndeterminate(false);
                    setCheckAll(false);
                    setCheckedList([checkedList[checkedList?.length - 1]].filter(item => item));
                }
            }
        }
    }, [dataCache]);

    return (
        <Row gutter={16} type='flex' style={{ width: '100%', padding: '0 10px' }}>
            <Col span={10}>
                <h4>公司(单位)</h4>
                <MenuTree updateTreeData={company.data} triggerEvent={company.methods.trigger} />
            </Col>
            <Col span={8}>
                <h4>部门</h4>
                <MenuTree updateTreeData={department.data} triggerEvent={department.methods.trigger} />
            </Col>
            <Col span={6}>
                <h4>人员</h4>
                <Checkbox
                    disabled={!signTypeValue && element?.type !== 'bpmn:ManualTask'}
                    indeterminate={indeterminate}
                    onChange={onCheckAllChange}
                    checked={checkAll}
                >
                    {checkAll ? '取消全选' : '全选'}
                </Checkbox>
                <br />
                <Divider />
                <Checkbox.Group
                    options={userList?.data?.map(item => ({ label: item.name, value: item.id }))}
                    onChange={onChange}
                    value={checkedList}
                />
            </Col>
        </Row>
    );
};

export default OrganizationStructure;
