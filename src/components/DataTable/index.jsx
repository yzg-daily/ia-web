/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { Pagination, Table } from 'antd';
import PropTypes from 'prop-types';
import { getWidth } from '../../utils/utils';
import css from './index.less';

const { dispatch } = window.g_app._store;
const Header = props => {
    if (props.head) {
        return (
            <div className={css.header}>
                <h3>{props.head}</h3>
            </div>
        );
    }
    return null;
};

const calculatePageSize = (size, pageCount = 5) => {
    const num = [];
    let index = 0;
    do {
        num.push(`${index * size}`);
        index++;
    } while (index < pageCount);
    return num;
};
const TableData = props => {
    const {
        columns,
        loading,
        title,
        model,
        filterMultiple,
        size,
        total,
        unique,
        showSerialNumber,
        turnPage,
        page,
        dataSource,
    } = props;
    const [...list] = dataSource;
    const [...col] = columns;
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    // 设置选择数据获取当前选择表单uuid/id
    const onSelectChange = (selectedRowKeys, selectedRows, index) => {
        dispatch({
            type: `${model}/setSelectedRowKeys`,
            payload: { selectedRowKeys },
        });

        setSelectedRowKeys(selectedRowKeys);
        props?.onSelectChange?.(selectedRowKeys, selectedRows, index);
    };
    // 表单选择
    const goodsTableProps = {
        title: title ? () => title : null,
        onRow: (val, index) => ({
            onClick: () => {
                onSelectChange([val[unique]], [val], index);
            },
        }),
    };
    // 选中后激活样式
    const rowClassName = record => {
        const rowKeys = selectedRowKeys;
        const rowKey = record[unique];
        if (rowKeys && !rowKeys.length) return '';
        if (rowKeys[0] === rowKey) return `${css['selected-row']}`;
        return '';
    };
    // 查询清空 选中数据
    useEffect(() => {
        setSelectedRowKeys([]);
    }, [dataSource]);

    // 表单是否多选
    let rowSelection;
    // 每页显示多少条
    const pageSize = calculatePageSize(page, size);
    // 改变显示条数后刷新页面
    const onShowSizeChange = (current, pageSize) => turnPage(current, pageSize);

    const Footer = () => (
        <div className='ant-table-footer'>
            <Pagination
                showSizeChanger
                pageSize={size}
                onShowSizeChange={onShowSizeChange}
                onChange={(page, pageSize) => turnPage(page, pageSize)}
                current={page}
                total={total}
                size={pageSize}
            />
        </div>
    );
    if (filterMultiple) {
        rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows, index) => onSelectChange(selectedRowKeys, selectedRows, index),
        };
    }
    let newDataSource = [];
    if (showSerialNumber) {
        newDataSource = list.length
            ? list.map((item, index) => {
                  const el = item;
                  el.$serialNumber = page > 1 ? (page - 1) * size + (index + 1) : index + 1;
                  return el;
              })
            : [];
        col.unshift({ title: '序号', key: '$serialNumber', dataIndex: '$serialNumber', width: 50, dispaly: true });
    }
    return (
        <div className={`${css.warp} table-warp`}>
            {Header(props)}
            <div className={css.body}>
                <Table
                    id={props.id}
                    bordered
                    size='small'
                    pagination={false}
                    columns={col}
                    title={title ? () => title : null}
                    dataSource={newDataSource}
                    rowSelection={rowSelection}
                    rowKey={record => record[unique]}
                    loading={loading ? { tip: '数据查询中...' } : false}
                    scroll={{ ...getWidth(columns) }}
                    rowClassName={record => rowClassName(record)}
                    {...goodsTableProps}
                />
            </div>
            {total > newDataSource.length ? Footer(list, size) : null}
        </div>
    );
};

TableData.propTypes = {
    list: PropTypes.array,
    columns: PropTypes.array,
    multiSelect: PropTypes.bool,
    size: PropTypes.number,
    total: PropTypes.number,
    type: PropTypes.number,
    loading: PropTypes.bool,
    title: PropTypes.string,
    head: PropTypes.string,
    route: PropTypes.string,
    model: PropTypes.string,
    operation: PropTypes.string,
    unique: PropTypes.string,
    filterMultiple: PropTypes.bool,
    isJump: PropTypes.bool,
    userCenter: PropTypes.bool,
    showSerialNumber: PropTypes.bool,
    page: PropTypes.number,
    canPages: PropTypes.bool,
    turnPage: PropTypes.func,
};
TableData.defaultProps = {
    list: [],
    columns: [],
    size: 10,
    total: 0,
    type: 0,
    loading: false,
    route: '',
    title: '',
    head: '',
    model: '',
    operation: '',
    unique: 'uuid',
    filterMultiple: false,
    isJump: true,
    userCenter: false,
    showSerialNumber: true,
    page: 1,
    canPages: true,
    // 翻页控制
    turnPage: h => h,
};

export default TableData;
