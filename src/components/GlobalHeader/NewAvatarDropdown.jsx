import { Icon, Menu, Spin } from 'antd';
import React from 'react';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import avatar from '@/assets/avatar.png';

class AvatarDropdown extends React.Component {
    onMenuClick = event => {
        const { key } = event;
        if (key === 'logout') {
            const { logout } = this.props;
            logout();
        }
    };

    render() {
        const {
            currentUser = {
                avatar: '',
                name: '',
            },
        } = this.props;
        const menuHeaderDropdown = (
            <Menu className={styles.menu} style={{ marginTop: '15px' }} selectedKeys={[]} onClick={this.onMenuClick}>
                <Menu.Item key='companyName'>
                    <Icon type='global' />
                    {currentUser.cname}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key='logout'>
                    <Icon type='logout' />
                    退出登录
                </Menu.Item>
            </Menu>
        );
        return currentUser && currentUser.name ? (
            <HeaderDropdown overlay={menuHeaderDropdown}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#222222',
                        fontWeight: '500',
                        fontSize: '14px',
                        marginRight: '15px',
                    }}
                >
                    <img style={{ height: '30px', width: '30px', marginRight: '15px' }} src={avatar} />
                    <span style={{ marginRight: '10px' }}>欢迎登录，{currentUser.name}</span>
                    <Icon type='caret-down' />
                </div>
            </HeaderDropdown>
        ) : (
            <Spin
                size='small'
                style={{
                    marginLeft: 8,
                    marginRight: 8,
                }}
            />
        );
    }
}

export default AvatarDropdown;
