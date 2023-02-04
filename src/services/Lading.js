import request from '@/utils/request';
import { stringify } from 'qs';

const { publicPath } = window;
const url = publicPath;

const { entries } = Object;
function formData(data) {
    const da = new FormData();
    entries(data).forEach(([key, val]) => {
        if (key !== 'model' && key !== 'callback' && key !== 'type' && key !== 'turnPage') {
            if (data.query) {
                da.append(key, val);
            } else {
                da.append(key, JSON.stringify(val));
            }
        }
    });
    if (data.query && data.turnPage) {
        if (!data.page) {
            da.append('page', 1);
        }
        if (!data.size) {
            da.append('size', 20);
        }
    }
    return da;
}

const pathObj = {
    sales: 'roadxstd',
    purchase: 'roadcgtd',
    direct: 'roadzxtd',
    salesContract: 'roadxsht',
    purchaseContract: 'roadcght',
    directContract: 'roadzxht',
};

// 提单查询
export async function getLading(params) {
    const path = pathObj[params.LadingType];
    delete params.LadingType;

    return request(`${url}/${path}/roadSearchTdjl?${stringify(params)}`);
}

// 生成提单 - 查询
export async function getContractInfo(payload) {
    const path = pathObj[payload.ContractType];
    delete payload.ContractType;

    const body = formData(payload);
    return request(`${url}/${path}/searchPageHtxxs`, {
        method: 'POST',
        body,
    });
}

// 生成提单 - 生成 - 查询
export async function getLadingInfoByCid(params) {
    const path = pathObj[params.LadingType];
    delete params.LadingType;

    return request(`${url}/${path}/roadGetSCTDInfo?${stringify(params)}`);
}

// 生成提单 - 生成 - 承运单位(查询合同已有的)
export async function getCarrierInfoByCid(payload) {
    const path = pathObj[payload.ContractType];
    delete payload.ContractType;

    const body = formData(payload);
    return request(`${url}/${path}/searchHtcys`, {
        method: 'POST',
        body,
    });
}

// 生成提单 - 生成 - 承运单位(查询所有可用的)
export async function getAllCarrierInfoByCid(payload) {
    const path = pathObj[payload.ContractType];
    delete payload.ContractType;

    const body = formData(payload);
    return request(`${url}/${path}/searchHtcyIncldCydws`, {
        method: 'POST',
        body,
    });
}

// 生成提单 - 承运单位 - 保存
export async function saveCarrierInfo(payload) {
    const path = pathObj[payload.ContractType];
    delete payload.ContractType;

    const body = formData(payload);
    return request(`${url}/${path}/resetCydwToHtxx`, {
        method: 'POST',
        body,
    });
}

// 生成提单 - 生成 - 保存
export async function saveLading(payload) {
    const path = pathObj[payload.LadingType];

    const body = formData(payload);
    return request(`${url}/${path}/roadsctd`, {
        method: 'POST',
        body,
    });
}

// 设置启用/禁用
export async function setStatus(payload) {
    const path = pathObj[payload.LadingType];
    delete payload.LadingType;

    const body = formData(payload);
    return request(`${url}/${path}/roadSetTDStatus`, {
        method: 'POST',
        body,
    });
}

// 删除提单
export async function delLading(payload) {
    const path = pathObj[payload.LadingType];
    delete payload.LadingType;

    const body = formData(payload);
    return request(`${url}/${path}/roadDeleteTD`, {
        method: 'POST',
        body,
    });
}

// 设置提货上限
export async function setLimit(payload) {
    const path = pathObj[payload.LadingType];
    delete payload.LadingType;

    const body = formData(payload);
    return request(`${url}/${path}/roadSetTHSX`, {
        method: 'POST',
        body,
    });
}

// 车数调整
export async function setAdjust(payload) {
    const path = pathObj[payload.LadingType];
    delete payload.LadingType;

    const body = formData(payload);
    return request(`${url}/${path}/roadSetCSTZ`, {
        method: 'POST',
        body,
    });
}

// 提单明细
export async function getLadingView(payload) {
    const body = formData(payload);
    return request(
        `${url}/road/searchPageGxpcxxs`,
        {
            method: 'POST',
            body,
        },
        undefined,
        false,
        true
    );
}

// 提单记录 - 下量记录查询
export async function getRecordAmount(params) {
    const path = pathObj[params.LadingType];
    delete params.LadingType;

    return request(`${url}/${path}/roadGetXiaL?${stringify(params)}`);
}

// 提单记录 - 返量记录查询
export async function getRecordReturnAmount(params) {
    const path = pathObj[params.LadingType];
    delete params.LadingType;

    return request(`${url}/${path}/roadGetFanL?${stringify(params)}`);
}

// 设置平账之前的提示
export async function setBalancingAccountBefore(payload) {
    const path = pathObj[payload.LadingType];

    const body = formData(payload);
    return request(`${url}/${path}/savePZBefore`, {
        method: 'POST',
        body,
    });
}

// 平账
export async function setBalancingAccount(payload) {
    const path = pathObj[payload.LadingType];

    const body = formData(payload);
    return request(`${url}/${path}/roadSavePZ`, {
        method: 'POST',
        body,
    });
}

// 清算
export async function ladingLiquidation(payload) {
    const path = pathObj[payload.LadingType];
    delete payload.LadingType;

    const body = formData(payload);
    return request(`${url}/${path}/tdqs`, {
        method: 'POST',
        body,
    });
}

// 提单查询
export async function ladingInfoQuery(params) {
    let path;
    switch (params.payload.sort) {
        case 'lading':
            path = 'roadxstd';
            break;
        case 'purchase':
            path = 'roadcgtd';
            break;
        default:
            path = 'roadzxtd';
            break;
    }
    return request(`${url}/${path}/${params.payload.model}?${params.payload.path}`);
}
// 更新提货单价
export async function updateLadingUnitPrice({ payload }) {
    const body = formData(payload);
    let path;
    switch (payload.sort) {
        case 'lading':
            path = 'roadxstd';
            break;
        case 'purchase':
            path = 'roadcgtd';
            break;
        default:
            path = 'roadzxtd';
            break;
    }
    return request(`${url}/${path}/roadupdateTHDJ`, {
        method: 'POST',
        body,
    });
}
// 提单管理保存
export async function saveLadingDownAmount({ payload }) {
    const body = formData(payload);
    let path;
    switch (payload.sort) {
        case 'lading':
            path = 'roadxstd';
            break;
        case 'purchase':
            path = 'roadcgtd';
            break;
        default:
            path = 'roadzxtd';
            break;
    }
    return request(`${url}/${path}/roadUpdateXSTD`, {
        method: 'POST',
        body,
    });
}
// 提单管理返量
export async function ladingReturn({ payload }) {
    const body = formData(payload);
    let path;
    let src;
    switch (payload.sort) {
        case 'lading':
            path = 'roadxstd';
            break;
        case 'purchase':
            path = 'roadcgtd';
            break;
        default:
            path = 'roadzxtd';
            break;
    }
    if (payload.isFull) {
        src = `${url}/${path}/roadSaveAllTDFH`;
    } else {
        src = `${url}/${path}/roadSaveTDFH`;
    }
    return request(src, {
        method: 'POST',
        body,
    });
}

// 获取单位名称
export async function getUnitName(payload) {
    const body = formData(payload);
    return request(`${url}/finance/getSubCustomers`, {
        method: 'POST',
        body,
    });
}

// 直销 - 保存运费单价
export async function saveFreight(payload) {
    const body = formData(payload);
    return request(`${url}/roadzxtd/zxyfdj`, {
        method: 'POST',
        body,
    });
}

// 获取运费单价
export async function getFreight(payload) {
    const body = formData(payload);
    return request(`${url}/roadzxtd/searchYfdjList`, {
        method: 'POST',
        body,
    });
}

// 直销 - 票据查询
export async function getBillList(payload) {
    const body = formData(payload);
    return request(
        `${url}/roadzxtd/searchPiaoJuList`,
        {
            method: 'POST',
            body,
        },
        undefined,
        false,
        true
    );
}

// 直销结算
export async function getDirectSettlement(payload) {
    const body = formData(payload);
    return request(`${url}/roadzxtd/settlement`, {
        method: 'POST',
        body,
    });
}

// 提单返量 - 未完成车辆
export async function getUnfinishedVehicleList(payload) {
    const body = formData(payload);
    return request(`${url}/road/wwcPcxxSearch`, {
        method: 'POST',
        body,
    });
}

// 平账明细
export async function getBalancingAccountList(payload) {
    const path = pathObj[payload.LadingType];
    delete payload.LadingType;

    const body = formData(payload);
    return request(`${url}/${path}/getTDPZHst`, {
        method: 'POST',
        body,
    });
}

// 过磅类型
export async function setWeighType(payload) {
    const path = pathObj[payload.LadingType];
    delete payload.LadingType;

    const body = formData(payload);
    return request(`${url}/${path}/setGbzhlx`, {
        method: 'POST',
        body,
    });
}
