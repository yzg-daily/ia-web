import React, { useEffect, useState } from 'react';
import { Tag, Row, Col, Empty } from 'antd';
import { isFn } from '@/utils/utils';

const TagShow = props => {
    const { data, onChange } = props;

    const [tags, setTags] = useState([]);

    /** 删除tag */
    const handleClose = removedTag => {
        const cache = tags.filter(tag => tag.value !== removedTag.value);
        setTags(cache);
        if (isFn(onChange)) {
            onChange(tags.filter(tag => tag.value === removedTag.value).map(item => item.value));
        }
    };

    useEffect(() => {
        setTags(data);
    }, [data]);

    return (
        <Row gutter={16}>
            {tags?.length ? (
                tags.map(tag => {
                    const tagElem = (
                        <Tag
                            key={tag.value}
                            closable
                            onClose={e => {
                                e.preventDefault();
                                handleClose(tag);
                            }}
                        >
                            {tag.label}
                        </Tag>
                    );
                    return (
                        <Col span={6} key={tag} style={{ display: 'inline-block' }}>
                            {tagElem}
                        </Col>
                    );
                })
            ) : (
                <Empty imageStyle={{ height: 30 }} />
            )}
        </Row>
    );
};

export default TagShow;
