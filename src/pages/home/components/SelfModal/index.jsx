import React from 'react';
import { Modal, Button } from 'antd';
/**
 * β€ππππ€³π±βπ€ππππΉππ’π€¦ββοΈππππππ€£πππππ€¦ββοΈπ±βπππΆππ€βπ€·ββοΈπ€·
 * ββοΈπ±βπ»π±βππ±βππ±βπβππβ¨ππ€’π€π
 * ππππΊππππππππππππππ΅π΄π²πΉπ¦Όπ¦½π
 * γγπ΅π²πγππΎπππ±π°ππ²π³πΉπΊπ»π·πΈπΆ
 * (β'β‘'β)
 * */

const SelfModal = props => {
    const {
        children,
        visible,
        title,
        zIndex = 1000,
        width = 1300,
        footer,
        handleModalCancel,
        handleModalOk,
        rest,
        loading = false,
        footerType = undefined,
    } = props;
    const ModalFooter = footerType => {
        if (footerType === 'props') {
            return footer.map(el => {
                const { title, ...rest } = el;
                return (
                    <Button loading={loading} {...rest}>
                        {el.title}
                    </Button>
                );
            });
        }
        return footer;
    };
    return (
        <>
            <Modal
                destroyOnClose
                loading={loading}
                visible={visible}
                title={title}
                onCancel={handleModalCancel}
                onOk={handleModalOk || handleModalCancel}
                zIndex={zIndex}
                width={width}
                footer={ModalFooter(footerType)}
                {...rest}
            >
                {children}
            </Modal>
        </>
    );
};

export default SelfModal;
