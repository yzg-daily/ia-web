import React, { Component } from 'react';
import { Input, Form, Icon } from 'antd';

const FormItem = Form.Item;

class ChangePassword extends Component {
    render() {
        const { handleOk, form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Form horizontal='true' onSubmit={handleOk}>
                <FormItem label='原密码'>
                    {getFieldDecorator('oldPassword', {
                        rules: [{ required: true, message: '请输入原密码！' }],
                    })(
                        <Input
                            prefix={<Icon type='lock' style={{ fontSize: 13 }} />}
                            type='password'
                            placeholder='原密码'
                        />
                    )}
                </FormItem>
                <FormItem label='新密码'>
                    {getFieldDecorator('newPassword', {
                        rules: [{ required: true, message: '请输入新密码！' }],
                    })(
                        <Input
                            prefix={<Icon type='lock' style={{ fontSize: 13 }} />}
                            type='password'
                            placeholder='新密码'
                        />
                    )}
                </FormItem>
                <FormItem label='确认密码'>
                    {getFieldDecorator('okNewPassword', {
                        rules: [{ required: true, message: '请输入确认密码！' }],
                    })(
                        <Input
                            prefix={<Icon type='lock' style={{ fontSize: 13 }} />}
                            type='password'
                            placeholder='确认密码'
                        />
                    )}
                </FormItem>
            </Form>
        );
    }
}

export default Form.create({})(ChangePassword);
