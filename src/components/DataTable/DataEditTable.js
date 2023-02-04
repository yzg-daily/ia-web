import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { message, Table, Pagination, Modal, Dropdown, Button, Menu, Checkbox, Tooltip, Icon } from 'antd';
import DataEdit from '../EditFrom/index';
import * as common from '../../utils/common';
import * as validate from '../../utils/validation';

class DataEditTable extends React.Component {
    constructor(props) {
        super(props);
        let colIds = {};
        this.props.columns.map((c, i) => (colIds[i] = c.dispaly ? true : false));
        const count = this.props.dataSource.length;
        this.state = {
            datas: this.props.dataSource,
            showColumnIds: colIds,
            visibleItemsMenu: false,
            currentPage: 1,
            pageSize: 20,
            total: count,
            selectedRowKeys: [],
            delDatas: [],
            newIndex: 0,
            rowIndex: -1,
            colIndex: -1,
            cellChange: false,
            editChange: false,
            submit: true,
            sorter: null,
            adding: false,
            editable: false,
        };
    }
    componentWillReceiveProps(nextProps) {
        const l1 = nextProps.dataSource.length;
        const l2 = this.props.dataSource.length;
        if (l1 !== l2 || nextProps.reload) {
            this.setState({
                datas: nextProps.dataSource,
                total: l1,
                submit: true,
                selectedRowKeys: [],
                delDatas: [],
                newIndex: 0,
                rowIndex: -1,
                colIndex: -1,
                cellChange: false,
                editChange: false,
            });
        }
    }
    componentDidUpdate() {
        let dataTable = ReactDOM.findDOMNode(this.refs.dataTable);
        if (this.state.adding) {
            let div = dataTable.querySelector('div.ant-table-body');
            if (!div) {
                return;
            }
            div.scrollLeft = 0;
            div.scrollTop = div.scrollHeight;
            this.state.adding = false;
        }
    }
    selectChangeHandler(selectedRowKeys) {
        this.saveEditForm();
        this.setState({ selectedRowKeys, rowIndex: -1, colIndex: -1 });
    }
    rowClickHandler(d, i, e) {
        return {
            onClick: () => {
                let rowChange = false;
                if (this.state.rowIndex !== i) {
                    this.saveEditForm();
                    this.state.rowIndex = i;
                    rowChange = true;
                }
                const cellChange = this.state.cellChange;
                if (rowChange || cellChange) {
                    this.setState({ cellChange: false });
                }
            },
        };
    }
    pageChangeHandler(page) {
        this.saveEditForm();
        this.setState({ currentPage: page, rowIndex: null, colIndex: null });
    }
    pageSizeChangeHandler(e) {
        const pageSize = Number(e.key);
        let page = this.state.currentPage;
        let total = this.state.total;
        const lastPage = Math.ceil(parseFloat(total) / parseFloat(pageSize));
        if (page > lastPage) {
            page = lastPage;
        }
        this.saveEditForm();
        this.setState({ pageSize, currentPage: page, rowIndex: null, colIndex: null });
    }
    itemChangeHandler(i, e) {
        const checked = e.target.checked;
        this.state.showColumnIds[i] = checked;
        this.setState({});
    }
    handleVisibleChange(flag) {
        this.setState({ visibleItemsMenu: flag });
    }
    handleCellClick(j) {
        return {
            onClick: () => {
                if (this.state.colIndex !== j) {
                    this.saveEditForm();
                    this.state.cellChange = true;
                    this.state.colIndex = j;
                }
            },
        };
    }
    isEditValid() {
        let datas = this.state.datas;
        let isOk = true;
        for (let i = 0; i < datas.length; i++) {
            if (datas[i].$attachIfnos && datas[i].$attachIfnos.length > 0) {
                isOk = false;
                break;
            }
        }
        return isOk;
    }
    acceptChange() {
        this.saveEditForm();
    }
    saveEditForm() {
        if (!this.state.editChange) {
            return;
        }
        const { rowIndex, currentPage, pageSize, colIndex } = this.state;
        const columns = this.props.columns;
        const name = columns[colIndex].key;
        const dataIndex = pageSize * (currentPage - 1) + rowIndex;
        let data = this.state.datas[dataIndex];
        const form = this.editForm.getForm();
        form.validateFields((err, values) => {
            let cellValue = null;
            if (typeof values[name] === 'string') {
                cellValue = values[name];
            } else if (typeof values[name] === 'object') {
                cellValue = values[name].key;
            }
            if (err) {
                data[name] = cellValue;
                const errs = err[name].errors;
                if (!data.$attachIfnos) {
                    data.$attachIfnos = [];
                }
                errs.map(e =>
                    data.$attachIfnos.push({
                        ColIndex: colIndex,
                        Kind: 'danger',
                        Message: e.message,
                    })
                );
            } else {
                const cont = this.getControl(name);
                if (cont.dataType === 'number') {
                    cellValue = Number(cellValue);
                } else if (cont.dataType === 'date' || cont.dataType === 'datetime') {
                    cellValue = !cellValue ? null : new Date(cellValue);
                }
                data[name] = cellValue;
                if (data.$attachIfnos) {
                    data.$attachIfnos = data.$attachIfnos.filter(info => info.ColIndex !== colIndex);
                }
            }
            if (!data.$state) {
                data.$state = 2;
            }
            this.state.editChange = false;
        });
    }
    handleEditChange(value, label) {
        this.state.editChange = true;
        this.state.submit = false;
        let cellValue = null,
            cellLabel = null;
        if (typeof value === 'string') {
            cellValue = value;
        } else if (typeof value === 'object') {
            if (typeof value.key !== 'string') {
                return;
            }
            cellValue = value.key;
            cellLabel = value.label;
        }
        if (cellValue === null) {
            return;
        }
        if (label instanceof Array) {
            cellLabel = label[0];
        }
        const { rowIndex, currentPage, pageSize, colIndex } = this.state;
        const columns = this.props.columns;
        const name = columns[colIndex].key;
        const dataIndex = pageSize * (currentPage - 1) + rowIndex;
        let data = this.state.datas[dataIndex];
        data[name] = cellValue;
        if (cellLabel !== null) {
            const caption = columns[colIndex].caption;
            if (!caption) {
                throw new Error(`columns中的！${name}必须指定caption！`);
            }
            const keys = caption.split('.');
            if (keys.length !== 2) {
                throw new Error(`columns中的！${name}指定caption必须是“xxx.xxx”的形式！`);
            }
            data[keys[0]][keys[1]] = cellLabel;
        }
    }
    handleTableChange(_, filters2, sorter) {
        this.setState({ sorter });
    }
    getAllData() {
        this.saveEditForm();
        return this.state.datas;
    }
    getControl(name) {
        const controls = this.props.controls;
        let cont = null;
        for (let i = 0; i < controls.length; i++) {
            if (controls[i].name === name) {
                cont = controls[i];
                break;
            }
        }
        if (!cont) {
            throw new Error(`在controls列表中不存在${name}！`);
        }
        if (cont.multiple) {
            throw new Error(`DataEditTable组件暂时不支持控件${name}的属性为multiple！`);
        }
        if (cont.type === 'cascader-select' || cont.type === 'checkbox-group') {
            cont.type = 'tree-select';
        }
        if (cont.type === 'select' && cont.valueTpl !== 'label') {
            cont.labelInValue = true;
        }
        return cont;
    }
    addData() {
        let { datas, total, pageSize, newIndex } = this.state;
        const columns = this.props.columns;
        const keyName = this.props.keyName;
        newIndex++;
        total++;
        const currentPage = Math.ceil(parseFloat(total) / parseFloat(pageSize));
        let data = { [keyName]: `new_${newIndex}`, $state: 1, $attachIfnos: [] };
        columns.map((c, i) => {
            if (c.caption) {
                const keys = c.caption.split('.');
                data[keys[0]] = {};
            }
            const attachIfno = this.getAttachIfnos(i, undefined);
            if (attachIfno !== null) {
                data.$attachIfnos.push(attachIfno);
            }
        });
        datas.push(data);
        this.state.submit = false;
        this.saveEditForm();
        const rowIndex = total - pageSize * (currentPage - 1) - 1;
        this.setState({ datas, currentPage, newIndex, total, adding: true, rowIndex, colIndex: 0 });
    }
    getAttachIfnos(colIndex, value) {
        const { columns, controls } = this.props;
        const name = columns[colIndex].key;
        let cont = null;
        for (let i = 0; i < controls.length; i++) {
            if (controls[i].name === name) {
                cont = controls[i];
                break;
            }
        }
        if (cont === null) {
            return null;
        }
        let valType = 'string';
        let newVal = value;
        if (cont.multiple) {
            valType = 'array';
            if (!cont.sep) {
                cont.sep = ',';
            }
            newVal = value.join(cont.sep);
        } else if (cont.dataType === 'number') {
            valType = 'number';
        }
        let formData = {};
        if (cont.validator) {
            formData = this.props.form.getFieldsValue();
        }
        const ret = validate.validate(value, valType, { ...cont, formData });
        if (ret === true) {
            return null;
        } else {
            return {
                ColIndex: colIndex,
                Kind: 'danger',
                Message: ret,
            };
        }
    }
    getSelectedRowKeys() {
        return [...this.state.selectedRowKeys];
    }
    deleteData() {
        const keys = this.state.selectedRowKeys;
        const keyName = this.props.keyName;
        const len = keys.length;
        if (len === 0) {
            message.info('请选择要删除的行！');
            return;
        }
        this.saveEditForm();
        Modal.confirm({
            title: '提示',
            content: `你确认要删除选中的${len}行数据吗？`,
            okText: '删除',
            cancelText: '取消',
            onOk: () => {
                let datas = this.state.datas;
                let total = this.state.total;
                let indexs = [];
                datas.map((d, k) => {
                    for (let i = 0; i < keys.length; i++) {
                        if (d[keyName] === keys[i]) {
                            indexs.push(k);
                            total--;
                        }
                    }
                });
                let delDatas = this.state.delDatas;
                for (let j = indexs.length - 1; j >= 0; j--) {
                    const k = indexs[j];
                    if (datas[k].$state !== 1) {
                        delDatas.push(datas[k]);
                    }
                    datas.splice(k, 1);
                }
                this.state.submit = false;
                let page = this.state.currentPage;
                const pageSize = this.state.pageSize;
                const lastPage = Math.ceil(parseFloat(total) / parseFloat(pageSize));
                if (page > lastPage) {
                    page = lastPage;
                }
                if (page === 0) {
                    page = 1;
                }
                if (this.props.onDelete) {
                    this.props.onDelete(delDatas);
                }
                if (this.state.canSubmit) {
                    delDatas = [];
                }
                this.setState({ datas, total, selectedRowKeys: [], currentPage: page, delDatas });
            },
        });
    }
    submitData() {
        this.saveEditForm();
        if (!this.isEditValid()) {
            message.error('数据没有通过有效性验证，请修改！');
            return;
        }
        const { datas, delDatas } = this.state;
        const daoName = this.props.daoName;
        if (this.state.submit) {
            message.info('没有发现数据更改！');
            return;
        }
        const onSubmit = this.props.onSubmit;
        if (onSubmit) {
            onSubmit(datas, delDatas);
        } else {
            message.error('必须指定提交触发的函数！');
        }
    }
    exportData() {
        let { columns, sorter, daoName } = this.props;
        let columnHeaders = [];
        columns.map((c, j) => {
            if (!this.state.showColumnIds[j]) {
                return;
            }
            const name = c.dataIndex ? c.dataIndex : c.caption;
            if (!name) {
                throw new Error(`列"${c.title}"没有配置caption或dataIndex，请修改！`);
            }
            let header = {
                Name: name,
                Caption: c.title,
                Width: c.width,
            };
            columnHeaders.push(header);
        });
        let form = document.createElement('form'); //定义一个form表单
        const orderItems = common.sorterToOrderItems(sorter);
        form.style = 'display:none';
        form.target = '_blank';
        form.method = 'post';
        form.action = '/api/ExportXlsx/' + daoName;
        let input2 = document.createElement('input');
        input2.type = 'hidden';
        input2.name = 'OrderItems';
        input2.value = JSON.stringify(orderItems);
        let input3 = document.createElement('input');
        input3.type = 'hidden';
        input3.name = 'ColumnHeaders';
        input3.value = JSON.stringify(columnHeaders);
        document.body.appendChild(form); //将表单放置在web中
        form.appendChild(input2);
        form.appendChild(input3);
        form.submit();
        document.body.removeChild(form);
    }
    renderColumns(text, record, rowIndex, colIndex, render) {
        let retText = text;
        if (this.state.rowIndex === rowIndex && this.state.colIndex === colIndex) {
            const { daoName, controls, columns } = this.props;
            const name = columns[colIndex].key;
            let cont = this.getControl(name);
            cont.layout = { labelSpan: 0, wrapperSpan: 24 };
            cont.label = '';
            cont.grid = 24 / 24;
            cont.onChange = this.handleEditChange.bind(this);
            return (
                <DataEdit
                    ref={editForm => (this.editForm = editForm)}
                    daoName={daoName}
                    controls={[cont]}
                    record={record}
                />
            );
        } else if (render instanceof Function) {
            retText = render(text, record, rowIndex);
        }
        return this.getAttachContent(rowIndex, colIndex, retText, record.$attachIfnos);
    }
    getAttachContent(rowIndex, colIndex, content, attachIfnos) {
        let ai = null;
        if (attachIfnos) {
            attachIfnos.forEach(a => {
                if (a.ColIndex === colIndex) {
                    ai = a;
                }
            });
        }
        if (!ai) {
            return content;
        }
        let { Kind, Message } = ai;
        let color = '#5bc0de';
        if (Kind === 'warning') {
            color = '#f0ad4e';
        } else if (Kind === 'danger') {
            color = '#d9534f';
        }
        return (
            <div style={{ cursor: 'pointer' }}>
                <Tooltip placement='topLeft' title={Message} arrowPointAtCenter>
                    <Icon type='exclamation-circle' style={{ color: color, float: 'right' }} />
                </Tooltip>
                <span>{content}</span>
            </div>
        );
    }
    getDataSource() {
        const { datas, currentPage, pageSize } = this.state;
        const sorter = this.state.sorter;
        if (sorter) {
            const fName = sorter.field ? sorter.field : sorter.columnKey;
            let sortFunc = (a, b) => a[fName] > b[fName];
            if (sorter.order === 'descend') {
                sortFunc = (a, b) => a[fName] < b[fName];
            }
            datas.sort(sortFunc);
        }
        let dataSource = [];
        const start = pageSize * (currentPage - 1);
        const end = start + pageSize - 1;
        for (let i = start; i < datas.length; i++) {
            if (i > end) {
                break;
            }
            dataSource.push(datas[i]);
        }
        return dataSource;
    }
    render() {
        const ButtonGroup = Button.Group;
        const { columns, width, height, bordered, size, loading, keyName } = this.props;
        let x = width,
            y = height;
        if (width === 0) {
            columns.map(c => {
                x = x + (c.width ? c.width : 100);
            });
        }
        let cols = [];
        let items = [];
        const colIds = this.state.showColumnIds;
        let checked = false;
        columns.map((c, i) => {
            checked = this.state.showColumnIds[i];
            items.push(
                <Menu.Item key={i}>
                    <Checkbox checked={checked} onChange={this.itemChangeHandler.bind(this, i)}>
                        {c.title}
                    </Checkbox>
                </Menu.Item>
            );
            if (colIds[i]) {
                c.onCell = this.handleCellClick.bind(this, i);
                if (c.canEdit) {
                    let nc = { ...c };
                    nc.render = (text, record, index) => this.renderColumns(text, record, index, i, c.render);
                    cols.push(nc);
                } else {
                    cols.push(c);
                }
            }
        });
        const menu = <Menu>{items}</Menu>;
        const menu2 = (
            <Menu onClick={this.pageSizeChangeHandler.bind(this)}>
                <Menu.Item key='10'>每页显示10行</Menu.Item>
                <Menu.Item key='20'>每页显示20行</Menu.Item>
                <Menu.Item key='30'>每页显示30行</Menu.Item>
                <Menu.Item key='40'>每页显示40行</Menu.Item>
                <Menu.Item key='50'>每页显示50行</Menu.Item>
            </Menu>
        );
        let buttons = [];
        const { canAdd, canDelete, canExport, canSubmit, footer } = this.props;
        if (canAdd) {
            buttons.push(
                <Button key='b_addData' onClick={this.addData.bind(this)}>
                    新增
                </Button>
            );
        }
        if (canDelete) {
            buttons.push(
                <Button key='b_delteData' onClick={this.deleteData.bind(this)}>
                    删除
                </Button>
            );
        }
        if (canSubmit) {
            buttons.push(
                <Button key='b_submitData' onClick={this.submitData.bind(this)}>
                    提交
                </Button>
            );
        }
        if (canExport) {
            buttons.push(
                <Button key='b_exportData' onClick={this.exportData.bind(this)}>
                    导出EXCEL
                </Button>
            );
        }
        let buttonGroup = '';
        if (buttons.length > 0) {
            buttonGroup = <ButtonGroup style={{ margin: 5 }}>{buttons}</ButtonGroup>;
        }
        const { selectedRowKeys, total, currentPage, pageSize } = this.state;
        const dataSource = this.getDataSource();
        const footerStyles = {
            display: footer ? 'block' : 'none',
        };
        let rowSelection = null;
        if (this.props.multiSelect) {
            rowSelection = { selectedRowKeys, onChange: this.selectChangeHandler.bind(this) };
        }
        return (
            <div>
                <Table
                    ref='dataTable'
                    columns={cols}
                    dataSource={dataSource}
                    loading={loading}
                    onRow={this.rowClickHandler.bind(this)}
                    rowKey={record => record[keyName]}
                    scroll={{ x, y }}
                    bordered={bordered}
                    rowSelection={rowSelection}
                    pagination={false}
                    size={size}
                    onChange={this.handleTableChange.bind(this)}
                />
                <div style={footerStyles}>
                    <Dropdown overlay={menu2} trigger={['click']}>
                        <Button type='ghost' style={{ margin: 5 }}>
                            每页显示{pageSize}行 <Icon type='down' />
                        </Button>
                    </Dropdown>
                    <Dropdown
                        overlay={menu}
                        trigger={['click']}
                        onVisibleChange={this.handleVisibleChange.bind(this)}
                        visible={this.state.visibleItemsMenu}
                    >
                        <Button type='ghost' style={{ margin: 5 }}>
                            显示项目 <Icon type='down' />
                        </Button>
                    </Dropdown>
                    {buttonGroup}
                    &nbsp;&nbsp;共计&nbsp;<font>{total}</font>&nbsp;行
                    <Pagination
                        style={{ margin: '10px 10px' }}
                        className='ant-table-pagination'
                        total={total}
                        current={currentPage}
                        pageSize={pageSize}
                        onChange={this.pageChangeHandler.bind(this)}
                    />
                </div>
            </div>
        );
    }
}
DataEditTable.propTypes = {
    daoName: PropTypes.string,
    columns: PropTypes.array,
    dataSource: PropTypes.array,
    keyName: PropTypes.string,
    controls: PropTypes.array,
    width: PropTypes.number,
    height: PropTypes.number,
    bordered: PropTypes.bool,
    size: PropTypes.string,
    canAdd: PropTypes.bool,
    canDelete: PropTypes.bool,
    canExport: PropTypes.bool,
    canSubmit: PropTypes.bool,
    onSubmit: PropTypes.func,
    loading: PropTypes.bool,
    reload: PropTypes.bool,
    onDelete: PropTypes.func,
    footer: PropTypes.bool,
    multiSelect: PropTypes.bool,
};
DataEditTable.defaultProps = {
    columns: [],
    dataSource: [],
    keyName: 'id',
    controls: [],
    width: 0,
    height: 520,
    bordered: true,
    size: 'middle',
    canAdd: false,
    canDelete: false,
    canExport: false,
    loading: false,
    reload: false,
    canSubmit: false,
    footer: true,
    multiSelect: false,
};
export default DataEditTable;
