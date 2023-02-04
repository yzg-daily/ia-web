import request from '@/utils/request';
import { formData } from '@/utils/utils';

const { publicPath } = window;

/**
 * getAccessControl 获取用户权限。登录后使用
 * @param {object} payload 参数集合
 * @param {string} payload.uid
 * @param {string} payload.sid
 */
export function getUserAccessControl({ payload }) {
    return request(`${publicPath}/userCenter/${payload.model}/${payload.uid}`);
}
/**
 * getAllPermission 获取所有可配置的权限（不大于当前用户）
 * @param {object} payload 参数集合
 * @param {number} payload.roleid
 * @param {number} payload.sid
 * @description getAllPermission 用于分配给角色
 * @description getAllPermissionWithRole 并标注对应角色已有的权限，用于分配给角色
 */
export function getAllPermission({ payload }) {
    const body = formData(payload);
    return request(`${publicPath}/userCenter/${payload.model}`, {
        method: 'POST',
        body,
    });
}
/**
 * roleSeting 角色设置
 * @param {object} payload 参数集合
 * @param {number} payload.roleid   角色ID
 * @param {string} payload.rolename 角色名称
 * @param {string} payload.roledes  角色描述
 * @param {number} payload.gid      所属公司ID
 * @param {number} payload.issys    是否系统角色
 * @param {number} payload.uttp     管辖范围
 * @param {number} payload.sortno   顺序号
 * @description saveRole 保存角色
 * @description deleteRole 删除角色
 */
export function roleSeting({ payload }) {
    const body = formData(payload);
    return request(`${publicPath}/userCenter/${payload.model}`, {
        method: 'POST',
        body,
    });
}
