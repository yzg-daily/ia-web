export default {
    // 常规选项卡内容
    convention: [
        {
            name: 'name',
            label: '节点名称',
            type: 'input',
            dataType: 'string',
            required: false,
            grid: 24 / 24,
            disabled: false,
            placeholder: '输入节点名称',
        },
    ],
    formData: {
        // 默认
        empty: [],
        // 抄送节点
        ccNode: [
            {
                name: 'assignee',
                label: '抄送人',
                type: 'tag',
                dataType: 'string',
                required: false,
                grid: 24 / 24,
                disabled: false,
                placeholder: '请选择抄送人',
                data: [],
            },
        ],
        // 审批节点
        examineAndApproveNode: [
            {
                name: 'signedTypes',
                label: '审批类型',
                type: 'select',
                dataType: 'string',
                required: false,
                grid: 24 / 24,
                disabled: false,
                placeholder: '请选择签署类型',
                data: [
                    { value: 0, label: '普通签' },
                    { value: 1, label: '会签' },
                    { value: 2, label: '依次签' },
                    { value: 3, label: '或签' },
                ],
            },
            {
                name: 'assignee',
                label: '审批人',
                type: 'tag',
                dataType: 'string',
                required: false,
                grid: 24 / 24,
                disabled: false,
                placeholder: '请选择审批人',
                data: [],
            },
        ],
    },
};
