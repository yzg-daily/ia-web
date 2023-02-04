import React, { useState } from 'react';
import { Select } from 'antd';
import { DCSAEP } from '../../utils';

const { Option } = Select;

const SettingDefaultConditions = props => {
    const [defaultConditions, setDefaultConditions] = useState(false);

    const onChange = value => {
        setDefaultConditions(value);
        props?.onChange?.([{ name: 'defaultConditions', value: value, id: props.element.id }]);
    };

    return (
        <Select
            disabled={props?.isReadOnly}
            placeholder='请设置默认条件'
            value={defaultConditions}
            style={{ minWidth: '35%', maxWidth: '100%' }}
            onChange={onChange}
        >
            {DCSAEP(props.element, props.dataCache)?.map?.(({ id, expression = '--' }) => (
                <Option value={id}>
                    {id}: {expression}
                </Option>
            ))}
        </Select>
    );
};

SettingDefaultConditions.defaultProps = {
    element: Element,
    dataCache: [],
};

export default SettingDefaultConditions;
