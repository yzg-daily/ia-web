import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Button, Form, Select } from 'antd';
import Brackets from './Brackets';
import css from './index.less';
import { isFn } from '@/utils/utils';

const { Option } = Select;

const formItemLayout = {
    wrapperCol: { span: 24 },
};

const elementSize = { size: 'small', width: '100%' };
/**
 * 数据处理
 * @param {Object} data - 表达式key, value
 * @param {Array} original - 原始(已有)数据
 * @param {number} index - 数据层级
 * @param {string} procDefKey - 数据层级
 // * @return {Array}
 * */
const dataProcessing = (data, original, index, procDefKey) => {
    const current = original[index] ?? {};
    return { ...current, ...data, procDefKey };
};
const REG_EXP = /include|exclude|inside|outside/;
/**
 * 逻辑符转换
 * @description symbol值转换自定义逻辑判断符。其他符号直接返回
 * @param {'include'|'exclude'|'inside'|'outside'} symbol - 逻辑符
 * @param {string} before - 归属关系
 * @param {string} after - 种类
 * @param {number} expItemType - 数据类型。 1 字符串 2 数字
 * @return {string} symbol(before, after) | other logic symbol
 * */
const logicSymbol = (symbol, before, after, expItemType) => {
    if (expItemType === -1) return '';
    if (expItemType === 1) {
        if (REG_EXP.test(symbol)) {
            return `juel.${symbol}('${before}',${before}, '${after}')`;
        }
        return `${before ?? ''} ${symbol ?? ''} '${after ?? ''}'`;
    }
    if (REG_EXP.test(symbol)) {
        return `juel.${symbol}('${before}',${before}, '${after}')`;
    }
    return `${before ?? ''} ${symbol ?? ''} ${after ?? ''}`;
};

/**
 * 自定义逻辑符号检测
 * @param {'include'|'exclude'|'inside'|'outside'} condition
 * @return {string}
 * */
const isCustomLogicSymbol = condition => {
    if (!REG_EXP.test(condition)) return condition;
    switch (condition) {
        case 'include':
            return '包含';
        case 'exclude':
            return '不包含';
        case 'inside':
            return '属于';
        case 'outside':
            return '不属于';
        default:
            return '';
    }
};

/**回显数据*/
const previewEcho = (expression, dict, expItemType) => {
    if (expItemType === -1)
        return {
            original: '',
            conversion: '',
        };
    let conversion = '';
    let original = '';
    expression.forEach((item, index) => {
        const [current] = dict?.filter(items => items.value === item?.expItemName);
        if (index === 0) {
            conversion = `${item?.leftBracket ?? ''} ${current?.label ?? ''} ${isCustomLogicSymbol(
                item?.expItemSymbol
            )} ${item?.expItemValue ?? ''}`;
            original = `${item?.leftBracket ?? ''} ${logicSymbol(
                item?.expItemSymbol,
                current?.value,
                item?.expItemValue,
                expItemType
            )}`;
        } else {
            conversion += ` ${item?.logicSymbol ?? ''} ${item?.leftBracket ?? ''} ${current?.label ??
                ''} ${isCustomLogicSymbol(item?.expItemSymbol)} ${item?.expItemValue ?? ''} ${item?.rightBracket ??
                ''}`;
            original += ` ${item?.logicSymbol ?? ''} ${item?.leftBracket ?? ''} ${logicSymbol(
                item?.expItemSymbol,
                current?.value,
                item?.expItemValue,
                expItemType
            )} ${item?.rightBracket ?? ''}`;
        }
    });
    return {
        original: original.replace(/undefined/g, '').trim(),
        conversion: conversion
            .replace(/undefined/g, '')
            .replace(/&{2}/g, '并且')
            .replace(/(\|{2})/g, '或者')
            .trim(),
    };
};

/**
 * 更新表达式数据
 * @param {Array} data
 * @return {Array}
 */
const updateExpression = data => {
    const cache = [];
    let expressionString;
    if (data) {
        const [expression] = data.filter(item => item.name === 'expression');
        expressionString = expression?.pvmExpItems;
        expression?.pvmExpItems?.forEach(item => {
            cache.push(item);
        });
    }
    return { cache, expressionString };
};

const ExpressionForm = props => {
    const { form, record, ranking, onChange, expressionString, selectData, procDefKey } = props;
    const { getFieldDecorator } = form;

    const [expression, setExpression] = useState(expressionString);
    const [symbolList, setSymbolList] = useState([]);
    const [expItemType, setExpItemType] = useState(-1);

    const handleChange = event => {
        const [...copyExpression] = [...expressionString];
        const current = dataProcessing(event, copyExpression, ranking, procDefKey);
        copyExpression.splice(ranking, 1, current);
        setExpression(copyExpression);
    };

    const validatorIsNumber = (rule, value, callback) => {
        const symbol = />|<|>=|<=/;
        const expItemSymbol = form.getFieldValue('expItemSymbol');
        if (symbol.test(expItemSymbol) && !/^\d*$/g.test(value)) {
            callback(new Error('值只能是数字'));
        } else {
            callback();
        }
    };

    useEffect(() => {
        if (isFn(onChange)) {
            onChange(expression, expItemType);
        }
    }, [expression]);

    useEffect(() => {
        handleChange(record);
        if (record?.expItemName) {
            const [item] = props.businessList.filter(item => item.expItemName === record?.expItemName);
            const { symbolList = [], expItemType } = item ?? {};
            setSymbolList(symbolList ?? []);
            setExpItemType(expItemType);
        }
    }, [record]);

    useEffect(() => {
        props?.expressionForm && props?.expressionForm?.(form);
        return () => {
            setExpression([]);
        };
    }, []);

    return (
        <Form layout='inline' {...formItemLayout}>
            <Row gutter={[8, 8]} className={css.expressionForm}>
                {ranking > 0 ? (
                    <Col span={ranking > 0 ? 4 : 6}>
                        <Form.Item>
                            {getFieldDecorator('logicSymbol', {
                                initialValue: record?.logicSymbol,
                                rules: [{ required: true, message: '请选择逻辑关系!' }],
                            })(
                                <Select
                                    {...elementSize}
                                    disabled={props?.isReadOnly}
                                    onChange={ev => handleChange({ logicSymbol: ev })}
                                    placeholder='请选择逻辑关系'
                                >
                                    <Option value='&&' key='&&'>
                                        并且
                                    </Option>
                                    <Option value='||' key='||'>
                                        或者
                                    </Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                ) : null}
                <Col span={ranking > 0 ? 4 : 6}>
                    <Form.Item>
                        {getFieldDecorator('leftBracket', {
                            initialValue: record?.leftBracket ?? '',
                        })(
                            <Brackets
                                isReadOnly={props?.isReadOnly}
                                direction='leftBracket'
                                key='leftBracket'
                                placeholder='请选择优先级'
                                onChange={handleChange}
                            />
                        )}
                    </Form.Item>
                </Col>
                <Col span={ranking > 0 ? 4 : 6}>
                    <Form.Item>
                        {getFieldDecorator('expItemName', {
                            initialValue: record?.expItemName,
                            rules: [{ required: true, message: '请选择条件，条件不能为空' }],
                        })(
                            <Select
                                {...elementSize}
                                disabled={props?.isReadOnly}
                                onChange={ev => {
                                    handleChange({ expItemName: ev });
                                    const [{ symbolList, expItemType }] = props.businessList.filter(
                                        item => item.expItemName === ev
                                    );
                                    setSymbolList(symbolList ?? []);
                                    setExpItemType(expItemType);
                                }}
                                placeholder='请选择条件'
                            >
                                {selectData?.map(item => (
                                    <Option value={item.value} key={item.value}>
                                        {item.label}
                                    </Option>
                                ))}
                            </Select>
                        )}
                    </Form.Item>
                </Col>
                <Col span={ranking > 0 ? 4 : 6}>
                    <Form.Item>
                        {getFieldDecorator('expItemSymbol', {
                            initialValue: record?.expItemSymbol,
                            rules: [{ required: true, message: '请选择逻辑关系!' }],
                        })(
                            <Select
                                {...elementSize}
                                disabled={props?.isReadOnly}
                                onChange={ev => handleChange({ expItemSymbol: ev })}
                                placeholder='请选择逻辑关系'
                            >
                                {symbolList?.map?.(({ symbolName, symboleValue }) => (
                                    <Option value={symboleValue} key={symboleValue}>
                                        {symbolName}
                                    </Option>
                                ))}
                            </Select>
                        )}
                    </Form.Item>
                </Col>
                <Col span={ranking > 0 ? 4 : 6}>
                    <Form.Item>
                        {getFieldDecorator('expItemValue', {
                            initialValue: record?.expItemValue,
                            rules: [{ required: true, message: '请输入值' }, { validator: validatorIsNumber }],
                        })(
                            <Input
                                disabled={props?.isReadOnly}
                                {...elementSize}
                                key='expItemValue'
                                placeholder='请输入值'
                                onChange={ev => handleChange({ expItemValue: ev.target.value })}
                            />
                        )}
                    </Form.Item>
                </Col>
                {ranking > 0 ? (
                    <Col span={ranking > 0 ? 4 : 6}>
                        <Form.Item>
                            {getFieldDecorator('rightBracket', {
                                initialValue: record?.rightBracket ?? '',
                            })(
                                <Brackets
                                    isReadOnly={props?.isReadOnly}
                                    direction='rightBracket'
                                    key='rightBracket'
                                    placeholder='请选择优先级'
                                    onChange={handleChange}
                                />
                            )}
                        </Form.Item>
                    </Col>
                ) : null}
            </Row>
        </Form>
    );
};
const WrappedExpressionForm = Form.create({ name: 'expression_form' })(ExpressionForm);
const Expression = props => {
    const { onChange, echoData, element, businessList, isReadOnly } = props;
    // 节点ID
    const [nodeID, setNodeID] = useState('');
    // 地图，用于展示条件
    const [quantity, setQuantity] = useState([1]);
    // 表达式字符串转换源
    const [expressionString, setExpressionString] = useState([]);
    // 表达式转换结果
    const [expressionResult, setExpressionResult] = useState(null);
    // 业务字段数据
    const [selectData, setSelectData] = useState([]);
    const [expItemType, setExpItemType] = useState(-1);

    const execute = index => {
        const [...cp] = [...quantity];
        const [...cpExpressionString] = [...expressionString];
        if (index > 0) {
            cp.splice(index, 1);
            cpExpressionString.splice(index, 1);
        } else {
            cp.push(quantity.length + 1);
        }
        setExpressionString(cpExpressionString);
        setQuantity(cp);
    };

    useEffect(() => {
        const previewData = previewEcho(expressionString, selectData, expItemType);
        if (expressionString.length) {
            if (previewData?.conversion && previewData?.conversion !== expressionResult) {
                setExpressionResult(previewData.conversion);
                if (isFn(onChange)) {
                    // 更新后同步数据
                    onChange([
                        {
                            name: 'expression',
                            value: previewData.original,
                            pvmExpItems: expressionString,
                            id: element.id,
                            type: element.type,
                            expressionResult: previewData.conversion,
                        },
                    ]);
                }
            }
        }
    }, [expressionString]);

    useEffect(() => {
        if (echoData?.diagramID) {
            if (echoData?.list?.length) {
                const result = updateExpression(echoData?.list.filter(item => item.id === nodeID));
                const { cache, expressionString } = result;
                if (Array.isArray(cache) && cache.length) {
                    setQuantity(cache);
                }

                if (expressionString) {
                    setExpressionString(expressionString);
                }
            } else {
                setQuantity([1]);
                setExpressionString([]);
            }
        }
    }, [echoData]);

    useEffect(() => {
        // 更新业务字段数据
        if (Array.isArray(businessList)) {
            setSelectData(businessList.map(item => ({ value: item?.expItemName, label: item?.expItemNameCn })));
        }
    }, [businessList]);

    useEffect(() => {
        setNodeID(props.element.id);
        return () => {
            setExpressionString([]);
            setQuantity([1]);
            setNodeID('');
            setExpressionResult(null);
            setSelectData([]);
        };
    }, []);

    return (
        <div className={css.expression}>
            <Row gutter={16} className={css.expressionList}>
                {quantity.map((item, index) => {
                    return (
                        <Col span={24} key={index}>
                            <Row gutter={16}>
                                <Col span={21}>
                                    <WrappedExpressionForm
                                        {...props}
                                        key={`${index}_${item?.expItemName}`}
                                        ranking={index}
                                        expressionString={expressionString}
                                        selectData={selectData}
                                        onChange={(ev, expItemType) => {
                                            setExpressionString(ev);
                                            setExpItemType(expItemType);
                                        }}
                                        record={item}
                                    />
                                </Col>
                                <Col span={3}>
                                    <Button
                                        type='primary'
                                        htmlType='submit'
                                        disabled={isReadOnly}
                                        ghost
                                        onClick={() => execute(index)}
                                    >
                                        {index > 0 ? '删除' : '添加'}
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    );
                })}
            </Row>
            <Row gutter={16} className={css.expressionPreview}>
                <Col span={24} key='conversion'>
                    <div>
                        <h3>控制条件预览</h3>
                        <p>{expressionResult ?? '暂无数据'}</p>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Expression;
