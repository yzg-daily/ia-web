/*
 * 模糊搜索（Fuzzy Search）备份
 * */
import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'antd';
import PropTypes from 'prop-types';
import { fuzzySearch } from '@/services/publicVerify';
import './index.less';

const { Option } = AutoComplete;

const FuzzySearch = props => {
    const {
        placeholder,
        onChange,
        onSelect,
        onBlur,
        style,
        userNames,
        disabled,
        cgfmc,
        xsfmc,
        ghcode,
        dwcode,
        dept,
        deptType,
        sendPerson,
        value,
    } = props;
    const [dataSource, setDataSource] = useState([]);
    const [options, setOptions] = useState([]);
    const [values, setValues] = useState('');
    const fuzzySearchData = async ev => {
        setValues(ev);
        if (!ev) return setOptions([]);
        // if (ev && ev.length < 3) return false;
        return (async () => {
            let res;

            // 切换查询接口 ful存在时查询企查查及全部企业数据。否则查询当前公司下已设置企业
            if (userNames) {
                res = await fuzzySearch(ev.replace(/'/, ''), userNames);
            } else if (ghcode) {
                res = await fuzzySearch(ev.replace(/'/, ''), false, ghcode);
            } else if (dwcode) {
                res = await fuzzySearch(ev.replace(/'/, ''), false, false, dwcode);
            } else if (dept && deptType) {
                res = await fuzzySearch(ev.replace(/'/, ''), false, false, false, dept, deptType);
            } else if (sendPerson) {
                res = await fuzzySearch(ev.replace(/'/, ''), false, false, false, false, false, sendPerson);
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
                const ghcodefig = res.data.map(opt => (
                    <Option key={opt.id} {...opt} value={opt.code}>
                        {opt.code}
                    </Option>
                ));
                setOptions(config);
                if (onChange && typeof onChange === 'function') {
                    // 物流车辆档案新增，车辆不存在并且新增时走此处onChange事件
                    if (config.length) {
                        onChange(config);
                    } else {
                        onChange(ev);
                    }
                }
                if (onSelect && typeof onSelect === 'function') {
                    if (userNames) {
                        onSelect(res.data);
                    } else if (ghcode) {
                        onSelect(ghcodefig);
                    } else {
                        onSelect(config);
                    }
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
    useEffect(() => {
        fuzzySearchData(cgfmc);
    }, [cgfmc]);
    useEffect(() => {
        fuzzySearchData(xsfmc);
    }, [xsfmc]);
    useEffect(() => {
        if (!value) setValues('');
    }, [value]);
    return (
        <AutoComplete
            allowClear
            className='certain-category-search'
            dropdownClassName='certain-category-search-dropdown'
            dropdownMatchSelectWidth={false}
            dropdownStyle={{ width: 300 }}
            size='default'
            style={style}
            dataSource={options}
            placeholder={placeholder}
            onSelect={(value, option) => methodSelect(option, dataSource)}
            onChange={fuzzySearchData}
            onBlur={onBlur}
            value={values}
            disabled={disabled}
        />
    );
};
FuzzySearch.propTypes = {
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
};
FuzzySearch.defaultProps = {
    placeholder: '请输入查询关键字...',
    onChange: null,
    onSelect: null,
};
export default FuzzySearch;
