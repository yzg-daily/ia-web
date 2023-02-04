// 获取所有可配置的权限
const getUserAccessControl = (props, cb, roleid) => {
    const { dispatch } = props;
    const payload = {
        model: 'getAllPermission',
        query: true,
    };
    if (cb && typeof cb === 'function') {
        payload.callback = () => cb(props, roleid);
    }
    dispatch({ type: 'userCenterModels/getAllPermission', payload });
};
// 查询全部已有角色
const queryAllRoleList = (props, cb) => {
    const { dispatch } = props;
    const payload = {
        model: 'getCompRoles',
        query: true,
        page: 1,
        size: 20,
    };
    if (cb && typeof cb === 'function') {
        payload.callback = cb;
    }
    dispatch({ type: 'userCenterModels/getAllPermission', payload });
};
// 查询角色已有权限
const queryRoleHasPermissions = (props, roleid) => {
    const { dispatch } = props;
    const payload = {
        roleid,
        model: 'getRolePermission',
        query: true,
    };
    dispatch({ type: 'userCenterModels/getAllPermission', payload });
};
// 循环下级菜单，并生成key值为lowerMenu_PID。
const lowerMenuLoop = menu => {
    const lowerMenu = {};
    menu.forEach(m => {
        if (m.pid) {
            if (!lowerMenu[`lowerMenu_${m.pid}`]) {
                lowerMenu[`lowerMenu_${m.pid}`] = [];
            }
            lowerMenu[`lowerMenu_${m.pid}`].push(m);
        }
    });
    return lowerMenu;
};
// 设置下级菜单
const lowerMenuSet = (menu, lowerMenu) =>
    menu.map(sub => {
        const { ...item } = sub;
        Object.entries(lowerMenu).forEach(([key, val]) => {
            const keyNumber = +key.replace(/\D|_/g, '');
            if (keyNumber === item.id) {
                item.children = val;
            } else if (item.children && item.children.length) {
                item.children = lowerMenuSet(item.children, lowerMenu);
            }
        });
        return item;
    });
// 权限列表设置
const permissionsSeting = data => {
    const { ...t } = data;
    const item = {
        perms: [],
    };
    if (t.perms) {
        item.id = `sys_${t.id}`;
        item.name = t.name;
        t.perms.forEach(p => {
            const subItem = {
                ...p,
                children: [],
            };
            // 一级菜单
            if (p.pid === 0) {
                item.perms.push(subItem);
            }
        });
        // 下级菜单
        const lowerMenu = lowerMenuLoop(data.perms);
        item.perms = lowerMenuSet(item.perms, lowerMenu);
    }
    return item;
};
// 权限设置
const permissionsListSeting = list => {
    if (!list.length) return [];
    const result = [];
    result.push(...list.map(permissionsSeting));
    return result;
};
// 权限数据整理
const dataReduction = current => {
    const title = current.name;
    let key;
    let children;
    if (!current) return null;
    key = `${current.id}`;
    if (current.perms) {
        key = `${current.id}`;
        children = current.perms.map(dataReduction);
    } else {
        if (current.pid) {
            key = `${current.pid}-${current.id}`;
        } else if (!current.pid && !current.tpsList) {
            key = `but-${current.id}`;
        }
        if (current.children && current.children.length) {
            children = current.children.map(dataReduction);
        }
        if (current.tpsList && current.tpsList.length) {
            children = current.tpsList.map(dataReduction);
        }
    }
    return {
        title: `${title}-${key}`,
        key,
        children: children || [],
    };
};
// 权限数据格式化
const dataFormat = data => permissionsListSeting(data).map(dataReduction);
export default data => dataFormat(data.filter(d => d));
