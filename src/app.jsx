import { VerifyLogin } from '@/utils/method';

// 全局监听路由变化 判断是否登录
export function onRouteChange({ location }) {
    const pathname = location.pathname;
    if (
        pathname === '/user/login' ||
        pathname === '/user/forgotPassword' ||
        pathname === '/gateway' ||
        pathname === '/gateway/information' ||
        pathname === '/gateway/threeclass' ||
        pathname === '/businessPage'
    )
        return false;
    VerifyLogin();
}
