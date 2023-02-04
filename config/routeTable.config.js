export default [
    {
        path: '/user',
        name: '用户中心',
        component: '../layouts/UserLayout',
        routes: [
            {
                name: '用户登录',
                path: '/user/login',
                breadcrumbName: 'login',
                component: './user/login',
            },
            {
                name: '忘记密码',
                path: 'forgotPassword',
                breadcrumbName: '忘记密码',
                component: './user/forgotPassword/ForgotPassword',
            },
        ],
    },
    {
        path: '/businessPage',
        component: './businessPage',
    },
    {
        path: '/gateway',
        name: '门户',
        breadcrumbName: 'gateway/:info',
        component: './gatewayHomepage/indexpage',
    },

    {
        path: '/',
        name: '内部关联交易系统',
        component: '../layouts/BasicLayout',
        routes: [
            {
                path: '/',
                redirect: '/home/index',
            },
            {
                path: 'basicInformation',
                name: '基础信息设置',
                icon: 'icon-a-1_jichushezhi',
                breadcrumbName: '基础信息设置',
                routes: [
                    {
                        path: 'withTheUnit',
                        name: '内部往来单位',
                        breadcrumbName: 'addMenu',
                        component: './basicInformation/withTheUnit',
                    },
                    {
                        component: './404',
                    },
                ],
            },
            {
                path: 'contractPayManage',
                name: '合同收付款管理',
                icon: 'icon-a-1_jichushezhi',
                breadcrumbName: '合同收付款管理',
                routes: [
                    {
                        path: 'paymentQuery',
                        name: '合同收付款查询',
                        breadcrumbName: '合同收付款查询',
                        component: './contractPayManage/paymentQuery',
                    },
                    {
                        component: './404',
                    },
                ],
            },
            {
                path: 'tradeAssociation',
                name: '关联交易管理',
                icon: 'icon-a-1_jichushezhi',
                breadcrumbName: '关联交易管理',
                routes: [
                    {
                        path: 'purchase',
                        name: '采购关联交易',
                        breadcrumbName: '采购关联交易',
                        component: './tradeAssociation/purchase',
                    },
                    {
                        path: 'sell',
                        name: '销售关联交易',
                        breadcrumbName: '销售关联交易',
                        component: './tradeAssociation/sell',
                    },
                    {
                        path: 'directSelling',
                        name: '直销关联交易',
                        breadcrumbName: '直销关联交易',
                        component: './tradeAssociation/directSelling',
                    },
                    {
                        path: 'allot',
                        name: '调拨关联交易',
                        breadcrumbName: '调拨关联交易',
                        component: './tradeAssociation/allot',
                    },
                    {
                        component: './404',
                    },
                ],
            },
            {
                path: 'relatedTransaction',
                name: '关联交易合同',
                icon: 'icon-a-1_jichushezhi',
                breadcrumbName: '关联交易合同',
                routes: [
                    {
                        path: 'contract',
                        name: '关联合同管理',
                        breadcrumbName: '关联合同管理',
                        component: './relatedTransaction/contract',
                    },
                    {
                        component: './404',
                    },
                ],
            },
            {
                component: './404',
            },
        ],
    },
    {
        component: './404',
    },
];
