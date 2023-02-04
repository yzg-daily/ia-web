import React, { useEffect, useRef, useState } from 'react';
import DataEdit from '@/components/EditFrom';
import config from '../config';
import { isFn } from '@/utils/utils';

const Convention = props => {
    const { onChange, element } = props;
    const [dataSet, setDataSet] = useState([]);

    const elementRef = useRef();

    useEffect(() => {
        if (isFn(onChange)) {
            onChange(dataSet);
        }
    }, [dataSet]);

    useEffect(() => {
        setDataSet([{ name: 'name', value: element.businessObject.name, id: element.id, type: element.type }]);
        elementRef.current?.setFieldsValue({ name: element.businessObject.name });
        if (isFn(onChange) && element.businessObject.name) {
            onChange([{ name: 'name', value: element.businessObject.name, id: element.id, type: element.type }]);
        }
        return () => {
            setDataSet([]);
        };
    }, []);

    return (
        <DataEdit
            ref={elementRef}
            controls={config.convention.map(con => {
                const { ...item } = { ...con };
                if (item.name === 'name') {
                    item.disabled = props?.isReadOnly;
                    item.onBlur = event => {
                        setDataSet([
                            { name: 'name', value: event?.target?.value ?? '', id: element.id, type: element.type },
                        ]);
                    };
                }
                return item;
            })}
        />
    );
};

export default Convention;
