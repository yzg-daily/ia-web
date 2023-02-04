export const FormConfig = [
    // {
    //     name: "ctrno",
    //     label: "合同编号",
    //     type: "text",
    //     grid: 8 / 24,
    //     placeholder: "请输入合同编号...",
    //     disabled: true
    // },
    // {
    //     name: "fysl",
    //     label: "合同数量",
    //     grid: 8 / 24,
    //     placeholder: "请输入合同数量...",
    //     required: true,
    //     disabled: true
    //
    // },
    // {
    //     name: "fysl",
    //     label: "合同金额",
    //     grid: 8 / 24,
    //     placeholder: "请输入合同金额...",
    //     required: true,
    //     disabled: true
    // },
    {
        name: 'paytype',
        required: true,
        label: '款项类型',
        type: 'select',
        grid: 8 / 24,
        data: [
            // { label: '补吨', value: 0 },
            { label: '现汇', value: 1 },
            { label: '承兑3', value: 3 },
            { label: '赊账', value: 4 },
            { label: '承兑6', value: 5 },
            { label: '顶账(承兑12)', value: 6 },
        ],
        placeholder: '请选择...',
    },
    {
        name: 'amt',
        label: '付款金额',
        grid: 8 / 24,
        placeholder: '请输入付款金额...',
        required: true,
    },
    {
        name: 'arvtime',
        label: '付款时间',
        type: 'datetime',
        grid: 8 / 24,
        placeholder: '请选择时间...',
        style: {
            width: 218,
        },
    },
    // {
    //     name: "cgdwdmc",
    //     label: "采购单位",
    //     grid: 8 / 24,
    //     placeholder: "请输入关键词...",
    //     disabled: true
    // },
    // {
    //     name: "xsdwdmc",
    //     label: "销售单位",
    //     type: "NewSearch",
    //     grid: 8 / 24,
    //     placeholder: "请输入关键词...",
    //     disabled: true
    // }
];
export const ColumnsConfig = [
    {
        title: '单位名称',
        key: 'compname',
        dataIndex: 'compname',
        width: 180,
        display: true,
    },
    {
        title: '类型',
        key: 'paytypename',
        dataIndex: 'paytypename',
        width: 180,
        display: true,
    },
    {
        title: '合同编号',
        key: 'ctrno',
        dataIndex: 'ctrno',
        width: 180,
        display: true,
    },

    {
        title: '款项类型',
        key: 'rptypename',
        dataIndex: 'rptypename',
        width: 100,
        display: true,
    },

    { title: '金额', key: 'amt', width: 100, display: true, dataIndex: 'amt' },
    {
        title: '到账时间',
        key: 'arvtime',
        dataIndex: 'arvtime',
        width: 200,
        display: true,
    },
    {
        title: '录入时间',
        key: 'addtime',
        dataIndex: 'addtime',
        width: 200,
        display: true,
    },
    {
        title: '操作员',
        key: 'uname',
        dataIndex: 'uname',
        width: 200,
        display: true,
    },
    {
        title: '来源',
        key: 'sourcename',
        dataIndex: 'sourcename',
        width: 200,
        display: true,
    },
    {
        title: '备注',
        key: 'remark',
        dataIndex: 'remark',
        width: 200,
        display: true,
    },
];
