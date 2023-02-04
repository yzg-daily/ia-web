import React, { Component } from 'react';
import { Form, Button, Input, Row, Col } from 'antd';
import { validator, descriptor, tips } from '@/utils/utils';
import * as API from '@/services/service';

let time;

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

class ForgotPasswordForm extends Component {
    state = {
        countdown: 0,
        confirmDirty: false,
    };

    constructor(...props) {
        super(...props);
        this.index = null;
    }

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {}

    getCaptcha = async form => {
        const phoneNumber = form.getFieldValue('telno');
        const taskID = await API.getCaptcha(phoneNumber);
        if (taskID) {
            tips({ description: '验证码发送成功，请注意手机短信！', type: 'success' });
        }
        // 开启定时器，关闭获取短信验证码按钮。60秒后重新开启
        this.setState({ countdown: 15, taskID });
    };

    getAuthCode = () => {
        const { taskID } = this.state;
        return taskID && taskID.data ? taskID.data : null;
    };

    validateToNextPassword = (form, rule, value, callback) => {
        if (value) {
            let msg;
            if (value.length < 6) {
                msg = '最小长度不能低于6位!';
            } else if (value.length > 12) {
                msg = '最大长度不能超过12位!';
            } else if (this.state.confirmDirty) {
                form.validateFields(['newPasswd'], { force: true });
            } else if (/[\u4e00-\u9fa5]/.test(value)) {
                msg = '密码只能为数字、字母、下划线';
            }
            callback(msg);
        } else {
            callback();
        }
    };

    render() {
        const { countdown } = this.state;
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <>
                <Form {...formItemLayout}>
                    <Form.Item label='账户'>
                        {getFieldDecorator('telno', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入你的注册账户',
                                },
                                {
                                    validator: descriptor.phone,
                                },
                            ],
                        })(<Input placeholder='请输入你的手机号码！' />)}
                    </Form.Item>
                    <Form.Item label='验证码'>
                        <Row gutter={8}>
                            <Col span={13}>
                                {getFieldDecorator('vcode', {
                                    rules: [{ required: true, message: '请输入你的验证码!' }],
                                })(<Input placeholder='验证码' />)}
                            </Col>
                            <Col span={11}>
                                <Button type='danger' disabled={!!countdown} onClick={() => this.getCaptcha(form)}>
                                    {countdown
                                        ? `重新发送...(${countdown < 10 ? `0${countdown}` : countdown})`
                                        : '获取验证码'}
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item label='新密码' hasFeedback>
                        {getFieldDecorator('newPasswd', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入新密码!',
                                },
                                {
                                    validator: (rule, value, callback) =>
                                        this.validateToNextPassword(form, rule, value, callback),
                                },
                            ],
                        })(<Input.Password placeholder='请输入新密码' />)}
                    </Form.Item>
                </Form>
            </>
        );
    }
}

export default Form.create({
    // 任一表单域的值发生改变时的回调。回调参数 props, changedValues, allValues
    onValuesChange: () => {
        // 任一表单域的值发生改变时的时候尝试关闭页面开启的倒计时定时器
        clearTimeout(time);
    },
})(ForgotPasswordForm);
