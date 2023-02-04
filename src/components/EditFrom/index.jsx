import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
    Button,
    Cascader,
    Checkbox,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Radio,
    Row,
    Select,
    Spin,
    Switch,
    TimePicker,
    TreeSelect,
} from 'antd';
import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import FuzzySearch from '@/components/FuzzySearch';
import NewSearch from '@/components/FuzzySearch/NewSearch';
import { createTreeData } from '@/utils/utils';
import * as validate from './validation';
import { deepEqual } from './objects';
import RangeNumber from './RangeNumber';
import Placeholder from './Placeholder';
import UploadPictures from '@/components/UploadPictures';
import UploadFile from '@/components/UploadFile/UploadFile';
import UploadPicturesName from '@/components/UploadPicturesName/upload';
import UploadPictureapibasel from '@/components/UploadPictureapibasel/upload';
import TagShow from './TagShow';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { isNaN } = Number;

class DataEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            record: this.props.record,
        };
    }

    componentDidMount() {
        const { selectFirst } = this.props;
        if (!selectFirst) {
            return;
        }
        // eslint-disable-next-line react/no-find-dom-node
        const form = ReactDOM.findDOMNode(this.editForm);
        const div = form.querySelector('div.ant-form-item-control');
        if (!div) {
            return;
        }
        const { tagName } = div.firstChild;
        if (tagName === 'INPUT') {
            div.firstChild.focus();
        } else {
            div?.first?.click?.();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.record && !deepEqual(nextProps.record, this.props.record)) {
            const positons = this.getPositons(nextProps.controls);
            if (nextProps.record.htje && nextProps.record.htje < 1) {
                this.setState({ record: {}, positons });
            } else {
                this.setState({ record: nextProps.record, positons });
            }
        }
    }

    getPositons = controls => {
        const positons = {};
        let sum = 0.0;
        let row = 0;
        controls.forEach((c, i) => {
            const g2 = c.grid / 24;
            sum = sum + c.grid > 1 ? g2 : c.grid;
            if (sum > 1) {
                row += 1;
                sum = 0;
            }
            if (!positons[row]) {
                positons[row] = [];
            }
            positons[row].push(i);
            if (sum === 1) {
                row += 1;
                sum = 0;
            }
        });
        return positons;
    };

    getAntDControl = contProps => {
        const contType = contProps.type;
        const {
            multiple,
            placeholder,
            sfhztxx,
            name,
            data,
            labelInValue,
            disabled,
            setWdith,
            fieldNames,
            autocomplete,
            style,
            changeOnSelect = false,
        } = contProps;
        const getDataOptions = () =>
            data && data.length
                ? data.map(d => ({ value: d.value, label: d.label, key: d.key, sts: d.sts, lvl: d.lvl, pid: d.pid }))
                : [];
        let { optionTpl, valueTpl } = contProps;
        if (!optionTpl) {
            optionTpl = 'label';
        }
        if (!valueTpl) {
            valueTpl = 'value';
        }

        let cont;
        switch (contType) {
            case 'month':
                cont = (
                    <DatePicker.MonthPicker
                        key={`${name}_month`}
                        disabled={disabled}
                        locale={locale}
                        placeholder={placeholder}
                    />
                );
                break;
            case 'date':
                cont = (
                    <DatePicker key={`${name}_date`} disabled={disabled} locale={locale} placeholder={placeholder} />
                );
                break;
            case 'time':
                cont = (
                    <TimePicker key={`${name}_time`} disabled={disabled} locale={locale} placeholder={placeholder} />
                );
                break;
            case 'datetime':
                cont = (
                    <DatePicker
                        showTime
                        format='YYYY-MM-DD HH:mm:ss'
                        disabled={disabled}
                        locale={locale}
                        placeholder={placeholder}
                        {...contProps}
                    />
                );
                break;
            case 'range-month':
                cont = (
                    <DatePicker.RangePicker
                        key={`${name}_rangeMonth`}
                        format='YYYY-MM'
                        disabled={disabled}
                        locale={locale}
                        placeholder={placeholder}
                        {...contProps}
                    />
                );
                break;
            case 'range-date':
                cont = (
                    <DatePicker.RangePicker
                        key={`${name}_rangeDate`}
                        format='YYYY-MM-DD'
                        disabled={disabled}
                        locale={locale}
                        placeholder={placeholder}
                    />
                );
                break;
            case 'range-datetime':
                cont = (
                    <DatePicker.RangePicker
                        key={`${name}_rangeDatetime`}
                        showTime
                        format='YYYY-MM-DD HH:mm:ss'
                        disabled={disabled}
                        locale={locale}
                        placeholder={placeholder}
                        {...contProps}
                    />
                );
                break;
            case 'range-number':
                cont = <RangeNumber key={`${name}_rangeNumber`} placeholder={placeholder} />;
                break;
            case 'select': {
                const { Option } = Select;
                const options = getDataOptions();
                cont = (
                    <Select
                        key={`${name}_select`}
                        mode={multiple ? 'multiple' : ''}
                        placeholder={placeholder}
                        style={style || setWdith}
                        onSelect={contProps.onSelect}
                        onChange={contProps.onChange}
                        labelInValue={labelInValue}
                        size='default'
                        disabled={disabled}
                        onBlur={contProps.onBlur}
                    >
                        {options.map(o => (
                            <Option key={o.value} value={o[valueTpl]}>
                                {o[optionTpl]}
                            </Option>
                        ))}
                    </Select>
                );
                break;
            }
            case 'selectTags': {
                const { Option } = Select;
                const options = getDataOptions();
                cont = (
                    <Select
                        key={`${name}_select`}
                        mode='tags'
                        placeholder={placeholder}
                        style={style || setWdith}
                        onSelect={contProps.onSelect}
                        onChange={contProps.onChange}
                        labelInValue={labelInValue}
                        size='default'
                        disabled={disabled}
                        onBlur={contProps.onBlur}
                        tokenSeparators={[',']}
                    >
                        {options.map(o => (
                            <Option key={o.value} value={o[valueTpl]}>
                                {o[optionTpl]}
                            </Option>
                        ))}
                    </Select>
                );
                break;
            }
            case 'tree-select': {
                const treeData = getDataOptions();
                cont = (
                    <TreeSelect
                        showSearch
                        treeDefaultExpandAll
                        treeNodeFilterProp='label'
                        style={setWdith}
                        multiple={multiple}
                        showCheckedStrategy='SHOW_PARENT'
                        treeCheckable={multiple}
                        searchPlaceholder={contProps.searchPlaceholder || '请输入汉字进行查询'}
                        onSelect={contProps.onSelect}
                        disabled={disabled}
                        treeData={createTreeData(treeData)}
                        placeholder={placeholder}
                    />
                );
                break;
            }
            case 'tree-select-ssj': {
                cont = (
                    <TreeSelect
                        allowClear
                        showSearch
                        treeDefaultExpandAll
                        treeNodeFilterProp='title'
                        style={setWdith}
                        multiple={multiple}
                        showCheckedStrategy='SHOW_PARENT'
                        treeCheckable={multiple}
                        onSelect={contProps.onSelect}
                        disabled={disabled}
                        treeData={data}
                        placeholder={placeholder}
                    />
                );
                break;
            }
            case 'cascader-select':
                cont = (
                    <Cascader
                        key={`${name}_Cascader`}
                        showSearch
                        // options={data}
                        style={style || setWdith}
                        options={data}
                        placeholder={placeholder}
                        fieldNames={fieldNames}
                        onSelect={contProps.onSelect}
                        changeOnSelect={changeOnSelect}
                        disabled={disabled}
                    />
                );
                break;
            case 'checkbox':
                cont = (
                    <Checkbox
                        key={`${name}_Checkbox`}
                        defaultChecked={contProps.defaultChecked}
                        placeholder={placeholder}
                    >
                        {contProps.label}
                    </Checkbox>
                );
                break;
            case 'radio':
                cont = (
                    <Radio key={`${name}_Radio`} name='senjia'>
                        {contProps.label}
                    </Radio>
                );
                break;
            case 'checkbox-group': {
                const CheckboxGroup = Checkbox.Group;
                cont = <CheckboxGroup key={`${name}_CheckboxGroup`} options={getDataOptions()} disabled={disabled} />;
                break;
            }
            case 'radio-group': {
                const dataOptions = getDataOptions();
                cont = (
                    <RadioGroup key={`${name}_RadioGroup`} disabled={disabled}>
                        {dataOptions.map(d => (
                            <Radio value={d[valueTpl]} key={d.value}>
                                {d[optionTpl]}
                            </Radio>
                        ))}
                    </RadioGroup>
                );
                break;
            }
            case 'search':
                cont = (
                    <FuzzySearch
                        key={`${name}_SearchInput`}
                        disabled={disabled}
                        placeholder={placeholder}
                        onChange={contProps.onChange}
                        sfhztxx={sfhztxx}
                        onSelect={contProps.onSelect}
                        onPressEnter={contProps.onPressEnter}
                        onBlur={contProps.onBlur}
                        style={setWdith}
                        {...contProps}
                    />
                );
                break;
            case 'NewSearch':
                cont = (
                    <NewSearch
                        key={`${name}_NewSearchInput`}
                        disabled={disabled}
                        placeholder={placeholder}
                        onChange={contProps.onChange}
                        sfhztxx={sfhztxx}
                        onSelect={contProps.onSelect}
                        onPressEnter={contProps.onPressEnter}
                        onBlur={contProps.onBlur}
                        style={setWdith}
                        {...contProps}
                    />
                );
                break;
            case 'disabled':
                cont = <Input key={`${name}_InputDisabled`} disabled={disabled} placeholder={placeholder} />;
                break;
            case 'autocomplete':
                cont = <Input key={`${name}_autocomplete`} autocomplete={autocomplete} placeholder={placeholder} />;
                break;
            case 'button-group': {
                const bData = contProps.data;
                cont = (
                    <div>
                        {bData.map(d => (
                            <Button
                                value={d.value}
                                key={d.value}
                                onClick={d.onClick}
                                type='primary'
                                loading={d.loading}
                                style={{ marginLeft: 5, padding: '0 5px' }}
                            >
                                {d.label}
                            </Button>
                        ))}
                    </div>
                );
                break;
            }
            case 'input-number':
                cont = <InputNumber key={`${name}_InputNumber`} size='default' min={1} max={100} disabled={disabled} />;
                break;
            case 'uploadPictures':
                cont = (
                    <UploadPictures
                        {...contProps}
                        key={`${name}_uploadPictures`}
                        size='default'
                        onChange={contProps.onChange}
                        style={style || setWdith}
                        disabled={disabled}
                    />
                );
                break;
            case 'uploadFile':
                cont = (
                    <UploadFile
                        {...contProps}
                        key={`${name}uploadFile`}
                        size='default'
                        onChange={contProps.onChange}
                        style={style || setWdith}
                        disabled={disabled}
                    />
                );
                break;
            case 'uploadPicturesName':
                cont = (
                    <UploadPicturesName
                        {...contProps}
                        key={`${name}_uploadPictures`}
                        size='default'
                        onChange={contProps.onChange}
                        style={style || setWdith}
                        disabled={disabled}
                    />
                );
                break;
            case 'UploadPictureapibasel':
                cont = (
                    <UploadPictureapibasel
                        {...contProps}
                        key={`${name}_uploadPictures`}
                        size='default'
                        onChange={contProps.onChange}
                        style={style || setWdith}
                        disabled={disabled}
                    />
                );
                break;
            case 'placeholder':
                cont = (
                    <Placeholder
                        {...contProps}
                        key={`${name}_placeholder`}
                        size='default'
                        onChange={contProps.onChange}
                        style={style || setWdith}
                        disabled={disabled}
                    />
                );
                break;
            case 'textarea':
                cont = (
                    <TextArea
                        allowClear
                        key={`${name}_TextArea`}
                        placeholder={placeholder}
                        disabled={disabled}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                );
                break;
            case 'switch':
                cont = (
                    <Switch
                        checkedChildren={contProps.checkedChildren ?? '开'}
                        unCheckedChildren={contProps.unCheckedChildren ?? '关'}
                    />
                );
                break;
            case 'tag':
                cont = (
                    <TagShow
                        {...contProps}
                        key={`${name}_placeholder`}
                        size='default'
                        onChange={contProps.onChange}
                        style={style || setWdith}
                        disabled={disabled}
                    />
                );
                break;
            default:
                cont = (
                    <Input
                        key={`${name}_Input`}
                        size='default'
                        style={style}
                        placeholder={placeholder}
                        disabled={disabled}
                        onBlur={contProps.onBlur}
                    />
                );
        }
        return cont;
    };

    getFieldDecoratorOption(cont) {
        const {
            name,
            required,
            type,
            label,
            dataType,
            multiple,
            onChange,
            disabled,
            defaultValue,
            autocomplete,
            tel = false, // 手机号  验证
            cardNum = false, //身份证 验证
            fullName = false, // 姓名  验证
        } = cont;
        const { record } = this.state;
        // type 等于 'search' 添加unitName字段，修复数据回显错误
        let unitName = '';
        let initVal = record[name];
        if (type === 'cascader-select') {
            initVal = defaultValue || initVal;
        } else if (dataType === 'date' || dataType === 'datetime') {
            let obj = initVal;
            if (typeof initVal === 'string') {
                if (initVal && initVal.length === 8) {
                    initVal = `${initVal.substr(0, 4)}/${initVal.substr(4, 2)}/${initVal.substr(6, 2)}`;
                }
                obj = new Date(initVal);
            }
            const dateFormat = 'YYYY/MM/DD';
            if (!obj || isNaN(obj.getTime())) {
                initVal = null;
            } else {
                initVal = obj ? moment(new Date(obj), dateFormat) : null;
            }
        } else if (dataType === 'month') {
            let obj = initVal;
            if (typeof initVal === 'string') {
                if (initVal && initVal.length === 6) {
                    initVal = `${initVal.substr(0, 4)}-${initVal.substr(4, 2)}-01`;
                }
                obj = new Date(initVal);
            }
            const dateFormat = 'YYYYMM';
            if (!obj || isNaN(obj.getTime())) {
                initVal = null;
            } else {
                initVal = obj ? moment(obj, dateFormat) : null;
            }
        } else if (type === 'search') {
            const keys = new RegExp(name.substring(0, name.length - 2));
            Object.entries(record).forEach(([k, v]) => {
                if (keys.test(k) && /[\u4e00-\u9fa5]/.test(v)) {
                    unitName = v;
                }
            });
        } else if (type === 'NewSearch') {
            const keys = new RegExp(name.substring(0, name.length - 2));
            Object.entries(record).forEach(([k, v]) => {
                if (keys.test(k)) {
                    unitName = v;
                }
            });
        }
        if (multiple || type === 'checkbox-group') {
            if (initVal === null || initVal === undefined || initVal === '') {
                initVal = [];
            } else if (typeof initVal === 'string') {
                initVal = initVal.split(',');
            }
        }
        let option = { initialValue: initVal, unitName };

        if (type === 'switch') {
            option = { ...option, valuePropName: 'checked', checked: !!initVal };
        }
        option.rules = [];
        if (required) {
            const rule = { required, message: `请输入${label}!` };
            if (multiple) rule.type = 'array';
            option.rules.push({ required, message: `请输入${label}!` });
        }
        // 手机号的验证
        if (tel) {
            option.rules.push({
                validator: (rule, value, callback) => {
                    const phone = {
                        rule: /^((1[3-9][0-9]))\d{8}$/,
                        tips: '输入正确的手机号',
                    };

                    let message;
                    if (!phone.rule.test(value)) {
                        message = phone.tips;
                    }
                    if (message) {
                        callback(message);
                    } else {
                        callback();
                    }
                    return message;
                },
            });
        }
        // 身份证的验证
        if (cardNum) {
            option.rules.push({
                validator: (rule, value, callback) => {
                    const idCard = {
                        rule: /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/,
                        tips: '输入正确的身份证号',
                    };

                    let message;
                    if (!idCard.rule.test(value)) {
                        message = idCard.tips;
                    }
                    if (message) {
                        callback(message);
                    } else {
                        callback();
                    }
                    return message;
                },
            });
        }
        // 姓名 验证  只能是汉字 数字 字母
        if (fullName) {
            option.rules.push({
                validator: (rule, value, callback) => {
                    const idCard = {
                        rule: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
                        tips: '只能由汉字，数字，字母组成',
                    };

                    let message;
                    if (!idCard.rule.test(value)) {
                        message = idCard.tips;
                    }
                    if (message) {
                        callback(message);
                    } else {
                        callback();
                    }
                    return message;
                },
            });
        }
        if (tel || cardNum || fullName) {
            option.rules.push({});
        } else {
            option.rules.push({ validator: this.validateField.bind(this, cont) });
        }
        // option.rules.push({ validator: this.validateField.bind(this, cont) });
        if (onChange) {
            option.onChange = onChange;
        }
        if (disabled) {
            option.disabled = true;
        }
        if (autocomplete) {
            option.autocomplete = 'off';
        }
        return option;
    }

    getControls() {
        const { getFieldDecorator } = this.props.form;
        const { controls } = this.props;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
        };
        const formItems = [];
        const count = controls.length;
        controls.forEach(c => {
            let layout = formItemLayout;
            if (c.layout && c.layout.labelSpan > 0 && c.layout.wrapperSpan > 0) {
                layout = {
                    labelCol: { span: c.layout.labelSpan },
                    wrapperCol: { span: c.layout.wrapperSpan },
                };
            }
            if (count === 1 || this.props.clearItemMargin) {
                layout.style = { margin: 0 };
            }
            let { label } = c;
            if (c.type === 'button-group' || c.type === 'checkbox') {
                label = '';
                layout = {
                    labelCol: { span: 0 },
                    wrapperCol: { span: 23 },
                };
            }
            formItems.push(
                <FormItem {...layout} label={label} key={`${c.name}`} style={{ marginBottom: 0 }}>
                    {getFieldDecorator(c.name, this.getFieldDecoratorOption(c))(this.getAntDControl(c))}
                </FormItem>
            );
        });
        return formItems;
    }

    validateField(c, rule, value, callback) {
        const cont = c;
        let valType = 'string';
        if (cont.multiple) {
            valType = 'array';
            if (!cont.sep) {
                cont.sep = ',';
            }
        } else if (cont.dataType === 'number') {
            valType = 'number';
        }
        if (cont.validator) {
            cont.formData = this.props.form.getFieldsValue();
        }
        const ret = validate.validate(value, valType, c);
        if (ret === true) {
            callback();
        } else {
            callback(ret);
        }
    }

    render() {
        const { controls, loading } = this.props;
        const conts = this.getControls();
        const rows = [];
        const p = this.getPositons(controls);
        const cs = controls;
        Object.keys(p).forEach((k, j) => {
            const cols = [];
            p[k].forEach(i => {
                let { grid } = cs[i];
                if (grid <= 1) {
                    grid = Math.round(grid * 24);
                }
                cols.push(
                    <Col key={i} span={grid}>
                        {conts[i]}
                    </Col>
                );
            });
            rows.push(cols);
        });
        return (
            <Spin tip='数据加载中，请稍候...' spinning={loading}>
                <Form
                    layout='horizontal'
                    ref={editForm => {
                        this.editForm = editForm;
                    }}
                >
                    <Row>{rows}</Row>
                </Form>
            </Spin>
        );
    }
}

DataEdit.propTypes = {
    controls: PropTypes.array,
    record: PropTypes.object,
    selectFirst: PropTypes.bool,
    clearItemMargin: PropTypes.bool,
    isDisabled: PropTypes.bool,
    loading: PropTypes.bool,
    daoName: PropTypes.string,
    setWdith: PropTypes.object,
};
DataEdit.defaultProps = {
    controls: [],
    record: {},
    selectFirst: true,
    clearItemMargin: false,
    isDisabled: false,
    loading: false,
    daoName: '',
    setWdith: {},
};

export default Form.create({})(DataEdit);
