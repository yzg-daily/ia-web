import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Pagination, Button, Select } from 'antd';
import { getWidth } from '../../utils/utils';
import PropTypes from 'prop-types';
import css from './index.less';
const { Option } = Select;

const { dispatch } = window.g_app._store;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    getInput = () => {
        const {
            required,
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            children,
            onChange,
            ...restProps
        } = this.props;
        if (this.props.dataIndex === 'number') {
            return <InputNumber />;
        } else if (this.props.dataIndex === 'materialBrand') {
            var arr = [];
            const res = children.filter(el => Boolean(el))[0];
            if (typeof res === 'object') {
                arr = [];
            } else {
                arr = res?.split(',');
            }
            return (
                <Select mode='tags' value={arr} tokenSeparators={[',']} allowClear={true} open={false}>
                    {arr?.map((el, index) => {
                        if (el) {
                            return <Option key={el}>{el}</Option>;
                        } else {
                            return arr;
                        }
                    })}
                </Select>
            );
        }
        return <Input />;
    };

    renderCell = ({ getFieldDecorator }) => {
        const { required, editing, dataIndex, title, inputType, record, index, children, ...restProps } = this.props;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item style={{ margin: 0 }}>
                        {getFieldDecorator(dataIndex, {
                            rules: [
                                {
                                    required: required,
                                    message: `请输入${title}!`,
                                },
                            ],
                            initialValue: record[dataIndex],
                        })(this.getInput())}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { editingKey: '', selectedRowKeys: [], selectedRow: [], showSerialNumber: true };
    }

    isEditing = record => {
        const { unique } = this.props;
        return record[unique] === this.state.editingKey;
    };
    edit(key) {
        const { editMthod = v => v } = this.props;
        this.setState({ editingKey: key });
        editMthod(key);
    }
    cancel = () => {
        this.setState({ editingKey: '' });
        const { editMthod = v => v } = this.props;
        editMthod('');
    };
    all = (form, ID) => {
        const { save, deleteEdit } = this.props;
        save(form, ID);
        this.setState({ editingKey: '' });
    };
    allDelete = ID => {
        const { save, deleteEdit } = this.props;
        deleteEdit(ID);
        this.setState({ editingKey: '' });
    };

    // 设置选择数据获取当前选择表单uuid/id
    onSelectChange = selectedRowKeys => {
        const { model } = this.props;
        dispatch({
            type: `${model}/setSelectedRowKeys`,
            payload: { selectedRowKeys },
        });
        this.setState({ selectedRowKeys: selectedRowKeys });
    };
    // 选中后激活样式
    rowClassName = record => {
        const { unique } = this.props;
        const { selectedRowKeys } = this.state;
        if (!this.props?.multiSelect) {
            if (record[unique] === selectedRowKeys[0]) return `${css['selected-row-dye']}`;
        }

        return ``;
    };
    // 设置选择数据获取当前一条表单
    onSelectChanges = selectedRow => {
        const { model } = this.props;
        dispatch({
            type: `${model}/setSelectedRow`,
            payload: { selectedRow },
        });
        this.setState({ selectedRow: selectedRow });
    };

    // 改变显示条数后刷新页面
    onShowSizeChange = (current, pageSize) => {
        const { turnPage } = this.props;
        return () => turnPage(current, pageSize);
    };
    calculatePageSize = (size, pageCount = 5) => {
        const num = [];
        let index = 0;
        do {
            num.push(`${index * size}`);
            index++;
        } while (index < pageCount);
        return num;
    };
    Footer = () => {
        const { turnPage, size, page, total } = this.props;
        // 每页显示多少条
        const pageSize = this.calculatePageSize(page, size);
        return (
            <div className='ant-table-footer'>
                <Pagination
                    showSizeChanger
                    defaultPageSize={size}
                    onShowSizeChange={this.onShowSizeChange}
                    onChange={(page, pageSize) => turnPage(page, pageSize)}
                    current={page}
                    total={total}
                    size={pageSize}
                />
            </div>
        );
    };

    render() {
        const { selectedRowKeys } = this.state;
        const {
            unique,
            columns,
            list,
            save = v => v, //保存
            deleteEdit = v => v, // 移除
            tableSize = 'small',
            filterMultiple = false,
            model,
            title,
            showSerialNumber = true,
            sequence = true,
            page = 1,
            size = 20,
            turnPage = v => v,
            pagination = true,
            scrollH = 0,
            addRow = false,
            handleAdd = v => v,
            footer = false,
            footerContent = v => v,
        } = this.props;
        let newDataSource = [];
        if (showSerialNumber) {
            newDataSource = list.length
                ? list.map((item, index) => {
                      const el = item;
                      el.$serialNumber = page > 1 ? (page - 1) * size + (index + 1) : index + 1;
                      return el;
                  })
                : [];
        }

        // 表单选择
        const goodsTableProps = {
            title: title ? () => title : null,
            onRow: val => ({
                onClick: () => {
                    this.onSelectChange([val[unique]]);
                    this.onSelectChanges(val);
                },
            }),
        };
        // 表单是否多选
        let rowSelection;
        if (filterMultiple) {
            rowSelection = {
                selectedRowKeys,
                onChange: selectedRowKeys => this.onSelectChange(selectedRowKeys),
            };
        }
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        const fixed = {
            title: '操作',
            dataIndex: 'operation',
            width: 80,
            dispaly: true,
            render: (text, record) => {
                const { unique } = this.props;
                const singleID = record[unique];
                const { editingKey } = this.state;
                const editable = this.isEditing(record);
                return editable ? (
                    <span>
                        <EditableContext.Consumer>
                            {form => (
                                <a onClick={() => this.all(form, singleID)} style={{ marginRight: 4 }}>
                                    保存
                                </a>
                            )}
                        </EditableContext.Consumer>
                        <Popconfirm title='确定取消？' onConfirm={this.cancel}>
                            <a>取消</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <>
                        <a disabled={editingKey !== ''} onClick={() => this.edit(singleID)}>
                            编辑
                        </a>
                        <a disabled={editingKey !== ''} onClick={() => this.allDelete(singleID)} className={css.delte}>
                            移除
                        </a>
                    </>
                );
            },
        };

        let col = columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    key: col.key,
                    dispaly: col.dispaly,
                    editing: this.isEditing(record),
                    required: col.required,
                }),
            };
        });
        if (sequence) {
            col.unshift({ title: '序号', key: '$serialNumber', dataIndex: '$serialNumber', width: 50, dispaly: true });
        }
        return (
            <EditableContext.Provider value={this.props.form}>
                <div className={`${css.warp} table-warp`}>
                    {/* {Header(props)} */}
                    <div className={css.body}>
                        <Table
                            size={tableSize}
                            rowSelection={rowSelection}
                            components={components}
                            bordered
                            dataSource={newDataSource}
                            columns={[...col, fixed]}
                            rowKey={record => record[unique]}
                            rowClassName={this.rowClassName}
                            pagination={false}
                            // scroll={{ ...getWidth(columns), y: scrollH }}
                            scroll={{ x: 0, y: scrollH }}
                            {...goodsTableProps}
                            footer={footer ? () => footerContent() : null}
                        />
                        {addRow && (
                            <a onClick={() => handleAdd(list.length)} style={{ marginLeft: 10 }}>
                                +添加
                            </a>
                        )}
                    </div>
                    {pagination ? this.Footer() : ''}
                </div>
            </EditableContext.Provider>
        );
    }
}

const EditableFormTable = Form.create()(EditableTable);
export default EditableFormTable;
