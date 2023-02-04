const { publicEnms } = window;
import * as datetime from '@/utils/datetime';
import { renderNumber } from '@/utils/utils';
export const FormConfig = [
    {
        name: 'cgdwdm',
        label: '采购单位',
        type: 'NewSearch',
        grid: 8 / 24,
        placeholder: '请输入关键词...',
        ops: {
            url: `${publicEnms}/iaBase/selectKeyComps`,
        },
    },
    {
        name: 'xsdwdm',
        label: '销售单位',
        type: 'NewSearch',
        grid: 8 / 24,
        placeholder: '请输入关键词...',
        ops: {
            url: `${publicEnms}/iaBase/selectKeyComps`,
        },
    },
    {
        name: 'fhdwdm ',
        label: '发货单位',
        type: 'NewSearch',
        grid: 8 / 24,
        placeholder: '请输入关键词...',
        ops: {
            url: `${publicEnms}/iaBase/selectKeyComps`,
        },
    },

    {
        name: 'hwid',
        label: '货物名称',
        type: 'select',
        grid: 8 / 24,
        placeholder: '请选择...',
    },
    {
        name: 'ggid',
        label: '规格型号',
        type: 'select',
        grid: 8 / 24,
        placeholder: '请选择...',
    },
    {
        name: 'shdwdm',
        label: '收货单位',
        type: 'NewSearch',
        grid: 8 / 24,
        placeholder: '请输入关键词...',
        ops: {
            url: `${publicEnms}/iaBase/selectKeyComps`,
        },
    },

    {
        name: 'ttype',
        label: '时间类型',
        type: 'select',
        data: [
            { label: '派车时间', value: '1' },
            { label: '发货过磅时间    ', value: '2' },
            { label: '收货过磅时间', value: '3' },
        ],
        grid: 8 / 24,
        placeholder: '请选择...',
    },
    {
        name: 'stime',
        label: '开始时间',
        type: 'datetime',
        grid: 8 / 24,
        placeholder: '请选择时间...',
        style: {
            width: 218,
        },
    },
    {
        name: 'etime',
        label: '结束时间',
        type: 'datetime',
        grid: 8 / 24,
        placeholder: '请选择时间...',
        style: {
            width: 218,
        },
    },
];
export const ColumnsConfig = [
    {
        title: '合同编号',
        key: 'thdh',
        dataIndex: 'thdh',
        width: 200,
        display: true,
    },
    {
        title: '采购单位',
        key: 'cgfmc',
        dataIndex: 'cgfmc',
        width: 200,
        display: true,
    },
    {
        title: '销售单位',
        key: 'xsfmc',
        dataIndex: 'xsfmc',
        width: 200,
        display: true,
    },
    {
        title: '中转单位',
        key: 'zzdwmc',
        dataIndex: 'zzdwmc',
        width: 200,
        display: true,
    },

    {
        title: '发货单位',
        key: 'fhdwmc',
        dataIndex: 'fhdwmc',
        width: 200,
        display: true,
    },
    {
        title: '发货合同单位',
        key: 'fhhtmc',
        dataIndex: 'fhhtmc',
        width: 200,
        display: true,
    },

    // { title: "收货单位", key: "shdwmc", width: 200, display: true, dataIndex: "shdwmc" },
    {
        title: '货物名称',
        key: 'hwmc',
        dataIndex: 'hwmc',
        width: 200,
        display: true,
    },
    {
        title: '规格型号',
        key: 'ggmc',
        dataIndex: 'ggmc',
        width: 200,
        display: true,
    },
    {
        title: '发货数量',
        key: 'fhsl',
        dataIndex: 'fhsl',
        width: 200,
        display: true,
    },
    {
        title: '收货数量',
        key: 'fysl',
        dataIndex: 'fysl',
        width: 200,
        display: true,
    },
    {
        title: '款项类型',
        key: 'fklxname',
        dataIndex: 'fklxname',
        width: 100,
        display: true,
    },
    {
        title: '执行价格',
        key: 'dj',
        dataIndex: 'dj',
        width: 100,
        display: true,
    },
    {
        title: '提单开始时间',
        key: 'kssj',
        dataIndex: 'kssj',
        width: 200,
        display: true,
    },
    {
        title: '提单结束时间',
        key: 'jssj',
        dataIndex: 'jssj',
        width: 200,
        display: true,
    },
    {
        title: '操作人',
        key: 'czrmc',
        dataIndex: 'czrmc',
        width: 200,
        display: true,
    },
    {
        title: '操作时间',
        key: 'czsj',
        dataIndex: 'czsj',
        width: 200,
        display: true,
    },
];
export const ModalFormConfig = [
    // {
    //     name: "ctrno",
    //     label: "合同编号",
    //     type: "text",
    //     grid: 12 / 24,
    //     placeholder: "请输入合同编号..."
    // },
    // {
    //     name: "ctrno",
    //     label: "合同类型",
    //     type: "text",
    //     grid: 12 / 24,
    //     placeholder: "请输入合同类型..."
    // },
    {
        name: 'cgfmc',
        label: '采购单位',
        grid: 12 / 24,
        placeholder: '请输入关键词...',
        disabled: true,
    },
    {
        name: 'xsfmc',
        label: '销售单位',
        grid: 12 / 24,
        placeholder: '请输入关键词...',

        disabled: true,
    },
    {
        name: 'hwmc',
        label: '货物名称',
        grid: 12 / 24,
        placeholder: '请选择...',
        disabled: true,
    },
    {
        name: 'ggmc',
        label: '规格型号',

        grid: 12 / 24,
        placeholder: '请选择...',
        disabled: true,
    },
    {
        name: 'yslx',
        label: '运输方式',
        type: 'select',
        grid: 12 / 24,
        data: [
            { label: '配送', value: 1 },
            { label: '自提', value: 2 },
        ],
        placeholder: '请选择...',
        required: true,
    },
    {
        name: 'fysl',
        label: '合同数量',
        grid: 12 / 24,
        placeholder: '请输入合同数量...',
        required: true,
        disabled: true,
    },
    {
        name: 'fklx',
        label: '款项类型',
        type: 'select',
        grid: 12 / 24,
        data: [
            { label: '现汇', value: 1 },
            { label: '承兑3', value: 3 },
            { label: '赊账', value: 4 },
            { label: '承兑6', value: 5 },
            { label: '顶账(承兑12)', value: 6 },
        ],
        placeholder: '请选择...',
        required: true,
    },
    {
        name: 'dj',
        label: '价格',
        grid: 12 / 24,
        placeholder: '请输入...',
        required: true,
    },

    // {
    //     name: "stime",
    //     label: "开始时间",
    //     type: "datetime",
    //     grid: 12 / 24,
    //     placeholder: "请选择时间..."
    //     // style: {
    //     //     width: 218
    //     // }
    // },
    // {
    //     name: "etime",
    //     label: "结束时间",
    //     type: "datetime",
    //     grid: 12 / 24,
    //     placeholder: "请选择时间..."
    //     // style: {
    //     //     width: 218
    //     // }
    // }
];
export const detailsConfig = [
    { title: '派车单位', key: 'wlgs', width: 200, dispaly: true, render: (name, tag) => tag.dwmc },
    { title: '派车编号', key: 'pcbh', width: 200, dispaly: true, render: (name, tag) => tag.pcbh },
    {
        title: '派车时间',
        key: 'pcsj',
        width: 150,
        dispaly: true,
        render: (name, tag) => datetime.format(tag.pcsj, 'yyyy-MM-dd h:mm'),
    },
    {
        title: '过磅时间',
        key: 'gbsj',
        width: 150,
        dispaly: true,
        render: (name, tag) => datetime.format(tag.gbsj, 'yyyy-MM-dd h:mm'),
    },
    { title: '车牌号', key: 'cph', dataIndex: 'cph', width: 120, dispaly: true, render: (name, tag) => tag.cph },
    {
        title: '原发数量',
        key: 'yfsl',
        dataIndex: 'yfsl',
        width: 120,
        dispaly: true,
        render: (name, tag) => tag.yfsl,
    },
    { title: '皮重', key: 'spz', width: 120, dispaly: true, render: (name, tag) => tag.pz },
    { title: '毛重', key: 'smz', width: 120, dispaly: true, render: (name, tag) => tag.mz },
    {
        title: '实收数量',
        key: 'sssl',
        dataIndex: 'sssl',
        width: 120,
        dispaly: true,
        render: (name, tag) => tag.sssl,
    },
    {
        title: '扣水扣杂',
        key: 'kskz',
        dataIndex: 'kskz',
        width: 120,
        dispaly: true,
        render: (name, tag) => tag.kskz,
    },
    {
        title: '补吨',
        key: 'bdsl',
        dataIndex: 'bdsl',
        width: 120,
        dispaly: true,
        render: (name, tag) => tag.bdsl,
    },
    { title: '现汇单价', key: 'xjdj', dataIndex: 'xjdj', width: 120, dispaly: true },
    { title: '现汇数量', key: 'xjsl', dataIndex: 'xjsl', width: 120, dispaly: true },
    { title: '承兑单价(三)', key: 'cddj3', dataIndex: 'cddj3', width: 120, dispaly: true },
    { title: '承兑数量(三)', key: 'cdsl3', dataIndex: 'cdsl3', width: 120, dispaly: true },
    { title: '承兑单价(六)', key: 'cddj6', dataIndex: 'cddj6', width: 120, dispaly: true },
    { title: '承兑数量(六)', key: 'cdsl6', dataIndex: 'cdsl6', width: 120, dispaly: true },
    { title: '顶账单价', key: 'cddj12', dataIndex: 'cddj12', width: 120, dispaly: true },
    { title: '顶账数量', key: 'cdsl12', dataIndex: 'cdsl12', width: 120, dispaly: true },
    { title: '赊账单价', key: 'szdj', dataIndex: 'szdj', width: 120, dispaly: true },
    { title: '赊账数量', key: 'szsl', dataIndex: 'szsl', width: 120, dispaly: true },
    {
        title: '预结金额',
        key: 'jhdje',
        render: (name, tag) => renderNumber(tag.thdje),
        width: 120,
        dispaly: true,
        filter: true,
    },
    { title: '派车人员', key: 'pcymc', dataIndex: 'pcymc', width: 120, dispaly: true },
];
