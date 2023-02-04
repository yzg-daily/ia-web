import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Modal } from 'antd';
import DataTable from '@/components/DataTable';
import EditFrom from '@/components/EditFrom';

const model = 'BaseModels';
@connect(({ BaseModels, loading }) => ({
    publicData: BaseModels,
    loading: loading.models.BaseModels,
}))
class Silo extends Component {
    constructor(...props) {
        super(...props);
        this.state = {
            isPosition: false,
            data: {},
            dwxydm: '',
        };
    }

    componentDidMount() {
        const { publicData, dispatch } = this.props;
        const { selectedRowKeys, unitSetList } = publicData;
        const current = unitSetList.find(item => item.id === selectedRowKeys[0]);
        const { dwxydm } = current;
        dispatch({
            type: `${model}/unitSetSilo`,
            payload: {
                model: 'searchListTccw',
                sccode: dwxydm,
                query: true,
            },
        });
        this.setState({
            dwxydm,
        });
    }

    // 仓位编辑按钮  关闭
    handleCancel = () => {
        const { onCancel } = this.props;
        this.props.dispatch({
            type: `${model}/setSelectedRowKeys`,
            payload: { selectedRowKeys: [] },
        });
        onCancel && onCancel();
    };

    // 仓位编辑Modal 新增 修改
    positionNew = isEdit => {
        const { publicData } = this.props;
        const { unitSetSiloList, selectedRowKeys } = publicData;
        let key = null;
        if (!isEdit) {
            const len = selectedRowKeys.length;
            key = selectedRowKeys[len - 1];
            if (len === 0) {
                message.info('请选择要编辑的行！');
                return;
            }
            if (unitSetSiloList && unitSetSiloList.length) {
                unitSetSiloList.forEach((a, i) => {
                    if (a.id === key) {
                        this.setState({
                            data: a,
                        });
                    }
                });
            }
            this.setState({ isPosition: true, flag: isEdit });
        } else {
            this.setState({ isPosition: true, flag: isEdit });
        }
    };

    // 仓位编辑Modal 删除
    positionDelete = () => {
        const { selectedRowKeys } = this.props.publicData;
        const oneData = selectedRowKeys;
        const len = oneData.length;
        if (len === 0) {
            message.info(`请选择要删除${len}的行！`);
            return;
        }
        Modal.confirm({
            title: '提示',
            content: `你确认要删除选中的${len}行数据吗？`,
            okText: '删除',
            cancelText: '取消',
            onOk: () => {
                this.props.dispatch({
                    type: `${model}/unitSetSilo`,
                    payload: {
                        model: 'deleteTccw',
                        id: oneData,
                        query: true,
                        callback: () => {
                            this.props.dispatch({
                                type: `${model}/unitSetSilo`,
                                payload: {
                                    model: 'searchListTccw',
                                    sccode: this.state.dwxydm,
                                    query: true,
                                },
                            });
                        },
                    },
                });
            },
        });
    };

    // 仓位编辑 新增Modal 保存
    handleOkPosition = () => {
        const { flag, dwxydm } = this.state;
        const { dispatch, publicData } = this.props;
        const { selectedRowKeys } = publicData;
        const form = this.refs.positionForm.getForm();
        form.validateFields((err, values) => {
            if (!err) {
                let payload = {
                    model: 'saveTccw',
                    id: flag ? '' : selectedRowKeys[0],
                    name: values.name,
                    brf: values.brf || '',
                    sts: values.sts,
                    sccode: dwxydm,
                    query: true,
                    callback: () => {
                        dispatch({
                            type: `${model}/unitSetSilo`,
                            payload: {
                                model: 'searchListTccw',
                                sccode: dwxydm,
                                query: true,
                            },
                        });
                    },
                };
                if (flag) {
                    delete payload.id;
                }
                dispatch({
                    type: `${model}/unitSetSilo`,
                    payload,
                });

                this.refs.positionForm.getForm().resetFields();
                this.setState({ isPosition: false, data: {} });
            }
        });
        this.props.dispatch({
            type: `${model}/setSelectedRowKeys`,
            payload: { selectedRowKeys: [] },
        });
    };

    // 仓位编辑 新增Modal 关闭
    handleCancelPosition = () => {
        const form = this.refs.positionForm.getForm();
        form.resetFields();
        this.props.dispatch({
            type: `${model}/setSelectedRowKeys`,
            payload: { selectedRowKeys: [] },
        });
        this.setState({ isPosition: false, data: {} });
    };

    render() {
        const { isPosition, data } = this.state;
        const { option, loading, publicData } = this.props;
        const { selectedRowKeys, unitSetSiloList } = publicData;
        const mainPositionProps = {
            model,
            columns: option.siloContent,
            loading,
            dataSource: unitSetSiloList,
            unique: 'id',
            selectedRowKeys,
        };
        return (
            <>
                <Modal
                    destroyOnClose
                    title='仓位编辑'
                    width={860}
                    visible={true}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key='close' type='ghost' onClick={this.handleCancel.bind(this)}>
                            关闭
                        </Button>,
                    ]}
                >
                    <Button
                        type='primary'
                        onClick={this.positionNew.bind(this, true)}
                        style={{ marginRight: 10, paddingLeft: 20, paddingRight: 20 }}
                    >
                        新增
                    </Button>
                    <Button
                        onClick={this.positionNew.bind(this, false)}
                        type='primary'
                        ghost
                        style={{ marginRight: 10, paddingLeft: 20, paddingRight: 20 }}
                    >
                        修改
                    </Button>
                    <Button
                        onClick={this.positionDelete.bind(this)}
                        type='primary'
                        ghost
                        style={{ paddingLeft: 20, paddingRight: 20 }}
                    >
                        删除
                    </Button>
                    <DataTable {...mainPositionProps} />
                </Modal>
                <Modal
                    destroyOnClose
                    title='单位设置仓位编辑'
                    width={860}
                    visible={isPosition}
                    onOk={this.handleOkPosition}
                    onCancel={this.handleCancelPosition}
                    footer={[
                        <Button key='close' type='ghost' onClick={this.handleCancelPosition.bind(this)}>
                            关闭
                        </Button>,
                        <Button key='submit' type='primary' onClick={this.handleOkPosition.bind(this)}>
                            保存
                        </Button>,
                    ]}
                >
                    <EditFrom
                        ref='positionForm'
                        daoName={model}
                        controls={option.newSilo}
                        record={data}
                        loading={loading}
                    />
                </Modal>
            </>
        );
    }
}

export default Silo;
