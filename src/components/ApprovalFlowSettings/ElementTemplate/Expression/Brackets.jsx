import React, { useEffect, useState, forwardRef } from 'react';
import { Icon, Input, Row, Col } from 'antd';
import { isFn } from '@/utils/utils';

/**
 * 执行动作
 * @param {string} direction - 区分左右括号
 * @param {string} [brackets] - 已有数据
 * @param {string} [action] - 删除或是添加
 * @return {string}
 * */
const execute = (direction, brackets, action) => {
    let cache;

    if (!brackets && direction !== 'rightBracket') {
        cache = '(';
    } else if (!brackets && direction === 'rightBracket') {
        cache = ')';
    } else {
        cache = brackets;
    }
    if (direction === 'rightBracket') {
        cache = !brackets ? ')' : brackets;
    }
    if (action) {
        if (action === 'add') {
            if (brackets) {
                cache += direction !== 'rightBracket' ? '(' : ')';
            } else {
                cache = direction !== 'rightBracket' ? '(' : ')';
            }
        }
        if (action === 'remove') {
            if (brackets) {
                cache = cache.replace(/[()]/, '');
            } else {
                cache = null;
            }
        }
    }
    return cache;
};

const Brackets = forwardRef((props, ref) => {
    const { direction = 'leftBracket', placeholder, onChange, value } = props;
    const [brackets, setBrackets] = useState(null);

    useEffect(() => {
        if (isFn(onChange)) {
            onChange({ [direction]: brackets });
        }
    }, [brackets]);

    useEffect(() => {
        if (value && typeof value === 'string' && brackets !== value) {
            setBrackets(value);
        }
    }, [value]);

    return (
        <Row gutter={[8, 8]} key={`${props.id}_${direction}`}>
            <Col span={4}>
                {props?.isReadOnly ? null : (
                    <Icon type='plus-square' onClick={() => setBrackets(execute(direction, brackets, 'add'))} />
                )}
            </Col>
            <Col span={16}>
                <Input size='small' disabled value={brackets} placeholder={placeholder} ref={ref} />
            </Col>
            <Col span={4}>
                {props?.isReadOnly ? null : (
                    <Icon type='minus-square' onClick={() => setBrackets(execute(direction, brackets, 'remove'))} />
                )}
            </Col>
        </Row>
    );
});
// export default forwardRef((props,ref) => <Brackets {...props} ref={ref}/>);
export default Brackets;
