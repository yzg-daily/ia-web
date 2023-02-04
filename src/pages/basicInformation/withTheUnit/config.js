export const FormConfig = [
    {
        name: 'name',
        label: '单位名称',
        type: 'text',
        grid: 6 / 24,
        dataType: 'number',

        placeholder: '请输入关键词...',
    },
];
export const ColumnsConfig = [
    {
        title: '单位名称',
        key: 'name',
        dataIndex: 'name',
        width: 180,
        display: true,
    },
    {
        title: '社会信用代码',
        key: 'sccode',
        dataIndex: 'sccode',
        width: 180,
        display: true,
    },
    {
        title: '单位简称',
        key: 'sname',
        dataIndex: 'sname',
        width: 180,
        display: true,
    },
    {
        title: '单位负责人',
        key: 'director',
        dataIndex: 'director',
        width: 100,
        display: true,
    },
    {
        title: '联系电话',
        key: 'telno',
        dataIndex: 'telno',
        width: 100,
        display: true,
    },
    {
        title: '所在地区',
        key: 'pcainfo',
        dataIndex: 'pcainfo',
        width: 200,
        display: true,
        render: pcainfo => `${pcainfo?.pname || ''}${pcainfo?.cname || ''}${pcainfo?.aname || ''}`,
    },
];
export const ModalFormConfig = [
    {
        name: 'name',
        label: '单位名称',
        type: 'text',
        dataType: 'string',
        grid: 12 / 24,
        required: true,
        disabled: true,
        placeholder: '请输入单位名称',
        style: {
            width: 200,
        },
    },
    {
        name: 'sccode',
        label: '社会信用代码',
        type: 'text',
        dataType: 'string',
        grid: 12 / 24,
        required: true,
        // max: 18,
        // min: 18,
        disabled: true,
        placeholder: '请输入社会信用代码',
        style: {
            width: 200,
        },
        layout: { labelSpan: 8, wrapperSpan: 14 },
    },
    {
        name: 'sname',
        label: '单位简称',
        type: 'text',
        dataType: 'string',
        grid: 12 / 24,
        required: true,
        placeholder: '请输入单位简称',
        style: {
            width: 200,
        },
    },
    {
        name: 'addr',
        label: '单位地址',
        type: 'text',
        grid: 12 / 24,
        required: true,
        dataType: 'string',
        disabled: true,
        placeholder: '请输入单位地址',
        style: {
            width: 200,
        },
        layout: { labelSpan: 8, wrapperSpan: 14 },
    },
    {
        name: 'director',
        label: '单位负责人',
        type: 'text',
        dataType: 'string',
        grid: 12 / 24,
        required: true,
        placeholder: '请输入单位负责人',
        style: {
            width: 200,
        },
    },
    {
        name: 'telno',
        label: '单位负责人电话',
        type: 'text',
        dataType: 'string',
        grid: 12 / 24,
        required: true,
        placeholder: '请输入单位负责人电话',
        style: {
            width: 200,
        },
        layout: { labelSpan: 8, wrapperSpan: 14 },
    },
    // { name: 'lxrsfz', label: '负责人身份证', type: 'text', dataType: 'string', grid: 12 / 24 },
    // {
    //     name: 'ywfzrid',
    //     label: '业务负责人',
    //     type: 'select',
    //     dataType: 'number',
    //     grid: 12 / 24,
    //     data: [],
    //     required: true,
    // },
    // {
    //     name: 'ywfzrid',
    //     label: '业务负责人',
    //     type: 'search',
    //     dataType: 'number',
    //     placeholder: '请输入业务负责人',
    //     grid: 12 / 24,
    //     required: true,
    //     style: {
    //         width: 200
    //     }
    // },
    // {
    //     name: 'ywfzrdh',
    //     label: '业务负责人电话',
    //     type: 'text',
    //     dataType: 'string',
    //     grid: 12 / 24,
    //     required: true,
    //     placeholder: '请输入业务负责人电话',
    //     layout: {labelSpan: 8, wrapperSpan: 14},
    //     style: {
    //         width: 200
    //     }
    // },
    {
        name: 'areaid',
        label: '所在地区',
        type: 'cascader-select',
        fieldNames: { label: 'ssqname', value: 'ssqid', children: 'children' },
        defaultValue: [],
        data: [],
        dataType: 'string',
        grid: 12 / 24,
        required: true,
        seekType: 2,
        placeholder: '请选择所在地址...',
        style: {
            width: 200,
        },
    },

    //
    // {
    //     name: 'khdj',
    //     label: '客户等级',
    //     type: 'select',
    //     dataType: 'string',
    //     grid: 12 / 24,
    //     placeholder: '请输入客户等级',
    //     required: true,
    //     style: {
    //         width: 200
    //     },
    //     layout: {labelSpan: 8, wrapperSpan: 14},
    // },
    // {
    //     name: 'yhid',
    //     label: '开户行',
    //     type: 'select',
    //     dataType: 'string',
    //     grid: 12 / 24,
    //     placeholder: '请输入开户行',
    //     style: {
    //         width: 200
    //     }
    // },
    // {
    //     name: 'yhzh',
    //     label: '银行账户',
    //     type: 'text',
    //     dataType: 'number',
    //     grid: 12 / 24,
    //     placeholder: '请输入银行账户',
    //     style: {
    //         width: 200
    //     }, layout: {labelSpan: 8, wrapperSpan: 14},
    // },
];
