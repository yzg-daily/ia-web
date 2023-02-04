const { publicEnms } = window;
export const FormConfig = [
    {
        name: 'pstype',
        label: '购销类型',
        type: 'select',
        data: [
            { label: '采购', value: '1' },
            { label: '销售', value: '2' },
        ],
        grid: 8 / 24,
        placeholder: '请选择...',
    },
    {
        name: 'compcode',
        label: '单位名称',
        type: 'NewSearch',
        grid: 8 / 24,
        placeholder: '请输入关键词...',
        ops: {
            url: `${publicEnms}/iaBase/selectKeyComps`,
        },
    },
    {
        name: 'rptype',
        label: '收付款类型',
        type: 'select',
        grid: 8 / 24,
        data: [
            { label: '收款', value: '1' },
            { label: '付款', value: '2' },
            { label: '收款退款', value: '3' },
            { label: '付款退款', value: '4' },
        ],
        placeholder: '请选择...',
    },
    {
        name: 'paytype',
        label: '款项类型',
        type: 'select',
        grid: 8 / 24,
        data: [
            // { label: '补吨', value: '0' },
            { label: '现汇', value: '1' },
            { label: '承兑3', value: '3' },
            { label: '赊账', value: '4' },
            { label: '承兑6', value: '5' },
            { label: '顶账(承兑12)', value: '6' },
        ],
        placeholder: '请选择...',
    },
    {
        name: 'ctrno',
        label: '合同编号',
        type: 'text',
        grid: 8 / 24,
        placeholder: '请输入合同编号...',
    },
    {
        name: 'uname',
        label: '操作员：',
        type: 'text',
        grid: 8 / 24,
        placeholder: '请输入操作员...',
    },
    {
        name: 'addtime',
        label: '录入时间',
        type: 'range-datetime',
        grid: 8 / 24,
        placeholder: '请选择时间...',
        style: {
            maxWidth: '100%',
        },
        disabledDate: val => val > new Date(),
    },
    {
        name: 'arvtime',
        label: '到账时间',
        type: 'range-datetime',
        grid: 8 / 24,

        placeholder: '请选择时间...',
        style: {
            maxWidth: '100%',
        },
        disabledDate: val => val > new Date(),
    },
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
export const ModalFormConfig = [
    {
        name: 'ctrno',
        label: '合同编号',
        type: 'text',
        grid: 12 / 24,
        placeholder: '请输入合同编号...',
    },
    {
        name: 'amt',
        label: '合同金额',
        grid: 12 / 24,
        placeholder: '请输入合同金额...',
        required: true,
    },
    {
        name: 'rptype',
        label: '收付款类型',
        type: 'select',
        grid: 12 / 24,
        data: [
            { label: '收款', value: '1' },
            { label: '付款', value: '2' },
            { label: '收款退款', value: '3' },
            { label: '付款退款', value: '4' },
        ],
        placeholder: '请选择...',
        required: true,
    },
    {
        name: 'paytype',
        label: '款项类型',
        type: 'select',
        grid: 12 / 24,
        data: [
            // { label: '补吨', value: '0' },
            { label: '现汇', value: '1' },
            { label: '承兑3', value: '3' },
            { label: '赊账', value: '4' },
            { label: '承兑6', value: '5' },
            { label: '顶账(承兑12)', value: '6' },
        ],
        placeholder: '请输入关键词...',
        required: true,
    },
    {
        name: 'arvtime',
        label: '到账时间',
        type: 'datetime',
        grid: 12 / 24,

        placeholder: '请选择时间...',
        required: true,
        style: {
            width: 260,
        },
    },
    {
        name: 'purcode',
        label: '采购单位',
        type: 'NewSearch',
        grid: 12 / 24,
        placeholder: '请输入关键词...',
        ops: {
            url: `${publicEnms}/iaBase/selectKeyComps`,
        },
        required: true,
    },
    {
        name: 'salcode',
        label: '销售单位',
        type: 'NewSearch',
        grid: 12 / 24,
        placeholder: '请输入关键词...',
        ops: {
            url: `${publicEnms}/iaBase/selectKeyComps`,
        },
        required: true,
    },
    {
        name: 'remark',
        label: '备注',
        type: 'textarea',
        grid: 24 / 24,
        placeholder: '请输入',
        layout: { labelSpan: 3, wrapperSpan: 20 },
    },
];
