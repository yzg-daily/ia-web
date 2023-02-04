import React, { useEffect, useState } from 'react';
import { Col, Input, Row, Tree } from 'antd';
import css from './index.less';

const { TreeNode } = Tree;
const { Search } = Input;

const x = 3;
const y = 2;
const z = 1;
const gData = [];
const generateData = (_level, _preKey, _tns) => {
    const preKey = _preKey || '0';
    const tns = _tns || gData;
    const children = [];
    for (let i = 0; i < x; i++) {
        const key = `${preKey}-${i}`;
        tns.push({ title: key, key });
        if (i < y) {
            children.push(key);
        }
    }
    if (_level < 0) {
        return tns;
    }
    const level = _level - 1;
    children.forEach((key, index) => {
        tns[index].children = [];
        return generateData(level, key, tns[index].children);
    });
};
const generateList = data => {
    const result = [];
    for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const { key, id } = node;
        const cache = { key: key ?? id, ...node };
        if (node.children?.length) {
            cache.children = generateList(node.children);
        }
        result.push(cache);
    }
    return result;
};

const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.key === key) {
            parentKey = node.key;
        } else if (node.children) {
            const RE = new RegExp(key);
            if (node.children.some(item => RE.test(item.key))) {
                parentKey = node.key;
            } else {
                parentKey = getParentKey(key, node.children);
            }
        }
    }
    return parentKey;
};

/**
 * 自定义回调方法参数
 *
 * @callback requestCallback
 * @param {Object} result - 回调方法参数
 * @param {string} result.id - 菜单唯一值
 * @param {JSX.Element} result.title - 标题
 * @param {Object[]} result.children - 子集
 */
/**
 * 组织审核部门或人员选择
 * */
const MenuTree = props => {
    const {
        // 更新树型菜单
        updateTreeData = [],
        triggerEvent = props => null,
    } = props;

    const [expandedKeys, setExpandedKeys] = useState([]);

    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const [searchValue, setSearchValue] = useState('');

    const [treeData, setTreeData] = useState([]);

    const loop = data =>
        data?.map(item => {
            const index = item?.title?.indexOf(searchValue);
            const beforeStr = item?.title?.substr(0, index);
            const afterStr = item?.title?.substr(index + searchValue.length);
            const title =
                index > -1 ? (
                    <span>
                        {beforeStr}
                        <span style={{ color: '#f50' }}>{searchValue}</span>
                        {afterStr}
                    </span>
                ) : (
                    <span>{item.title}</span>
                );
            if (item.children) {
                return (
                    <TreeNode {...item} title={title}>
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} title={title} />;
        });

    const onExpand = expandedKeys => {
        setExpandedKeys(expandedKeys);
        setAutoExpandParent(false);
    };
    const findKeys = (node, value) =>
        node
            .map(item => {
                if (item.title.indexOf(value) > -1) {
                    return getParentKey(item.key, treeData);
                }
                return null;
            })
            .filter(item => item);
    const onChange = e => {
        const { value } = e.target;
        const expandedKeys = treeData
            .map(item => {
                if (item.title.indexOf(value) > -1) {
                    return getParentKey(item.key, treeData);
                } else if (item.children) {
                    return findKeys(item.children, value);
                }
                return null;
            })
            .filter((item, i, self) => item && self.indexOf(item) === i);
        setExpandedKeys(expandedKeys);
        setSearchValue(value);
        setAutoExpandParent(true);
    };
    const onSelect = (selectedKeys, e) => {
        if (triggerEvent && typeof triggerEvent === 'function') {
            triggerEvent(e.node.props);
        }
    };

    useEffect(() => {
        generateData(z);
        return () => {
            setTreeData([]);
        };
    }, []);

    useEffect(() => {
        setTreeData(generateList(updateTreeData.filter(item => item)));
    }, [updateTreeData.length]);

    return (
        <Row gutter={[8, 8]} type='flex'>
            <Col span={24}>
                <Search placeholder='请输入关键字查询' onChange={onChange} />
            </Col>
            <Col span={24}>
                <div className={css.tree}>
                    <Tree
                        onExpand={onExpand}
                        expandedKeys={expandedKeys}
                        autoExpandParent={autoExpandParent}
                        onSelect={onSelect}
                    >
                        {loop(treeData)}
                    </Tree>
                </div>
            </Col>
        </Row>
    );
};

export default MenuTree;
