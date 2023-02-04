import React from 'react';
import { Modal, Button } from 'antd';
/**
 * ❤👌😘🎂🤳🐱‍👤😜👍💋🌹🎉😢🤦‍♀️💕😉😊👏😂🤣😍😒😁🙌🤦‍♂️🐱‍🏍💖🎶😎🤞✌🤷‍♂️🤷
 * ‍♀️🐱‍💻🐱‍🐉🐱‍👓🐱‍🚀✔👀😃✨🎁🤢🤔😆
 * 🚗🚓🚕🛺🚙🚌🚐🚎🚑🚒🚚🚛🚜🚘🚔🚖🏍🛵🛴🚲🛹🦼🦽🚍
 * ㊙㊗🈵🈲🉐㊙🆑🅾🆘🆎🅱🅰🕗🔲🔳🔹🔺🔻🔷🔸🔶
 * (●'◡'●)
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
