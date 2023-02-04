import { Icon, Input } from 'antd';
import React from 'react';
import styles from './index.less';
import { IconFont } from '@/pages/home/utils';
export default {
    UserName: {
        props: {
            size: 'large',
            id: 'userName',
            prefix: <IconFont type='icon-a-zongheguanlixitong-icon_huaban1fuben30' />,
            placeholder: '请输入登录ID',
        },
        rules: [
            {
                required: true,
                message: '请输入登录ID',
            },
        ],
    },
    Password: {
        props: {
            size: 'large',
            prefix: <IconFont type='icon-a-zongheguanlixitong-icon_huaban1fuben31' />,
            type: 'password',
            id: 'password',
            placeholder: '请输入密码',
        },
        rules: [
            {
                required: true,
                message: '请输入密码',
            },
        ],
    },
    Mobile: {
        props: {
            size: 'large',
            prefix: <Icon type='mobile' className={styles.prefixIcon} />,
            placeholder: 'mobile number',
        },
        rules: [
            {
                required: true,
                message: 'Please enter mobile number!',
            },
            {
                pattern: /^1\d{10}$/,
                message: 'Wrong mobile number format!',
            },
        ],
    },
    Captcha: {
        props: {
            size: 'large',
            prefix: <Icon type='mail' className={styles.prefixIcon} />,
            placeholder: 'captcha',
        },
        rules: [
            {
                required: true,
                message: 'Please enter Captcha!',
            },
        ],
    },
    Code: {
        props: {
            size: 'large',
            id: 'Code',
            placeholder: '请输入验证码',
        },
        rules: [
            {
                required: true,
                message: '请输入正确的验证码',
            },
        ],
    },
};
