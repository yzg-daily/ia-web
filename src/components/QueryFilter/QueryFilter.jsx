/**
 * QueryFilter 页面查询组件
 * @description 组件属性继承EditFrom全部属性。添加isMore属性
 * @param {Boolean} isMore 是否隐藏查询条件。隐藏条件为传入属性controls的length除以2.
 * */
import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import FormTable from '../EditFrom';

const QueryFilter = props => {
    const {
        controls,
        isMore,
        query,
        queryName,
        resetName,
        defaultMAX,
        butList,
        record,
        setForm = form => form,
    } = props;
    // 展示表单数量
    const [max, setMax] = useState(defaultMAX || controls.length / 2);
    // 切换按钮提示
    const [unfold, setUnfold] = useState(false);
    // 更新表单
    const [control, setControl] = useState([]);
    // 获取查询表单属性及方法
    const [queryFilter, setQueryFilter] = useState(null);
    const unfoldMethod = () => {
        const num = !unfold ? controls.length : defaultMAX || controls.length / 2;
        setMax(num);
        setUnfold(!unfold);
        if (isMore) {
            setControl(controls.slice(0, num));
        } else {
            setControl(controls);
        }
    };
    // 清除查询表单数据。
    // 清除数据是存在问题。todo: 如果存在单位查询条件，清空时不能一并清楚，需要手动清除单位查询条件
    const resetQuery = () => {
        queryFilter.props.form.resetFields();
        props?.resetFields && props?.resetFields(queryFilter);
    };
    // 初始化基本数据
    useEffect(() => {
        if (isMore) {
            setControl(controls.slice(0, max));
        } else {
            setControl(controls);
        }
    }, [controls]);
    return (
        <>
            <Row type='flex' justify='start'>
                <Col span={isMore ? 18 : 19}>
                    <FormTable
                        {...props}
                        controls={control}
                        wrappedComponentRef={form => {
                            if (form) {
                                setQueryFilter(form);
                                setForm && setForm(form);
                            }
                        }}
                        record={record}
                    />
                </Col>
                <Col span={isMore ? 6 : 5} className='button-area'>
                    <div className='button-list'>
                        <Button type='primary' onClick={() => query(queryFilter)}>
                            {queryName}
                        </Button>
                        {butList.length ? butList.map(b => b) : null}
                        <Button type='primary' onClick={resetQuery} ghost>
                            {resetName}
                        </Button>
                        {isMore ? (
                            <Button type='link' onClick={unfoldMethod}>
                                <Icon type={unfold ? 'up' : 'down'} />
                                {unfold ? '收起' : '展开'}
                            </Button>
                        ) : null}
                    </div>
                </Col>
            </Row>
        </>
    );
};
QueryFilter.propTypes = {
    controls: PropTypes.array,
    record: PropTypes.object,
    selectFirst: PropTypes.bool,
    clearItemMargin: PropTypes.bool,
    isDisabled: PropTypes.bool,
    loading: PropTypes.bool,
    daoName: PropTypes.string,
    setWdith: PropTypes.object,
    isMore: PropTypes.bool,
    queryName: PropTypes.string,
    resetName: PropTypes.string,
    defaultMAX: PropTypes.number,
    butList: PropTypes.array,
};
QueryFilter.defaultProps = {
    controls: [],
    record: {},
    selectFirst: true,
    clearItemMargin: false,
    isDisabled: false,
    loading: false,
    daoName: '',
    setWdith: {},
    isMore: false,
    queryName: '查询',
    resetName: '清空',
    defaultMAX: 0,
    butList: [],
};

export default QueryFilter;
