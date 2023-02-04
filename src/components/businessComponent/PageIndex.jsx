import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import Table from '@/components/DataTable/';
import * as datetime from '@/utils/datetime';
import { ClearSelectedRowKeys, NewTips, setData } from '@/components/businessComponent/utils';
import { queryMethod } from '@/utils/utils';
import QueryFilter from '@/components/QueryFilter/QueryFilter';
import supplies from '@/components/businessComponent/supplies.less';

/**
 * model 对应某个 state        required
 * key   对应 state 里 的 key  required
 * */

let key = '';
const model = 'supplies';
let pageTitle = '';

const PageIndex = forwardRef((props, _ref) => {
    const {
        keyValue,
        FormConfig = undefined,
        ColumnsConfig, //初始 config
        api,
        btnList,
        formValues = {},
        unique = 'uuid',
        format = 'yyyy-MM-dd',
    } = props;

    /**
     *  form
     * */
    const [record, setRecord] = useState({ ...(props?.record || {}) });
    // const [Form, setForm] = useState(undefined);
    const Form = useRef(undefined);

    /* table */
    const [page, setPage] = useState(1); // 分页
    const [size, setSize] = useState(20); // 分页
    const [dataSource, setDataSource] = useState([]); // table 数据
    const [TableLoading, setTableLoading] = useState(false); // 加载
    const [tableTotal, setTableTotal] = useState(0); // total

    const { id, ...tableRest } = props?.tableConfig || {};
    /**
     *  暴露给父级的方法
     * */
    useImperativeHandle(_ref, () => ({
        changeSize: value => {
            setSize(value);
        },
        getTableData,
        Form,
        dataSource,
    }));

    /**
     * 页面处理表单值的方法,可以通过 props.formProps.handleFormValuesFun覆盖
     * @param {Object} values
     * */
    const PageHandlerFormValues =
        props?.formProps?.handleFormValuesFun ||
        useCallback(
            (values = {}) => {
                let payload = {};
                Object.entries(values).forEach(([key, val]) => {
                    if (val || val === 0) {
                        if (Array.isArray(val)) {
                            payload[key] = val[0]?.props?.value || val[0]?.props?.id || val[0]?.props?.uuid;
                        } else if (/dwdm/.test(key)) {
                            payload[key] = val[0]?.key || val;
                        } else if (val?._isAMomentObject) {
                            payload[key] = `${datetime.format(val, format)}`;
                        } else {
                            payload[key] = val;
                        }
                    }
                });
                return payload || {};
            },
            [props?.formProps?.handleFormValuesFun]
        );

    useEffect(() => {
        if (FormConfig?.length) {
            setData(FormConfig, Form);
        }
    }, [FormConfig]);
    /**
     *  获取路由中 name 字段值
     *  pageTitle 页面全局的参数 页面的 title
     *  设置全局的 key
     * */
    useEffect(() => {
        pageTitle = props?.route?.name;
        key = keyValue;
    }, [props?.route?.name, keyValue]);
    /**
     *  页面初始请求获取table的数据
     * */
    const getTableData = async () => {
        setTableLoading(true);

        const res = await api?.getTableData(
            PageHandlerFormValues({
                query: true,
                page,
                size,
                ...formValues,
                ...record,
            })
        );

        if (res) {
            const { data = [], total = 0 } = res;
            if (data && Array.isArray(data)) {
                setDataSource(data);
            }
            if (total !== tableTotal) {
                setTableTotal(total);
            }

            ClearSelectedRowKeys(props, key);
        } else {
            setTableTotal(0);
            setDataSource([]);
        }

        setTableLoading(false);
    };
    useEffect(() => {
        (async () => {
            await getTableData();
        })();
    }, [size, page, record]);

    function formQuery(queryFilter) {
        queryMethod(queryFilter, (error, values) => {
            if (error) {
                reject(error);
                return;
            }

            const { kssj, jssj, ...rest } = PageHandlerFormValues(values);
            if (kssj && jssj) {
                if (new Date(kssj).getTime() > new Date(jssj).getTime()) {
                    NewTips('结束时间不能小于开始时间', false);
                    return false;
                }
            }
            setRecord(values);
        });
    }

    const queryProps = {
        controls: FormConfig,
        query: formQuery,
        resetFields: formQuery,
        defaultMAX: 4,
        setForm: form => (Form.current = form),
        record: props?.record,
    };
    const turnPage = (current, pageSize) => {
        page !== current && setPage(current);
        pageSize !== size && setSize(pageSize);
    };
    const myTable = useMemo(
        () => (
            <Table
                total={props?.tableTotal || tableTotal}
                page={props?.page || page}
                pageSize={props?.size || size}
                size={props.size || size}
                dataSource={props?.dataSource || dataSource}
                turnPage={props?.turnPage || turnPage}
                columns={props?.ColumnsConfig || ColumnsConfig}
                unique={unique}
                loading={props?.loading || props?.TableLoading || TableLoading}
                model={model}
                onSelectChange={props?.onSelectChange}
                {...tableRest}
            />
        ),
        [props?.dataSource, dataSource, TableLoading, props?.TableLoading, props?.loading]
    );

    return (
        <>
            <div ref={_ref}>
                <PageHeaderWrapper title={pageTitle}>
                    <div className={supplies.qyWrap}>
                        {FormConfig && (
                            <div className={supplies.FormWarp}>
                                <QueryFilter {...queryProps} />
                            </div>
                        )}
                        <div className={supplies.TableWrap}>
                            {btnList && (
                                <div className={supplies.btnWrap}>
                                    {Boolean(btnList && btnList.length) && btnList.map(el => el)}
                                </div>
                            )}
                            <div id={id}>{myTable}</div>
                        </div>
                    </div>
                </PageHeaderWrapper>
            </div>
        </>
    );
});

export default React.memo(PageIndex);
