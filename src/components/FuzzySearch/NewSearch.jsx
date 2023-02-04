/*
 * 模糊搜索 cope form FuzzySearch/index
 * */
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { AutoComplete } from 'antd';
import PropTypes from 'prop-types';
import './index.less';
import { formData } from '@/utils/utils';
import request from '@/utils/request';
import { getUserInfo } from '@/utils/method';

const fuzzySearch = (name, keyName = 'keyword', props) => {
    if (!props) return {};
    const payload = props?.payload || {};
    const url = props?.url;
    if (!url) return {};
    payload['gid'] = getUserInfo('gid');
    payload['companyId'] = getUserInfo('gid');
    const body = formData({ ...payload, ...(props?.formValues || {}), [keyName]: name, name, query: true });
    return request(url, {
        method: 'POST',
        body,
    });
};
const { Option } = AutoComplete;

/**
 * 20210519
 * 新增 NewSearch 组件,使用方法基本和 FuzzySearch 组件一致. 剔除了多种判断，直接配置请求路径实现模糊查询
 * 使用时新增 2个参数, 默认会携带用户的 gid 来请求
 * ops: {url: '请求路径', ...rest}, rest可以是请求时要携带的参数
 * OptionProps: { value: 'Option对应的value', name: 'Option要显示的文字'  } OptionProps 关联 Option 组件.
 * */

/**
 * 20121119
 * @param {String} url 请求路径(加前缀)
 * @param {String} keyName 键值
 * @param {Object} url 求时需要携带的参数
 * @param {Boolean} callBackObject true时返回 {children, name, value} 否则返回String||Number
 * */
const defaultsOps = {
    url: '',
    keyName: 'name',
    formValues: {},
    callBackObject: false,
    changeBack: false, // true 在 searchData 触发 NewSearchSet 重新返回 onchange的值
};
/**
 * 20121119
 * @param {Object} props
 * values 默认是无值的,会在 methodSelect 之后根据 ops?.callBackObject 给表单返回一个值或者一个对象。
 * 值 = OptionProps?.[value] || Object = {chidren, name, value} 可以灵活控制返回值(name|value) (有时需要返回name是 {value: 'name', name: 'name'})
 * @param {Object} ops||defaultsOps
 * @param {Object} OptionProps
 *
 * @param {Function} methodSelect 给表单返回一个值或者一个对象, 执行完之后 values 有值！！！
 *
 * 使用回显功能时需要根据 unitName 查询并给表单返回一个值或者一个对象。
 * 如果 unitName && isNoHasValue(values) 为真时执行一次 methodSelect。
 * */

/**
 * 20211125
 * 1 组件受控时，props.value默认是无值的。
 * 2 输入框触发组件内 onChange?.(value)时,会和 form 联动.
 * 3 form会给组件返回输入的值 (props.value),可以解决无法 form resetFields 无法清除输入框值的问题 (数据向下)
 * */
const NewSearch = forwardRef((props, _ref) => {
    const {
        placeholder,
        onChange,
        onSelectValue,
        onSelect,
        onBlur,
        value,
        style,
        disabled,
        ops = defaultsOps,
        OptionProps = { value: 'id', name: 'name' },
        ...rest
    } = props;
    // 修复组件数据不回显。
    const { unitName = '' } = props['data-__meta'];
    const [dataSource, setDataSource] = useState([]);
    const [options, setOptions] = useState([]);
    const [values, setValues] = useState('');
    const status = useRef(true);
    const timeoutRef = useRef(null);
    /**
     *  (1) 让组件触发事件 给 form 传值
     *  此时 props value 有值, form 的 resetFields 可以清除 组件的值和输入框里值
     * */
    const NewSearchSet = (ops, o, ev) => {
        const val = ops?.callBackObject ? o?.props || {} : ev;
        onChange?.(val);
        onSelect?.(val);
        onSelectValue?.(val);
        status.current = true;
    };

    // 被选中时调用onSelect方法
    const methodSelect =
        onSelect ||
        function select(o, d, v) {
            /**
             * callBackObject 是否返回一个 Object的值
             * */
            NewSearchSet(ops, o, v);
        };

    /**
     * timeoutRef.current 防抖
     * */
    const searchData = (ev, _, o) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(async () => {
            const res = await fuzzySearch(ev, ops?.keyName, ops);
            const data = res?.data || [];
            if (data) {
                setDataSource([...data]);
                const { value, name } = OptionProps;
                let config = data.map((opt, index) => {
                    if (!opt) return '';
                    return (
                        <Option key={index} {...opt} text={opt?.[name]} label={opt?.[name]} value={opt?.[value]}>
                            {opt?.[name]}
                        </Option>
                    );
                });
                setOptions(config);
                if (ops?.changeBack) {
                    NewSearchSet(ops, o, ev);
                }
                if (unitName && isNoHasValue(values)) {
                    const item = config?.find(el => el?.props?.name === unitName) || {};
                    methodSelect(item, config, item?.props?.value);
                }
            }
            clearTimeout(timeoutRef.current);
        }, 500);
    };

    function isNoHasValue(value) {
        return (!value && typeof value !== 'string') || value === '';
    }

    const HandleChange = ev => {
        if (isNoHasValue(ev)) {
            setValues(undefined);
            options?.length && setOptions([]);
            dataSource?.length && setDataSource([]);
            onChange?.(undefined);
            // onSelect?.(undefined);
            return false;
        }
    };
    // const fuzzySearchData = (ev, o)
    const fuzzySearchData = (ev, o) => {
        setValues(ev);

        status.current = false;
        // 判断是否选中了
        const { id, value } = o?.props || {};
        if (ev === id && ev === value) {
            return false;
        }
        if (!isNoHasValue(ev)) return searchData(o?.props?.value || ev, ops, o);
        HandleChange(ev);
    };

    // 根据传入的名称查询数据，修复数据不回显错误。
    useEffect(() => {
        (async () => {
            if (unitName) {
                await fuzzySearchData(unitName);
            }
        })();
    }, []);
    useEffect(() => {
        HandleChange(value);
    }, [value]);
    return (
        <AutoComplete
            dropdownClassName={'NewSearchDropdown'}
            dropdownStyle={{ width: 300 }}
            defaultValue={unitName}
            backfill={true}
            size='default'
            style={style}
            dataSource={options}
            onSelect={(value, option) => methodSelect(option, dataSource, value)}
            onChange={fuzzySearchData}
            onBlur={onBlur}
            disabled={disabled}
            value={values}
            placeholder={placeholder}
            {...rest}
            // optionLabelProp={OptionProps?.name || 'name'}
        />
    );
});
NewSearch.propTypes = {
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
    'data-__meta': PropTypes.object,
};
NewSearch.defaultProps = {
    placeholder: '请输入查询关键字...',
    onChange: null,
    onSelect: null,
    'data-__meta': { unitName: '' },
};
export default NewSearch;
