import request from '@/utils/request';
const { entries } = Object;
const enms = window?.publicPaths?.statistics || window?.publicPath;
function formData(data) {
    const da = new FormData();
    entries(data.payload).forEach(([key, val]) => {
        if (key !== 'model' && key !== 'callback' && key !== 'turnPage' && val !== undefined) {
            da.append(key, val);
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
//左侧统计--就业、税收、年销售、年采购
export function getGroupTotal({ jtid }) {
    const data = new FormData();
    data.append('jtid', jtid);
    return request(`${enms}/groupDigitized/getGroupTotal`, {
        method: 'POST',
        body: data,
    });
}
//下侧折线图--营销产值(近三个月)
export function getSaleListByMonth({ jtid }) {
    const data = new FormData();
    data.append('jtid', jtid);
    return request(`${enms}/groupDigitized/getSaleListByMonth`, {
        method: 'POST',
        body: data,
    });
}
//下侧折线图--外购规模(近三个月)
export function getBuyListByMonth({ jtid }) {
    const data = new FormData();
    data.append('jtid', jtid);
    return request(`${enms}/groupDigitized/getBuyListByMonth`, {
        method: 'POST',
        body: data,
    });
}
//下侧折线图--产能任务(近三个月)
export function getOutputListByMonth({ jtid }) {
    const data = new FormData();
    data.append('jtid', jtid);
    return request(`${enms}/groupDigitized/getOutputListByMonth`, {
        method: 'POST',
        body: data,
    });
}
//下侧叠柱图--销售运力分析(近三个月)
export function getTransportListByMonth({ jtid }) {
    const data = new FormData();
    data.append('jtid', jtid);
    return request(`${enms}/groupDigitized/getTransportListByMonth`, {
        method: 'POST',
        body: data,
    });
}
//右下侧柱状图--库存量统计(前五个)
export function getStockListByType({ jtid }) {
    const data = new FormData();
    data.append('jtid', jtid);
    return request(`${enms}/groupDigitized/getStockListByType`, {
        method: 'POST',
        body: data,
    });
}
//饼图1--客户类型
export function getCustomerPie({ jtid }) {
    const data = new FormData();
    data.append('jtid', jtid);
    return request(`${enms}/groupDigitized/getCustomerPie`, {
        method: 'POST',
        body: data,
    });
}
//饼图2--供应商类型
export function getSupplierPie({ jtid }) {
    const data = new FormData();
    data.append('jtid', jtid);
    return request(`${enms}/groupDigitized/getSupplierPie`, {
        method: 'POST',
        body: data,
    });
}
//饼图3--人员结构
export function getPersPie({ jtid }) {
    const data = new FormData();
    data.append('jtid', jtid);
    return request(`${enms}/groupDigitized/getPersPie`, {
        method: 'POST',
        body: data,
    });
}
//饼图4--产品结构
export function getGoodsPie({ jtid }) {
    const data = new FormData();
    data.append('jtid', jtid);
    return request(`${enms}/groupDigitized/getGoodsPie`, {
        method: 'POST',
        body: data,
    });
}
//地图1 --内部企业分布图
export function getCompanyMap({ jtid }) {
    const data = new FormData();
    data.append('jtid', jtid);
    return request(`${enms}/groupDigitized/getCompanyMap`, {
        method: 'POST',
        body: data,
    });
}
//地图2 --供应商分布图
export function getSupplierMap({ jtid }) {
    const data = new FormData();
    data.append('jtid', jtid);
    return request(`${enms}/groupDigitized/getSupplierMap`, {
        method: 'POST',
        body: data,
    });
}
//地图3 --客户分布图
export function getCustomerMap({ jtid }) {
    const data = new FormData();
    data.append('jtid', jtid);
    return request(`${enms}/groupDigitized/getCustomerMap`, {
        method: 'POST',
        body: data,
    });
}
//公司组织架构树
export function getCompanyTree({ jtid }) {
    const data = new FormData();
    data.append('jtid', jtid);
    return request(`${enms}/groupDigitized/getCompanyTree`, {
        method: 'POST',
        body: data,
    });
}
