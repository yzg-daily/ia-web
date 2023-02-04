/*
 * 模糊搜索（Fuzzy Search）
 * */
import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'antd';
import PropTypes from 'prop-types';
import { fuzzySearch } from '@/services/publicVerify';
import './index.less';

const { Option } = AutoComplete;

const FuzzySearch = props => {
    const { placeholder, onChange, onSelect, onBlur, style, disabled, userNames } = props;
    // 修复组件数据不回显。
    const { unitName = '' } = props['data-__meta'];
    const [dataSource, setDataSource] = useState([]);
    const [options, setOptions] = useState([]);
    const fuzzySearchData = async ev => {
        if (!ev) return setOptions([]);
        return (async () => {
            let res;
            if (userNames) {
                res = await fuzzySearch(ev.replace(/'/, ''), userNames);
            } else {
                res = await fuzzySearch(ev.replace(/'/, ''));
            }
            if (res) {
                setDataSource([...res.data]);
                const config = res.data.map(opt => (
                    <Option key={opt.id} {...opt} value={opt.name}>
                        {opt.name}
                    </Option>
                ));
                setOptions(config);
                if (onChange && typeof onChange === 'function') {
                    onChange(config);
                }
                if (onSelect && typeof onSelect === 'function') {
                    onSelect(config);
                }
            }
        })();
    };
    // 被选中时调用onSelect方法
    const methodSelect =
        onSelect ||
        function select(v) {
            return v;
        };
    // 根据传入的名称查询数据，修复数据不回显错误。
    useEffect(() => {
        if (unitName) {
            fuzzySearchData(unitName);
        }
    }, [unitName]);
    return (
        <AutoComplete
            allowClear
            className='certain-category-search'
            dropdownClassName='certain-category-search-dropdown'
            dropdownMatchSelectWidth={false}
            dropdownStyle={{ width: 300 }}
            defaultValue={unitName}
            size='large'
            style={style}
            dataSource={options}
            placeholder={placeholder}
            onSelect={(value, option) => methodSelect(option, dataSource)}
            onChange={fuzzySearchData}
            onBlur={onBlur}
            disabled={disabled}
        />
    );
};
FuzzySearch.propTypes = {
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
    'data-__meta': PropTypes.object,
};
FuzzySearch.defaultProps = {
    placeholder: '请输入查询关键字...',
    onChange: null,
    onSelect: null,
    'data-__meta': { unitName: '' },
};
export default FuzzySearch;
