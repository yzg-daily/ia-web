// noinspection JSUnusedGlobalSymbols

import React, { useRef, useState } from 'react';
import { Button } from 'antd';
import { handleFormValues } from '@/components/businessComponent/utils';
import SelfModal from './index';
import EditFrom from '@/components/EditFrom/';

const PageModalForm = props => {
    const {
        ModalFormConfig,
        loading,
        forwardedRef = undefined,
        handleModalCancel,
        callBackValues = values => values,
        children,
        record,
        verify = true, // 默认true， false 的时候不验证表单
        CancelText = '关闭',
        AddText = '提交',

        ...rest
    } = props;
    // noinspection JSUnusedLocalSymbols
    const [visible, setVisible] = useState(false);
    const [ModalLoading, setModalLoading] = useState(false);
    const ModalForm = useRef(); // form

    const ModalCancel = () => {
        setVisible(false);
        ModalLoading && setModalLoading(false);
    };
    const handleModalAdd = () => {
        const { current } = ModalForm;
        /**
         * 不过滤任何参数简单验证之后返回values
         * */
        if (!verify) {
            current?.props?.form?.validateFieldsAndScroll((error, values) => {
                if (!error) {
                    callBackValues?.(values);
                }
            });
            return false;
        }
        if (current) {
            handleFormValues(current).then(values => {
                callBackValues && callBackValues(values);
            });
        }
    };
    const ModelConfig = {
        visible: true,
        loading: loading || ModalLoading,
        handleModalCancel: handleModalCancel || ModalCancel,
        width: 900,
        footer: [
            <Button key='handleChange' loading={loading || ModalLoading} onClick={handleModalCancel || ModalCancel}>
                {CancelText}
            </Button>,
            <Button type='primary' key='handleAdd' loading={loading || ModalLoading} onClick={handleModalAdd}>
                {AddText}
            </Button>,
        ],
        ...rest,
    };
    return (
        <>
            <SelfModal {...ModelConfig}>
                <>
                    <EditFrom
                        record={record}
                        controls={ModalFormConfig}
                        wrappedComponentRef={ref => {
                            ModalForm.current = ref;
                            if (forwardedRef) {
                                forwardedRef.current = ref;
                            }
                        }}
                    />
                    {children}
                </>
            </SelfModal>
        </>
    );
};
export default React.memo(PageModalForm);
