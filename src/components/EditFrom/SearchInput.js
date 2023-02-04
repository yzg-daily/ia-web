import React from 'react';
import { AutoComplete, Input } from 'antd';
import PropTypes from 'prop-types';
// import * as commonService from '../../services/CommonCRUD';

const { Option } = AutoComplete;

export default class SearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            value: '',
        };
    }

    componentDidMount() {
        const whereCause = {};
        whereCause.RelationSign = 'OR';
        whereCause.WhereItems = [];
        const { valueTpl, value } = this.props;
        whereCause.WhereItems.push({ FieldName: valueTpl, Operator: '=', FieldValues: value });
        if (value !== '') {
            this.fetch(whereCause);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.value) {
            this.setState({ value: '' });
        }
    }

    getSelectData(value) {
        const { data } = this.state;
        const ID = this.props.valueTpl;
        let selectData;
        if (data && data.length) {
            [selectData] = data.filter(d => d[ID] === (isNaN(+value) ? value : +value));
        }
        return selectData;
    }

    fetch(WhereCause, val) {
        const value = val;
        const whereCause = [WhereCause];
        const { gid, jt, where } = this.props;
        if (Object.keys(where).length) {
            whereCause.push(where);
        }
        const { daoName, optionTpl, permID } = this.props;
        // 集团内部单位查询
        if (daoName === 'WlBaseDwxxForJt') {
            const WhereCause = {};
            WhereCause.RelationSign = 'AND';
            WhereCause.WhereItems = [];
            WhereCause.WhereItems.push({
                FieldName: 'gid',
                Operator: '=',
                FieldValues: gid || sessionStorage.getItem('gid'),
            });
            if (!jt) {
                WhereCause.WhereItems.push({
                    FieldName: 'dwxydm',
                    Operator: 'other',
                    FieldValues: `in(select dwxydm from wl_base_wlgs where jtid=(select jtid from wl_base_wlgs where id=${gid ||
                        sessionStorage.getItem('gid')}))`,
                });
            }
            whereCause.push(WhereCause);
        } else if (daoName === 'WlBaseSjxx') {
            // 司机姓名模糊搜索
            const WhereCause = {};
            WhereCause.RelationSign = 'OR';
            WhereCause.WhereItems = [];
            WhereCause.WhereItems.push({ FieldName: 'cph', Operator: '=', FieldValues: '' });
            WhereCause.WhereItems.push({
                FieldName: 'cid',
                Operator: 'other',
                FieldValues: `in (select id from wl_base_clda where isdd=1 and gid=${sessionStorage.getItem('gid')})`,
            });
            whereCause.push(WhereCause);
            whereCause.push();
        }
        // if (daoName !== 'jtglcgfetch') {
        //     // 通用组件方法
        //     commonService.fetch({ daoName, page: 1, pageSize: 10, sorter: null, filters: whereCause, permID })
        //         .then(res => {
        //             const data = res.Objectlist || [];
        //             if (!value && data.length) {
        //                 this.setState({ value: data[0][optionTpl] });
        //             }
        //             this.setState({ data });
        //         }).catch(err => {
        //             throw new Error(`请求出错: ${err}`)
        //         });
        // } else {
        //     // 集团采购管理
        //     commonService.jtglcgfetchmh({ daoName, gsmcLike: value })
        //         .then(res => {
        //             const data = res || [];
        //             if (!value && data.length) {
        //                 this.setState({ value: data[0][optionTpl] });
        //             }
        //             this.setState({ data });
        //         }).catch(err => {
        //             throw new Error(`请求出错: ${err}`)
        //         });
        // }
        if (daoName === 'tlXSdaoName') {
            // 铁路销售模糊查询
            console.log(value, sessionStorage.getItem('gid'));
            commonService
                .tldwSearch({ daoName, hz: value, gid: `${sessionStorage.getItem('gid')}`, othero })
                .then(res => {
                    const data = res || [];
                    if (!value && data.length) {
                        this.setState({ value: data[0][optionTpl] });
                    }
                    this.setState({ data });
                })
                .catch(err => {
                    throw new Error(`请求出错: ${err}`);
                });
        }
    }

    handleChange(value) {
        const { daoName, optionTpl, gid, searchColumns } = this.props;
        const whereCause = {};
        if (optionTpl === 'cpid' && daoName === 'WlBaseClda' && value) {
            this.handleSelect(value);
        }
        this.setState({ value });
        whereCause.RelationSign = 'OR';
        whereCause.WhereItems = [];
        let sc = searchColumns;
        if (!sc) {
            sc = [optionTpl];
        }
        sc.map(c => whereCause.WhereItems.push({ FieldName: c, Operator: 'like', FieldValues: value }));
        if (
            daoName !== 'WlBaseClda' &&
            daoName !== 'WlBaseClda0' &&
            daoName !== 'TlBaseJhxx' &&
            daoName !== 'WlBaseSjxx' &&
            daoName !== 'GxBaseCgzx' &&
            daoName !== 'WlBaseCzyxx' &&
            daoName !== 'TlBaseZtxxc'
        ) {
            whereCause.WhereItems.push({ FieldName: 'pyjc', Operator: 'like', FieldValues: value });
        }
        if (daoName === 'WlBaseSjxx') {
            whereCause.RelationSign = 'AND';
            whereCause.WhereItems.push({
                FieldName: 'gid',
                Operator: '=',
                FieldValues: gid || sessionStorage.getItem('gid'),
            });
        }
        if (daoName === 'GxBaseCgzx') {
            whereCause.RelationSign = 'AND';
            whereCause.WhereItems.push({
                FieldName: 'gid',
                Operator: '=',
                FieldValues: gid || sessionStorage.getItem('gid'),
            });
        }
        // if (daoName === 'WlBaseWlgs') {
        //     whereCause.RelationSign = "AND";
        //     whereCause.WhereItems.push({ FieldName: 'sts', Operator: '=', FieldValues:'1' });
        // }
        if (daoName === 'WlBaseClda0') {
            whereCause.RelationSign = 'AND';
            whereCause.WhereItems.push(
                {
                    FieldName: 'gid',
                    Operator: '=',
                    FieldValues: gid || sessionStorage.getItem('gid'),
                },
                { FieldName: 'sts', Operator: '=', FieldValues: '1' },
                { FieldName: 'isdd', Operator: '=', FieldValues: '1' }
            );
        }
        if (daoName === 'WlBaseCzyxx') {
            whereCause.RelationSign = 'AND';
            whereCause.WhereItems.push({
                FieldName: 'gid',
                Operator: 'other',
                FieldValues: `in (select id from wl_base_wlgs where jtid in (select jtid from wl_base_wlgs where id=${gid ||
                    sessionStorage.getItem('gid')}))`,
            });
        }

        if (value) {
            this.fetch(whereCause, value);
        }
    }

    handleSelect(value) {
        this.props.onChange(value);
        this.props.onSelect(value);
    }

    render() {
        const { valueTpl, optionTpl, placeholder, disabled } = this.props;
        const { data, value } = this.state;
        return (
            <AutoComplete
                dataSource={data.map(d => (
                    <Option key={d[valueTpl]} value={`${d[valueTpl]}`} text={d[optionTpl]}>
                        {d[optionTpl]}
                    </Option>
                ))}
                style={{ width: 200 }}
                onChange={this.handleChange.bind(this)}
                onSelect={this.handleSelect.bind(this)}
                disabled={disabled}
                optionLabelProp='text'
                value={value}
            >
                <Input placeholder={placeholder} />
            </AutoComplete>
        );
    }
}

SearchInput.propTypes = {
    daoName: PropTypes.string,
    valueTpl: PropTypes.string,
    optionTpl: PropTypes.string,
    searchColumns: PropTypes.array,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
    where: PropTypes.object,
};
SearchInput.defaultProps = {
    placeholder: '请输入...',
    where: {},
    daoName: '',
    valueTpl: '',
    optionTpl: '',
    searchColumns: [],
    onChange: h => h,
    onSelect: h => h,
};
