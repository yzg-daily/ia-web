import React from 'react';
import PropTypes from 'prop-types';
import EditFrom from '@/components/EditFrom/';

import { Card, Button } from 'antd';

const ButtonGroup = Button.Group;
const stringSigns = [
    { value: 'like', label: '匹配' },
    { value: 'leftlike', label: '左匹配' },
    { value: 'rightlike', label: '右匹配' },
    { value: 'notlike', label: '不匹配' },
    { value: '=', label: '等于' },
    { value: '<>', label: '不等于' },
    { value: 'empty', label: '空值' },
];
const numberSigns = [
    { value: 'between', label: '两值之间' },
    { value: '=', label: '等于' },
    { value: '>', label: '大于' },
    { value: '>=', label: '大于等于' },
    { value: '<', label: '小于' },
    { value: '<=', label: '小于等于' },
    { value: '<>', label: '不等于' },
    { value: 'null', label: '空值' },
];
const selectSigns = [
    { value: 'in', label: '包含' },
    { value: 'notin', label: '不包含' },
    { value: 'null', label: '空值' },
];
const boolSigns = [
    { value: '=', label: '等于' },
    { value: '<>', label: '不等于' },
    { value: 'null', label: '空值' },
];
const controlTypeSigns = {
    integer: numberSigns,
    number: numberSigns,
    month: numberSigns,
    date: numberSigns,
    datetime: numberSigns,
    time: numberSigns,
    select: selectSigns,
    'checkbox-group': selectSigns,
    'radio-group': selectSigns,
    'tree-select': selectSigns,
    'cascader-select': selectSigns,
    checkbox: boolSigns,
};
export default class FilterItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filters: null,
        };
    }

    handleSignChange(i, value) {
        this.setFilters();
        const { filters } = this.state;
        const crName = `cr_${i}`;
        const cvName = `cv_${i}`;
        if (filters[crName] === 'between' || value === 'between') {
            filters[cvName] = null;
        }
        filters[crName] = value;
        this.setState({ filters });
    }

    componentWillReceiveProps(nextProps) {
        const { control } = this.props;
        let signsData = controlTypeSigns[control.type];
        if (!signsData) {
            signsData = stringSigns;
        }
        let { filters } = nextProps;
        if (!filters || !filters.count) {
            filters = { cr_0: signsData[0].value, cv_0: null, sign: 'AND', count: 1 };
        }
        this.setState({ filters });
    }

    handleClearFilters() {
        const colName = this.props.control.name;
        const { daoName } = this.props;
        const { reportName } = this.props;
        window.g_app._store.dispatch({
            type: `${daoName}/fetch`,
            payload: { daoName, reportName, colName, filter: null },
        });
    }

    setFilters() {
        const form = this.refs.filterForm.getForm();
        const filter = this.state.filters;
        if (!filter.count) {
            filter.count = 1;
        }
        const { count } = filter;
        form.validateFields((err, values) => {
            if (!err) {
                for (let i = 0; i < count; i++) {
                    const crName = `cr_${i}`;
                    const cvName = `cv_${i}`;
                    filter[crName] = values[crName];
                    filter[cvName] = values[cvName];
                }
                filter.sign = values.sign ? values.sign : 'AND';
            }
            this.state.filters = filter;
        });
    }

    handleSaveFilters() {
        this.setFilters();
        const { daoName } = this.props;
        const colName = this.props.control.name;
        const filter = this.state.filters;
        const { reportName } = this.props;
        const { onOk } = this.props;
        if (onOk) {
            onOk(colName, filter);
        } else {
            window.g_app._store.dispatch({
                type: `${daoName}/fetch`,
                payload: { daoName, reportName, colName, filter },
            });
        }
    }

    handleAddFilters() {
        this.setFilters();
        const { daoName, control } = this.props;
        let signsData = controlTypeSigns[control.type];
        if (!signsData) {
            signsData = stringSigns;
        }
        const colName = control.name;
        const filter = this.state.filters;
        const { count } = filter;
        const crName = `cr_${count}`;
        const cvName = `cv_${count}`;
        filter[crName] = signsData[0].value;
        filter[cvName] = null;
        filter.count = count + 1;
        this.setState({ filters: filter });
    }

    handleDeleteFilters() {
        this.setFilters();
        const filter = this.state.filters;
        let { count } = filter;
        if (count <= 1) {
            return;
        }
        count--;
        const crName = `cr_${count}`;
        const cvName = `cv_${count}`;
        delete filter[crName];
        delete filter[cvName];
        filter.count = count;
        this.setState({ filters: filter });
    }

    handleHideFilter() {
        const { daoName } = this.props;
        const { reportName } = this.props;
        window.g_app._store.dispatch({
            type: `${daoName}/setVisibleFilterName`,
            payload: { reportName, visibleFilterName: null },
        });
    }

    render() {
        const { daoName, control, canSelectOR } = this.props;
        // const EditFrom = DataEdit;
        let filters = null;
        if (this.state.filters) {
            filters = { ...this.state.filters };
        }
        let signsData = controlTypeSigns[control.type];
        if (!signsData) {
            signsData = stringSigns;
        }
        const controls = [];
        let fType = control.type;
        switch (control.type) {
            case 'checkbox-group':
            case 'radio-group':
                fType = 'select';
                break;
            case 'tree-select':
            case 'cascader-select':
                fType = 'tree-select';
                break;
            case 'range-date':
            case 'range-datetime':
            case 'search':
                throw new error(`初始化过滤出错，不支持的控件类型${control.type}！`);
                break;
        }
        if (!filters) return <div>123666</div>;
        for (let i = 0; i < filters.count; i++) {
            const f = filters[i];
            const crName = `cr_${i}`;
            const cvName = `cv_${i}`;
            controls.push({
                name: crName,
                required: false,
                type: 'select',
                label: '条件',
                grid: 10 / 24,
                data: signsData,
                onChange: this.handleSignChange.bind(this, i),
            });
            if (filters[crName] === 'between') {
                if (control.type === 'date') {
                    fType = 'range-date';
                } else if (control.type === 'datetime') {
                    fType = 'range-datetime';
                } else if (control.type === 'month') {
                    fType = 'range-month';
                } else if (control.type === 'checked') {
                    fType = 'range-month';
                } else {
                    fType = 'range-number';
                }
            } else if (filters[crName] === 'null' || filters[crName] === 'empty') {
                fType = 'disabled';
            }
            const fCont = {
                name: cvName,
                required: false,
                type: fType,
                max: control.max,
                label: '选择',
                grid: 14 / 24,
            };
            if (fType === 'select' || fType === 'tree-select') {
                if (control.dataType !== 'bool') {
                    fCont.multiple = true;
                }
                if (control.fetch) {
                    fCont.fetch = control.fetch;
                }
                if (control.data) {
                    fCont.data = control.data;
                }
            }
            controls.push(fCont);
        }
        if (canSelectOR && filters.count > 1) {
            controls.push({
                name: 'sign',
                required: true,
                type: 'radio-group',
                label: '组合关系',
                grid: 24 / 24,
                data: [
                    { value: 'AND', label: '并且' },
                    { value: 'OR', label: '或者' },
                ],
                layout: { labelSpan: 6, wrapperSpan: 16 },
            });
        }
        const buttons = [];
        if (filters.count > 1 || (filters.count > 0 && filters.cv_0)) {
            buttons.push(
                <Button key={0} onClick={this.handleClearFilters.bind(this)}>
                    清除
                </Button>
            );
        }
        buttons.push(
            <Button key={1} onClick={this.handleAddFilters.bind(this)}>
                新增
            </Button>
        );
        if (filters.count > 1) {
            buttons.push(
                <Button key={2} onClick={this.handleDeleteFilters.bind(this)}>
                    减少
                </Button>
            );
        }
        buttons.push(
            <Button key={3} onClick={this.handleSaveFilters.bind(this)}>
                确定
            </Button>
        );
        buttons.push(
            <Button key={4} onClick={this.handleHideFilter.bind(this)}>
                取消
            </Button>
        );

        return (
            <Card title={`${control.label}过滤`} style={{ width: 600 }}>
                <div style={{ maxHeight: 280, overflow: 'auto' }}>
                    <EditFrom
                        ref='filterForm'
                        daoName={daoName}
                        controls={controls}
                        record={filters}
                        selectFirst={false}
                    />
                </div>
                <div style={{ paddingBottom: 20 }}>
                    <ButtonGroup style={{ float: 'right' }}>{buttons}</ButtonGroup>
                </div>
            </Card>
        );
    }
}
FilterItem.propTypes = {
    daoName: PropTypes.string,
    reportName: PropTypes.string,
    control: PropTypes.object,
    canSelectOR: PropTypes.bool,
    filters: PropTypes.object,
    onOk: PropTypes.func,
};
FilterItem.defaultProps = {
    daoName: '',
    reportName: '',
    control: {},
    canSelectOR: true,
    filters: null,
    onOk: null,
};
