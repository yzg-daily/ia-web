import BIndex from '../components/index';

import { ColumnsConfig, detailsConfig, FormConfig, ModalFormConfig } from './config';

import * as api from './api';
const Index = props => {
    const prop = {
        api,
        ColumnsConfig,
        FormConfig,
        ModalFormConfig,
        detailsConfig,
        gxlx: 2,
    };

    return (
        <>
            <BIndex {...prop} />
        </>
    );
};

export default Index;
