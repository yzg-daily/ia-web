import React from 'react';
import { tips } from '@/utils/utils';

const Index = props => {
    let index = 0;
    const { children, initRoleId = 0, all, custom } = props;
    return ButtonList(children, initRoleId, all, custom);

    /*
     * <查询>、<清空> 按钮，不做权限处理，不放在 <ButtonPermissions> ... </ButtonPermissions> 中
     * 只对需要权限的按钮进行修改，把需要权限的按钮放在 <ButtonPermissions> ... </ButtonPermissions> 中
     *
     *
     *
     * initRoleId：一般用法，显示对应权限的按钮  <ButtonPermissions initRoleId={this.props.route.id * 100 + 1}> ... </ButtonPermissions>
     *
     * all：不受约束，显示全部按钮  <ButtonPermissions all> ... </ButtonPermissions>
     *
     * custom：自定义，用于按钮是动态（根据条件判断）显示的，需要给每个按钮添加 roleId 属性，比如：页面中的按钮会根据标签切换而变化，以下页面可做参考：
     * 以下页面在企业系统中，不在本系统中。
     * 页面1：scheduling/dd_scheduling/give_administration，  <ButtonPermissions custom> ... </ButtonPermissions>。
     * 页面2（存在按钮嵌套）：scheduling/dd_scheduling/personnel_administration，  <ButtonPermissions custom> ... <>...</> ... </ButtonPermissions>
     */

    function ButtonList(children, initRoleId, all, custom) {
        const permissions = window.g_app._store.getState().publicMethod.buttonList || [];
        if (all) {
            return <>{children}</>;
        } else if (custom) {
            return React.Children.map(children, item => {
                if (!React.isValidElement(item)) return item;
                if (Array.isArray(item.props?.children)) return ButtonList(item.props.children, 0, false, true);
                if (item.props?.roleId) {
                    return permissions.includes(item.props.roleId) ? item : undefined;
                } else {
                    tips({ description: '按钮缺少属性：roleId！', type: 'error' });
                    return undefined;
                }
            });
        } else if (initRoleId > 0) {
            return React.Children.map(children, item => {
                if (!React.isValidElement(item)) return item;
                const newItem = React.cloneElement(item, { roleId: initRoleId + index++ });
                return permissions.includes(newItem.props.roleId) ? item : undefined;
            });
        }
        return null;
    }
};

export default Index;
