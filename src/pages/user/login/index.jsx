import {
    Alert,
    // Checkbox,
    // Input
} from 'antd';
import { IconFont } from '@/pages/home/utils';
import React, { Component } from 'react';
// import { Link } from 'umi';
import { connect } from 'dva';
import LoginComponents from '../components/Login';
import styles from './style.less';
import { tips } from '@/utils/utils';

const { publicPath2 } = window;

const { UserName, Password, Submit, Code } = LoginComponents;

class Login extends Component {
    loginForm = undefined;

    state = {
        type: '1',
        autoLogin: false,
        codeTime: new Date(),
    };

    // changeAutoLogin = e => {
    //     this.setState({
    //         autoLogin: e.target.checked,
    //     });
    // };

    handleSubmit = (err, values) => {
        const { codeTime } = this.state;
        /**
         *  验证码过期时间是2分钟, 现在的时间 - code的初始时间 >= 2分钟就是刷寻图片
         *  img 利用 src 携带 time 参数来刷新
         * */
        if (new Date().getTime() - codeTime.getTime() >= 120000) {
            tips({ description: '验证码已过期', type: 'error' });
            this.loginForm?.setFieldsValue?.({ code: undefined }); // 清空验证码
            this.setState({
                codeTime: new Date(), // 更新时间 刷新验证码
            });
            return false;
        }
        const { type, autoLogin } = this.state;
        if (!err) {
            const { dispatch } = this.props;
            dispatch({
                type: 'login/login',
                payload: { ...values, type, autoLogin },
            });
        }
    };

    onTabChange = type => {
        this.setState({
            type,
        });
    };

    onGetCaptcha = () =>
        new Promise((resolve, reject) => {
            if (!this.loginForm) {
                return;
            }

            this.loginForm.validateFields(
                ['mobile'],
                {},
                async (
                    err,
                    values = {
                        mobile: undefined,
                    }
                ) => {
                    if (err) {
                        reject(err);
                    } else {
                        const { dispatch } = this.props;

                        try {
                            const success = await dispatch({
                                type: 'login/getCaptcha',
                                payload: values?.mobile,
                            });
                            resolve(!!success);
                        } catch (error) {
                            reject(error);
                        }
                    }
                }
            );
        });

    renderMessage = content => (
        <Alert
            style={{
                marginBottom: 24,
            }}
            message={content}
            type='error'
            showIcon
        />
    );

    /**
     *  获取缓存的值 -> 给表单赋值 -> 表单验证 -> 登陆
     * */
    userAutoLogin() {
        let info = undefined;
        try {
            // 前端 password 进行简单加密并解密
            info = JSON.parse(localStorage.getItem('sj_autoLogin'));
            const autoLogin = info?.autoLogin;
            let password = info?.password;
            const username = info?.username;

            if (autoLogin && password && username) {
                password = window?.atob(window.decodeURIComponent(password))?.replace('sj_password', '');
                this.setState({ autoLogin });
                const { setFieldsValue, validateFields } = this.loginForm || {};
                setFieldsValue?.({
                    ...info,
                    // 缓存时 密码简单的编译一次，赋值时需要转回来
                    password,
                });

                validateFields?.(this.handleSubmit);

                // this.loginForm.validateFields((error, values) => {
                //     if (error) return false;
                //     const { password, ...rest } = values;
                //
                //     this.handleSubmit(error, {
                //         ...rest,
                //         password
                //         // password: window.atob(window.decodeURIComponent(password)).replace('sj_password', ''),
                //     });
                // });

                // this.props.dispatch({
                //     type: 'login/login',
                //     payload: {
                //         ...info,
                //         password: window.atob(window.decodeURIComponent(password)).replace('sj_password', ''),
                //     },
                // });
            }
        } catch (e) {
            localStorage.setItem('sj_autoLogin', null);
        }
    }

    // VerifiCode = e => {
    //     this.setState({
    //         code: e.target.value,
    //     });
    // };

    componentDidMount() {
        // this.userAutoLogin();
        // 企业系统的 退出登录 后, 直接跳到登录页 这里再调用 退出
        const { dispatch } = this.props;
        dispatch({ type: 'login/logout' });
    }

    render() {
        const { userLogin = {}, submitting } = this.props;
        const { status, type: loginType } = userLogin;
        const {
            type,
            // autoLogin
        } = this.state;
        return (
            <div className={styles.main}>
                <LoginComponents
                    defaultActiveKey={type}
                    onTabChange={this.onTabChange}
                    onSubmit={this.handleSubmit}
                    onCreate={form => {
                        this.loginForm = form;
                    }}
                >
                    <br />
                    {status === 'error' && loginType === '1' && !submitting && this.renderMessage('账户或密码错误')}
                    {/*
                     validateStatus="success"
                        hasFeedback
                    */}
                    <UserName
                        name='username'
                        autoComplete='true'
                        hasFeedback={true}
                        prefix={<IconFont type='icon-a-zongheguanlixitong-icon_huaban1fuben30' />}
                    />
                    <Password
                        name='password'
                        autoComplete='true'
                        hasFeedback={true}
                        onPressEnter={e => {
                            e.preventDefault();
                            this.loginForm?.validateFields?.(this.handleSubmit);
                        }}
                    />
                    <div className={styles.VerifiCodeImgWrap}>
                        <Code name={'code'} maxLength={4} autoComplete='true' hasFeedback={true} />
                        {/*<Input placeholder={'请输入验证码'} maxLength={4} onChange={this.VerifiCode} />*/}
                        <img
                            className={styles.VerifiCodeImg}
                            src={`${publicPath2}/login/getVerifiCode?time=${this.state?.codeTime}`}
                            alt='图片验证码'
                            onClick={() => this.setState({ codeTime: new Date() })}
                        />
                    </div>
                    {/*<div>*/}
                    {/*    <Checkbox checked={autoLogin} className={'AutoCheckbox'} onChange={this.changeAutoLogin}>*/}
                    {/*        自动登录*/}
                    {/*    </Checkbox>*/}
                    {/*    /!* <Link*/}
                    {/*        className={styles.register}*/}
                    {/*        style={{*/}
                    {/*            float: 'right',*/}
                    {/*        }}*/}
                    {/*        to='/user/forgotPassword'*/}
                    {/*    >*/}
                    {/*        忘记密码*/}
                    {/*    </Link> *!/*/}
                    {/*</div>*/}
                    <Submit loading={submitting}>立即登录</Submit>
                </LoginComponents>
            </div>
        );
    }
}

export default connect(({ login, loading }) => ({
    userLogin: login,
    submitting: loading.effects['login/login'],
}))(Login);
