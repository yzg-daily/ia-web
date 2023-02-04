/*
 * 添加审批角色
 * */
import React, { useEffect, useState } from 'react';
import { Checkbox, Row, Col } from 'antd';

const Role = props => {
    const { roleList, userList, element, dataCache } = props;
    const [activeKeys, setActiveKeys] = useState([]);
    const [signTypeValue, setSignTypeValue] = useState(null);

    const onChange = checkedValues => {
        setActiveKeys(checkedValues);
    };

    /* 更新审批类型 */
    useEffect(() => {
        const [cache] = dataCache?.filter?.(item => item.name === 'signedTypes' && item.id === element.id);
        if (cache && typeof cache?.value === 'number' && signTypeValue !== cache?.value) {
            if (element?.type !== 'bpmn:ManualTask') {
                setSignTypeValue(cache.value);
            }
        }
    }, [dataCache]);

    /* 触发更新 */
    useEffect(() => {
        if (typeof signTypeValue === 'number') {
            userList?.methods?.trigger?.(activeKeys, signTypeValue);
        }
    }, [activeKeys.length]);

    return (
        <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
            <Row type='flex' gutter={8}>
                {roleList?.map?.(item => (
                    <Col span={8}>
                        <Checkbox value={item?.id}>{item?.name ?? '--'}</Checkbox>
                    </Col>
                ))}
            </Row>
        </Checkbox.Group>
    );
};

export default Role;
