import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import PageIndex from '@/components/businessComponent/PageIndex';
import SalesModel from '@/components/businessComponent/SelfModal';
import Table from '@/components/businessComponent/Table';
import EditFrom from '@/components/EditFrom';
// import { ColumnsConfig, FormConfig, ModalFormConfig,detailsConfig } from './config';
// import * as api from './api';
import { Button } from 'antd';

import { tips, useUpdate } from '@/utils/utils';
import moment from 'moment';

// import print from 'print-js'

// import 'print-js/dist/print.css';

const Index = props => {
    const update = useUpdate();
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [record, setRecord] = useState({});
    const modelPropTitle = useRef('');
    const modelFormRef = useRef('');
    const PageIndexRef = useRef('');
    const selectedRowKeys = useRef(null);
    const addStatus = useRef(false);
    const addRows = useRef([]);
    const [seeVisible, setSeeVisible] = useState(false);

    const { api, ColumnsConfig, FormConfig, ModalFormConfig, detailsConfig, gxlx } = props;

    const seeData = useRef({
        modelProp: {
            title: '派车明细',
            width: 1000,
            footerType: 'props',
            handleModalCancel: seeModalCancel,
            footer: [
                {
                    onClick: seeModalCancel,
                    title: '关闭',
                    key: 'handleModalCancel',
                },
            ],
        },
        tableProps: {
            dataSource: [],
            unique: 'uuid',
            columns: detailsConfig,
            onSelectChange(key, rows, index) {
                seeData.current.index = index;
            },
            getTableData: api.details,
        },
        async delRows() {
            const { dataSource } = seeData.current.tableProps;
            const index = seeData.current?.index;
            const id = selectedRowKeys.current[0];
            const res = await api.del({ id, query: true });
            if (res?.data) {
                if (index !== null && dataSource?.length) {
                    tips({ message: '删除成功', type: 'success' });
                    seeData.current.tableProps.dataSource.splice(index, 1);
                    update();
                }
            }
        },
    });

    const unique = 'uuid';

    function seeModalCancel() {
        const { tableProps } = seeData.current;
        seeData.current.tableProps = {
            ...tableProps,
            index: null,
            dataSource: [],
        };
        setSeeVisible(false);
    }

    function add() {
        const current = selectedRowKeys.current;

        if (!current?.length) {
            tips({ message: '请选择要操作的数据' });
            return false;
        }
        // 备注：生成关联合同进行勾选选择：只能勾选采购单位、销售单位、发货单位、收货单位、货物名称、规格型号一致的计划；
        // 否则不能生成关联合同：提示勾选的信息不满足生成关联合同规则，请重新选择！
        if (!addStatus.current) {
            tips({ message: '勾选的信息不满足生成关联合同规则，请重新选择！', type: 'error' });
            return false;
        }
        const { cgfmc, xsfmc, hwmc, ggmc, fyslNum } = addRows.current?.[0] || {};
        setRecord({ cgfmc, xsfmc, hwmc, ggmc, fysl: fyslNum });
        modelPropTitle.current = '关联合同';
        setVisible(true);
    }

    async function see() {
        const current = selectedRowKeys.current;
        const id = current?.[0];

        if (!id) {
            tips({ message: '请选择要操作的数据' });
            return false;
        }
        seeData.current.tableProps.payload = { id };
        // const res = await api.details({ id, query: true });
        //
        // const data = res?.data;
        // if (!data?.length) {
        //     tips({ message: "暂无明细数据" });
        //     return false;
        // }
        // seeData.current.tableProps.dataSource = data;
        setSeeVisible(true);
    }

    const btnList = [
        <Button key={'add'} type='primary' onClick={add}>
            生成关联合同
        </Button>,
        <Button key={'del'} type='danger' onClick={see}>
            查看明细
        </Button>,
    ];

    const prop = {
        ...props,
        api,
        unique,
        formValues: { gxlx },
        ColumnsConfig,
        FormConfig,
        tableConfig: {
            id: 'print-table',
            filterMultiple: true,
            onSelectChange,
        },
        btnList,

        format: 'yyyy-MM-dd hh:mm:ss',
        record: {
            ttype: '1',
            stime: moment(new Date('2016-01-01')),
            etime: moment(),
        },
    };

    function handleModalCancel() {
        setVisible(false);
        setLoading(false);
        setRecord({});
    }

    function getDiff(data) {
        if (!Array.isArray(data) || !data.length) return false;
        const isEqual = (a, b) => {
            return 'cgdwdm,xsdwdm,fhdwdm,hwid,ggid,shdwdm'.split(',').every(key => a[key] === b[key]);
        };
        let fysl = data?.[0]?.fysl || 0;
        let status = data.slice(1).every(row => {
            console.log(row?.fysl, 'row?.fysl');
            fysl += row?.fysl || 0;
            return isEqual(row, data[0]);
        });
        return {
            status,
            fysl,
        };
    }

    function onSelectChange(Keys, rows, index) {
        const length = rows?.length;
        if (!length) {
            addStatus.current = false;
            return false;
        }
        // const newRows = rows?.map(el => {
        //     const { cgdwdm, xsdwdm, fhdwdm, hwid, ggid, shdwdm } = el;
        //     return [cgdwdm, xsdwdm, fhdwdm, hwid, ggid, shdwdm];
        // }) || [];
        // const first = newRows?.shift() || [];
        // // addStatus.current = newRows.every((el) => lodash.isEqual(first, el));
        // addStatus.current = newRows.every((el) => el.every(elm => first.includes(elm)));
        // console.log(addStatus.current);
        const { fysl = 0, status = false } = getDiff(rows);
        addStatus.current = status;

        // fysl 要相加

        if (addStatus.current) {
            addRows.current = rows;
            rows[0].fyslNum = fysl;
            selectedRowKeys.current = Keys;
        }
    }

    const modelProp = {
        title: modelPropTitle.current,
        loading,
        visible,
        width: 800,
        handleModalCancel,
        handleModalOk: () => {
            const form = modelFormRef.current?.props?.form;
            if (form) {
                form.validateFields(async (error, values) => {
                    if (error) return false;
                    setLoading(true);
                    const { yslx, fysl, fklx, dj } = values;
                    const res = await api.save({
                        query: true,
                        uuids: selectedRowKeys.current.toString(),
                        yslx,
                        fysl,
                        fklx,
                        dj,
                    });

                    setLoading(false);
                    if (res?.data) {
                        tips({ message: res?.msg || '操作成功', type: 'success' });
                        handleModalCancel();
                        PageIndexRef?.current?.getTableData();
                    }
                });
            }
        },
    };

    const seeModelProp = {
        loading,
        visible,
        width: 800,
        handleModalCancel,
    };

    function changeInput() {
        ModalFormConfig[0].disabled = false;
        ModalFormConfig[1].disabled = false;
        ModalFormConfig[3].disabled = false;
        modelFormRef.current?.props?.form.setFieldsValue();
    }

    function searchChange(ops) {
        if (ops?.xydm) {
            const prop = {
                name: ops?.name,
                sccode: ops.xydm,
                addr: ops?.addr,
            };
            const form = modelFormRef.current?.props?.form;
            if (form) {
                form.setFieldsValue(prop);
            } else {
                setRecord({
                    ...record,
                    ...prop,
                });
            }
        }
    }

    return (
        <>
            <PageIndex {...prop} ref={PageIndexRef} />
            {visible && (
                <SalesModel {...modelProp}>
                    <EditFrom controls={ModalFormConfig} record={record} wrappedComponentRef={modelFormRef} />
                    <Table dataSource={addRows.current} unique={'uuid'} columns={ColumnsConfig} />
                </SalesModel>
            )}
            <SalesModel {...seeData.current.modelProp} visible={seeVisible}>
                <div>
                    {/*<Button type={'danger'} onClick={seeData.current.delRows}>*/}
                    {/*    删除*/}
                    {/*</Button>*/}
                    <Table {...seeData.current.tableProps} />
                </div>
            </SalesModel>
        </>
    );
};
const connectFun = ({ login }) => ({
    userLogin: login,
});
export default connect(connectFun)(Index);
