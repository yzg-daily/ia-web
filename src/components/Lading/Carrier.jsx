import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Button, Transfer } from 'antd';

const model = 'lading';

@connect(({ lading }) => ({
    lading,
}))
class Carrier extends Component {
    state = {
        targetKeys: undefined,
    };

    handleChange = targetKeys => {
        this.setState({ targetKeys });
    };

    componentDidMount() {
        const { dispatch, lading = {}, ContractType } = this.props;
        const { selectedRowKeys } = lading;
        dispatch({
            type: `${model}/getAllCarrierInfoByCid`,
            payload: { htuuid: selectedRowKeys[0], ContractType, query: true },
        });
    }

    save = () => {
        const { dispatch, lading = {}, ContractType } = this.props;
        const { selectedRowKeys } = lading;
        const { targetKeys } = this.state;

        dispatch({
            type: `${model}/saveCarrierInfo`,
            payload: { htuuid: selectedRowKeys[0], newcydw: targetKeys.join(','), ContractType, query: true },
        });
    };

    render() {
        let { targetKeys } = this.state;
        const { onCancel, lading = {} } = this.props;
        const { allCarrierInfo } = lading;
        const data = allCarrierInfo?.data || [];
        const dataSource = data.map(item => ({
            key: item.dwxydm,
            title: item.name,
            description: item.name,
            flag: item.flag,
        }));

        if (!targetKeys) {
            targetKeys = dataSource.filter(c => c.flag).map(item => item.key);
        }

        return (
            <Modal
                destroyOnClose
                title='承运单位维护'
                width='65%'
                visible={true}
                onCancel={onCancel}
                footer={[
                    <Button key='close' type='ghost' onClick={onCancel}>
                        关闭
                    </Button>,
                    <Button key='submit' type='primary' onClick={this.save}>
                        保存
                    </Button>,
                ]}
            >
                <Transfer
                    titles={['未添加', <p style={{ color: 'red' }}>已添加</p>]}
                    listStyle={{ width: '47.5%' }}
                    dataSource={dataSource}
                    targetKeys={targetKeys}
                    onChange={this.handleChange}
                    onSelectChange={this.handleSelectChange}
                    render={item => item.title}
                />
            </Modal>
        );
    }
}

export default Carrier;
