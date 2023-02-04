import React, { Component, useState } from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import { Form, Button, Input, Row, Col, Tabs } from 'antd';
import { validator, descriptor, tips } from '@/utils/utils';
import EnhancedForm from '../components/ForgotPasswordForm';
import styles from '../login/style.less';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
const { TabPane } = Tabs;

class ForgotPassword extends Component {
    state = {
        type: '1',
    };

    constructor(...props) {
        super(...props);
        this.forgotPassword = null;
    }

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {}

    handleSubmit = () => {
        const forgotPassword = this.forgotPassword.props.form;
        forgotPassword.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const taskID = this.forgotPassword.getAuthCode();
                if (!taskID) {
                    return tips({ description: '验证码不匹配', type: 'error' });
                }
                // const taskID = '2007034220238733';
                const payload = {
                    ...values,
                    taskID,
                };
                const { dispatch } = this.props;
                dispatch({
                    type: 'login/forgotPasswordForm',
                    payload,
                });
            }
        });
    };

    render() {
        return (
            <div className={styles.main}>
                <Tabs defaultActiveKey='1' tabBarStyle={{ border: 'none', textAlign: 'center' }}>
                    <TabPane tab='忘记密码' key='1'>
                        <EnhancedForm
                            wrappedComponentRef={form => {
                                this.forgotPassword = form;
                            }}
                        />
                    </TabPane>
                </Tabs>
                <div>
                    <Button onClick={this.handleSubmit}>确认</Button>
                    <Link
                        className={styles.register}
                        style={{
                            float: 'right',
                            marginRight: 10,
                        }}
                        to='/user/login'
                    >
                        登录
                    </Link>
                </div>
            </div>
        );
    }
}

export default connect(({ login, loading }) => ({
    userLogin: login,
    submitting: loading.effects['login/login'],
}))(ForgotPassword);
