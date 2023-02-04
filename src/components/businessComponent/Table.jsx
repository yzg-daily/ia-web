import React, { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Table from '@/components/DataTable/';
import { useUpdate } from '@/utils/utils';
import { ClearSelectedRowKeys } from '@/components/businessComponent/utils';

/**
 * @author yzh
 * @date 20221014
 *
 * Table的业务组件,组件内完成数据请求,分页功能。table所有的参数可以通过父级使用ref控制
 * @param payload Object  是接口需要的参数,父级传入 一般为form的values
 * getTableData(payload) 请求table数据,根据业务需求可以使用条件判断是否传入getTableData或使用dataSource传入数据。
 * @param deps Array  useEffect的deps,会触发getTableData(payload); useEffect(() => getTableData(payload), deps)
 * Table可以使用selectedRowKeys(keys, rows, index)函数获取选中的行的数据,无需通过model返回 <Table selectedRowKeys={selectedRowKeys}>
 *
 * 使用
 *  const tableProps = {
        unique: "uuid",
        getTableData: 条件 ? api.getTableData : null, // 条件判断是否请求接口，或者不传getTableData，使用dataSource传入数据
        columns,
        payload: { id: uuid } // 参数
        selectedRowKeys // 获取选中的行的数据
        turnPage // 分页功能
        model,
        total: 0,
        page: 1,
        size: 20,
        dataSource: [],
        ...table其他的参数
    };
 * <Table {...tableProps}>
 *
 *  简单用法 只展示
 *  <Table getTableData={getTableData}>
 *
 *  展示和需要获取选中的行的数据
 *  <Table getTableData={getTableData} onSelectChange={onSelectChange}>
 *
 *  获取table的相关数据  useRef
 *  <Table ref={ref}> ref通过 useImperativeHandle api 拿到 tableConfig 所有的数据，
 *
 *  刷新 Table
 *  ref.current.refresh()
 * */

const pageSize = 20;
const TableComponents = forwardRef((props, ref) => {
    const [refresh, setRefresh] = useState(false);
    const update = useUpdate();
    const turnPage = useCallback((page, size) => {
        tableConfig.current.page = page;
        tableConfig.current.size = size;
        update();
    }, []);
    const { deps = [], payload = {}, index, getTableData, ...rest } = props;
    const tableConfig = useRef({
        total: 0,
        page: 1,
        size: pageSize,
        dataSource: [],
        columns: [],
        unique: 'id',
        loading: false,
        model: '',
        turnPage,
        ...rest,
    });
    const { total, page, size, model } = tableConfig.current;
    useEffect(() => {
        if (getTableData && typeof getTableData === 'function') {
            getTableDataFun();
        }
    }, [total, page, size, model, refresh, ...deps]);
    const getTableDataFun = async () => {
        tableConfig.current.loading = true;
        update();
        const res = await getTableData?.({
            ...payload,
            page,
            size,
            query: true,
        });

        tableConfig.current.dataSource = res?.data || [];
        tableConfig.current.total = res?.total || 0;
        props?.model && ClearSelectedRowKeys(props, key);

        tableConfig.current.loading = false;
        update();
    };

    useImperativeHandle(ref, () => ({
        refresh: () => setRefresh(refresh => !refresh),
        ...tableConfig,
    }));

    return (
        <div className='businessComponent-table'>
            <Table {...tableConfig.current} ref={ref} />
        </div>
    );
});
export default memo(TableComponents);
