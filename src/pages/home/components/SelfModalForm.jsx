import React, { useRef, useState } from 'react';
import { Button } from 'antd';
import { handleFormValues } from '@/utils/method';
import SelfModal from '@/pages/home/components/SelfModal';
import EditFrom from '@/components/EditFrom/';

const SelfModalForm = props => {
    const {
        ModalFormConfig,
        loading,
        forwardedRef = undefined,
        handleModalCancel,
        callBackValues = values => values,
        record,
        ...rest
    } = props;
    const [visible, setVisible] = useState(false);
    const [ModalLoading, setModalLoading] = useState(false);
    const ModalForm = useRef(); // form

    const ModalCancel = () => {
        setVisible(false);
        ModalLoading && setModalLoading(false);
    };
    const handleModalAdd = () => {
        const { current } = ModalForm;
        if (current) {
            handleFormValues(current).then(values => {
                callBackValues && callBackValues(values);
            });
        }
    };
    const ModelConfig = {
        visible: true,
        loading,
        handleModalCancel: handleModalCancel || ModalCancel,
        width: 900,
        footer: [
            <Button type='primary' key='handleAdd' loading={loading || ModalLoading} onClick={handleModalAdd}>
                提交
            </Button>,
            <Button type='primary' key='handleChange' onClick={handleModalCancel || ModalCancel}>
                关闭
            </Button>,
        ],
        ...rest,
    };
    return (
        <>
            <SelfModal {...ModelConfig}>
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
            </SelfModal>
        </>
    );
};
export default React.memo(SelfModalForm);
