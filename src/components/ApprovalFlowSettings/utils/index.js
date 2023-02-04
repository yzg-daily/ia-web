/**
 * 创建配置文件
 * @param {Object} dict - 字典描述文件。JSON格式
 * @return {Object} 返回JSON格式文件。
 * @description 返回格式参考camunda-bpmn-moddle/resources/camunda
 * */
import { isFn, tips } from '@/utils/utils';

export const methods = {
    onChange(value, data, callback) {
        let [...dataSetCopy] = [...data];
        const nameList = dataSetCopy.map(item => item.name);
        let index = -1;

        if (nameList.includes(value.name)) {
            index = dataSetCopy.findIndex(item => item.name === value.name);
            if (dataSetCopy[index]?.value) {
                dataSetCopy[index].value = value.value;
            } else {
                dataSetCopy[index].name = value.name;
            }
        } else {
            dataSetCopy.push(value);
        }
        if (isFn(callback)) {
            callback(dataSetCopy);
        }
    },
};

function nodesData(item) {
    const result = {
        procDefKey: item.procDefKey,
        approveType: /ManualTask/.test(item.type) ? 4 : 0,
    };
    const symbol = /include|exclude|inside|outside|(\|{2})|(&{2})|<|<=|>|>=|==/g;
    if (item.name === 'signedTypes') {
        result.approveType = item.value;
    }
    if (typeof item.value === 'string' && !symbol.test(item.value)) {
        result.pvmName = item.value;
    }
    result.pvmType = item.type.replace(/bpmn:/, '');
    result.pvmId = item.id;
    return result;
}

export const unique = {
    /**
     * 去重(unique)
     * @param {Array} data
     * @return {Array}
     */
    execute(data) {
        if (!Array.isArray(data)) return [];
        // 逻辑表达式
        const isEXP = data.filter(item => item.name === 'expression');
        if (isEXP.length) return data;

        const result = [];
        const keys = [];
        // 用户任务
        data.forEach(item => {
            if (/(collection|approver|signedTypes)/.test(item.name)) {
                const index = result.findIndex(idx => /(collection|approver|assignee)/.test(idx.name));
                if (index > -1) {
                    if (Array.isArray(item.value) && item.value.length) {
                        result.splice(index, 1, item);
                    }
                    if (typeof item.value === 'number') {
                        result.splice(index, 1, item);
                    }
                } else {
                    result.push(item);
                }

                keys.push(item.name);
            } else if (!keys.includes(item.name)) {
                keys.push(item.name);
                result.push(item);
            }
        });
        return result;
    },
};

/**
 * 提交数据编码(encode)
 * @param {Array} cache
 * @param {{pvmExpItems: [], pvmExps: [], pvmVars: []}} data
 * @param {{id: string, ...}} node
 * @param {string} diagramID
 * @param {string} procDefName
 * @return {{pvmExpItems: [], pvmExps: [], pvmVars: []}}
 */
export function encode(cache, data, node, diagramID, procDefName) {
    console.group('提交数据编码');
    const resultSubmit = {
        // procDefKey: diagramID,
        procDefName,
        // 节点数组 todo 审批类型存放在对应节点 approveType 字段
        pvms: [],
        // 节点变量数组 todo 每个任务节点一组数据 数据存放字段 varValue 类型标识字段 varType
        pvmVars: [],
        // 表达式数组 todo 表达式数据
        pvmExps: [],
        // 表达式项数组 todo 表达式分组数据
        pvmExpItems: [],
        ...data,
    };

    const currentNodes = {
        pvms: [],
        pvmVars: [],
        pvmExps: {},
        pvmExpItems: {},
    };
    cache.forEach(item => {
        // 表达式数据处理
        if (/SequenceFlow/i.test(item.type)) {
            currentNodes.pvms.push(nodesData(item));
            if (item.name === 'expression') {
                currentNodes.pvms.push(nodesData(item));
                currentNodes.pvmExps = {
                    expTitle: 'condition',
                    expJuel: `\${${item.value}}`,
                    pvmId: item.id,
                    procDefKey: item.procDefKey,
                };
                currentNodes.pvmExpItems = item.pvmExpItems.map(exp => ({ ...exp, pvmId: item.id }));
                resultSubmit.pvmExps.push(currentNodes.pvmExps);
                resultSubmit.pvmExpItems.push(...currentNodes.pvmExpItems);
            }
        } else if (/UserTask|ManualTask/.test(item.type)) {
            const temp = {};
            const [currentNodeType] = cache.filter(c => c.id === item.id && c.name === 'signedTypes');
            if (item.name !== 'name') {
                if (/ManualTask/.test(item.type)) {
                    if (item.name !== 'signedTypes') {
                        temp.varTitle = 'collection';
                        temp.varName = `${item.id}_list`;
                        temp.pvmId = item.id;
                        temp.varType = 4;
                        temp.procDefKey = item.procDefKey;
                        temp.varValue = Array.isArray(item.value) ? item.value : [];
                        currentNodes.pvmVars.push(temp);
                        currentNodes.pvms.push(nodesData(item));
                    }
                } else if (currentNodeType) {
                    // 用户任务处理
                    const diff = currentNodeType?.value === 0;

                    // 单人为assignee，多人为collection
                    temp.varTitle = diff ? 'assignee' : 'collection';
                    // 单人格式：pvmId_assigneer，多人list格式： pvmId_list
                    temp.varName = diff ? `${item.id}_assigneer` : `${item.id}_list`;
                    // 1=单个变量，2=list集合
                    temp.varType = diff ? 1 : 2;
                    temp.pvmId = item.id;
                    temp.procDefKey = item.procDefKey;
                    if (/assignee/.test(item.label ?? item.name)) {
                        temp.varValue = item.value;
                    }

                    if (item.name !== 'name') {
                        currentNodes.pvmVars.push(temp);
                    }
                    currentNodes.pvms.push(nodesData(item));
                } else {
                    console.info('错误项目', item);
                    tips({ description: '缺少审批类型。', type: 'error', message: '保存数据失败' });
                }
            } else {
                currentNodes.pvms.push(nodesData(item));
            }
        }
    });

    const keys = [];

    currentNodes.pvms.forEach(item => {
        if (!keys.includes(item.pvmId)) {
            keys.push(item.pvmId);
            resultSubmit.pvms.push(item);
        } else {
            const index = resultSubmit.pvms.findIndex(idx => idx.pvmId === item.pvmId);
            if (index > -1) {
                resultSubmit.pvms.splice(index, 1, { ...resultSubmit.pvms[index], ...item });
            }
        }
    });

    if (currentNodes.pvmVars.length) {
        resultSubmit.pvmVars.push(...currentNodes.pvmVars.filter(item => item.varValue));
    }
    if (cache[0]?.procDefKey) {
        resultSubmit.procDefKey = cache[0]?.procDefKey;
    }
    console.groupEnd();
    return resultSubmit;
}
/**
 * 表达式处理(expression)
 * @param {[]} expString
 * @param {[]} expArray
 * @return {[]}
 */
function expression(expString, expArray) {
    const cache = [];
    expString?.forEach(item => {
        cache.push({
            name: 'expression',
            value: item.expJuel,
            id: item.pvmId,
            procDefKey: item.procDefKey,
            // 修复后端返回数据顺序
            pvmExpItems: expArray.filter(items => items.pvmId === item.pvmId).reverse(),
        });
    });
    return cache;
}

/**
 * 接收数据解码
 * {{procDefKey:string, pvms: [], pvmVars:[], pvmExps:[], pvmExpItems:[]}}
 * @param data
 * @return {{diagramID: string, list: []}}
 */
export function decode(data) {
    if (data?.list) return data;
    const { procDefKey, pvms, pvmVars, pvmExps, pvmExpItems } = data;
    const result = {
        diagramID: procDefKey,
        list: [],
    };
    pvms?.forEach(item => {
        // 审批类型
        result.list.push({
            name: 'signedTypes',
            value: item.approveType,
            id: item.pvmId,
            procDefKey: item?.procDefKey ?? procDefKey,
        });
    });
    pvmVars?.forEach(item => {
        let diff;
        if (typeof item.varValue !== 'number') {
            diff = JSON.parse(item.varValue);
        } else {
            diff = item.varValue;
        }
        if (Array.isArray(diff) && diff?.length) {
            result.list.push({
                name: item.varTitle === 'collection' ? 'assignee' : item.varTitle,
                value: JSON.parse(item.varValue),
                id: item.pvmId,
                procDefKey: item?.procDefKey ?? procDefKey,
            });
        }
    });
    result.list.push(...expression(pvmExps, pvmExpItems));
    return result;
}

/**
 * 合并更新数据(merge)
 * @param {{pvms: Array, pvmVars: Array, pvmExps: Array, pvmExpItems: Array}} now - 变动数据
 * @param {{pvms: Array, pvmVars: Array, pvmExps: Array, pvmExpItems: Array}} exist - 已存在数据
 * @returns {{pvms: Array, pvmVars: Array, pvmExps: Array, pvmExpItems: Array}}
 */
export function merge(now, exist) {
    const result = {};
    const nowKeys = Object.keys(now);

    nowKeys.forEach(item => {
        if (/procDefKey|diagramID/.test(item)) {
            result[item] = now[item];
        } else if (exist && exist[item]) {
            // 更新已有数据
            result[item] = unique.execute([...exist[item], ...now[item]]);
        } else {
            // 创建新数据
            result[item] = unique.execute(now[item]);
        }
    });
    return result;
}

const utils = {
    sign: new Map(),
    unique: data => data.forEach(item => utils.set(`${item.name}_${item.id}`, item)),
    has: value => utils.sign.has(value),
    get: key => utils.sign.get(key),
    set: (key, value) => utils.sign.set(key, value),
    delete: key => utils.sign.delete(key),
    forEach: callback => utils.sign.forEach(callback),
    clear: () => utils.clear,
};

/**
 * 更新数据缓存
 * @param {Array} now - 新数据
 * @param {Array} exist - 缓存数据
 * @param {String} diagramID - XML (ID or keywords)
 * @return {Array}
 */
export function updateCachedData(now, exist, diagramID) {
    const result = [];
    if (!now?.length && exist?.length) return exist;

    if (!exist?.length && now?.length) return now;

    if (!exist?.length && !now?.length) return result;

    utils.unique(exist);

    now?.forEach?.(item => {
        const key = `${item.name}_${item.id}`;
        if (utils.has(key)) {
            const current = item.value;
            const cacheItem = utils.get(key);
            if (cacheItem.id === item.id) {
                if (current) {
                    // 更新审批(抄送)人
                    if (Array.isArray(current) && current?.length) {
                        utils.delete(key);
                        utils.set(key, item);
                    }
                    // 更新节点类型
                    if (typeof current === 'number') {
                        utils.delete(key);
                        utils.set(key, item);
                    }
                    // 更新节点名称
                    if (typeof current === 'string') {
                        utils.delete(key);
                        utils.set(key, item);
                    }
                }
            }
        } else {
            utils.set(key, item);
        }
    });

    utils.forEach(cache => {
        const { ...item } = { ...cache, procDefKey: cache?.procDefKey ?? diagramID };
        result.push(item);
    });
    return result;
}
/**
 * 更新数据缓存
 * @param {Object[]} now - 新数据
 * @param {Object[]} exist - 已缓存数据
 * @param {String} diagramID - 文档procDefKey
 * @return {Object[]} - 返回合并后的新数据
 */
export function updateCacheData(now, exist, diagramID) {
    const nameRE = /collection|approver|assignee/;
    const result = [];
    utils.unique(exist);
    now.forEach(item => {
        const key = `${item.name}_${item.id}`;
        if (utils.has(key)) {
            if (item.value || item.value === 0 || item.value === '') {
                utils.sign.delete(key);
                utils.sign.set(key, item);
            } else {
                utils.sign.delete(key);
            }
        } else {
            utils.sign.set(key, item);
        }
    });
    const signedTypes = {};
    utils.sign.forEach(item => {
        const name = item?.label ?? item?.name ?? '';
        if (/signedTypes/.test(name)) {
            signedTypes.value = item.value;
            signedTypes.id = item.id;
        }
    });
    utils.sign.forEach(cache => {
        const { ...item } = { ...cache, procDefKey: cache?.procDefKey ?? diagramID };
        const name = item?.label ?? item?.name ?? '';
        if (nameRE.test(name) && typeof signedTypes.value === 'number' && signedTypes.id === item.id) {
            if (nameRE.test(item.name)) {
                if (item?.value?.length) {
                    result.push(item);
                }
            }
        } else {
            result.push(item);
        }
    });
    return result;
}

function getNodeList(node) {
    return [...new Set(node?.outgoing ?? [])];
}
/**
 * 默认条件设置及表达式展示
 * @param {Object[]} node - 节点列表
 * @param {Object[]} nodeData - 节点数据
 * @return {Object[]} 返回节点数据和表达式
 */
export function DCSAEP(node, nodeData) {
    const result = [];
    const nodeMap = new Map();
    const nodeList = getNodeList(node);

    nodeList.forEach(item => {
        const cache = {
            id: item.id,
        };
        nodeData?.forEach?.(da => {
            if (da.id === item.id && da.name === 'expression') {
                cache.expression = da.expressionResult;
            }
            nodeMap.set(item.id, cache);
        });
        nodeMap.set(item.id, cache);
    });

    nodeMap.forEach(item => result.push(item));
    return result;
}

/**
 * 删除重复
 * @param {object[]} data
 * @param {string|null} symbol='key'
 * @return {[]}
 */
export function removeDuplicate(data, symbol = 'key') {
    const cache = new Map();
    const result = [];
    if (Array.isArray(data)) {
        data.forEach(item => {
            if (symbol) {
                cache.set(item?.[symbol], item);
            } else {
                cache.set(item, item);
            }
        });
    } else {
        cache.set(symbol ? data?.[symbol] : data, data);
    }
    cache.forEach(item => result.push(item));
    return result;
}

/**
 * 审核人去重
 * @param {Object[]} original
 * @param {Object[]} now
 * @param {Object[]} exist=[]
 * @param {Number} type
 * @return {Object[]}
 */
export function auditUnique(original, now, exist = [], type) {
    if (type === 0) return now;
    if (!type) return [];
    const existKeys = exist?.map?.(item => item.id) ?? [];
    const originalKeys = original?.map?.(item => item.id) ?? [];
    const otherData = exist?.filter?.(item => !originalKeys.includes(item.id)) ?? [];
    const keys = (now?.filter?.(item => !existKeys?.includes?.(item.id)) ?? [])?.map?.(item => item.id) ?? [];
    const cache = exist?.filter?.(item => !keys.includes(item.id)) ?? [];
    const result = [];
    const utils = new Map();

    cache.push(...now);

    cache.forEach(item => utils.set(`${item.name}_${item.id}`, item));
    utils.forEach(item => {
        result.push(item);
    });
    return [...new Set([...result, ...otherData])];
}

/**
 * 更新节点数据
 * @param {{procDefKey: string, target: Object, echoDataJSON: Object[]}} param
 * @param {Object[]} interfaceData
 * @return {{diagramID: string, list: Object[]}}
 */
export function updatingNodeData(param, interfaceData) {
    const result = [];
    const { procDefKey, target, echoDataJSON = [] } = param;
    // 过滤当前节点数据
    const currentNodeData = echoDataJSON.filter(item => item.id === target.id && item.name !== 'name');
    // 解码接口数据
    const { diagramID, list } = decode({ ...interfaceData, procDefKey: interfaceData?.procDefKey ?? procDefKey });
    // 缺失数据
    const deficiencyKeys = currentNodeData.map(item => item.name);
    const deficiency = list.filter(item => !deficiencyKeys.includes(item.name));

    currentNodeData?.forEach?.(item => {
        const { ...cache } = { ...item };
        const [update] = list.filter(items => deficiencyKeys.includes(items.name));
        // 检测数据更新
        if (update) {
            if (Array.isArray(cache.value) && !cache.value?.length && Array.isArray(update.value)) {
                cache.value = update.value;
            }
        }
        result.push(cache);
    });
    // 补全缺失数据
    if (deficiency?.length) {
        result.push(...deficiency);
    }

    return { diagramID, list: [...new Set(result)] };
}
