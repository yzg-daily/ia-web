import React, { useEffect, useState } from 'react';
import { Col, Empty, Row, Tag } from 'antd';
import { isFn } from '@/utils/utils';

/**
 * 创建新节点
 * @param {Object[]} nodes
 * @param {Function} closeMethod
 * @return {JSX.Element[]}
 */
const createNode = (nodes, closeMethod) => {
    if (!nodes?.length) {
        return [
            <Col span={24} key='key_col_empty'>
                <Empty imageStyle={{ height: 30 }} />
            </Col>,
        ];
    }
    // TODO React 设置 key 时， 需注意如果 key 设置错误可能会导致页面数据更新或展示错误
    return nodes.map(node => (
        <Col span={6} key={`key_col_${node.value}`}>
            <Tag
                closable={!node.disabled}
                key={`key_tag_${node.value}`}
                onClose={e => {
                    e.preventDefault();
                    if (isFn(closeMethod)) {
                        closeMethod(node);
                    }
                }}
            >
                {node.label}
            </Tag>
        </Col>
    ));
};

const TagShow = props => {
    const { data, onChange } = props;

    const [tags, setTags] = useState([]);

    /** 删除tag */
    const handleClose = removedTag => {
        const cache = tags.filter(tag => tag.value !== removedTag.value);
        setTags(cache);
        if (isFn(onChange)) {
            onChange([removedTag.value]);
        }
    };

    return (
        <Row gutter={16} type='flex'>
            {createNode(data, handleClose)}
        </Row>
    );
};

export default TagShow;
