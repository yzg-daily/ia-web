import React, { Component, createRef } from 'react';
import { Button, Drawer, Input } from 'antd';
import ElementTemplate from './ElementTemplate';
import css from './index.less';
import { isFn } from '@/utils/utils';
import { encode, updateCachedData } from './utils';
import { CustomModeler } from './Custom/Modeler'; // 引入相关的依赖
import Modeler from 'bpmn-js/lib/Modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel'; // 这里引入的是右侧属性栏这个框
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'; // 左侧面板
import camundaDefault from './config/config';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import customPalette from './Custom/PaletteProvider'; // 自定义工具栏
import paletteEntries from './Custom/config/paletteEntries';
import 'bpmn-js/dist/assets/diagram-js.css'; // 以下为bpmn工作流绘图工具的样式 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { element } from 'prop-types';

class ApprovalFlowSettings extends Component {
    constructor(props) {
        super(props);

        this.containerRef = createRef();
        this.scale = 1.0;
        this.prefix = 'activiti:';
    }

    state = {
        diagramXML: null,
        visible: false,
        // 当前节点编号
        serialNumber: null,
        // 节点类型
        BPMN_TYPE: null,
        // 节点编号
        nodeNumber: null,
        // 数据缓存
        dataCache: [],
        // 当前选中图形
        currentShape: null,
        // 自定义属性前缀
        prefix: 'activiti',
        // 当前元素businessObject
        businessObject: {},
        rootElementName: null,
        resultSubmit: {
            procDefKey: '',
            pvms: [],
            pvmVars: [],
            pvmExps: [],
            pvmExpItems: [],
        },
        diagramID: null,
        echoDataJSON: null,
        lastUpdate: null,
        isSave: false,
        expressionForm: null,
    };

    componentDidMount() {
        const { url, palette, camunda, openDrawer, closeDrawer, isReadOnly } = this.props;
        const { diagramID } = this.state;

        // 自定义左侧工具栏配置
        const paletteConfig = palette || paletteEntries;

        this.diagramXMLFileID = diagramID ?? this.props.diagramID;

        this.setState({ diagramID: this.diagramXMLFileID });

        // MODEL中注入方法、获取数据
        this.customUpdate = {
            BPMN_TYPE: this.state.BPMN_TYPE,
            /*以下所有方法使用箭头函数，避免this指向错误*/
            /**打开弹框*/
            open: () => {
                if (this?.startEvent && /^bpmn:(UserTask|ManualTask|SequenceFlow)/.test(this?.startEvent?.type)) {
                    this.setState({ visible: true });
                    // 处理后续业务回调方法
                    if (isFn(openDrawer)) {
                        openDrawer({
                            procDefKey: this.diagramXMLFileID,
                            target: this?.startEvent,
                            modeler: this.BPMN_MODEL_MODELER,
                            echoDataJSON: this.state.dataCache,
                            nodeList: this.elementRegistry
                                .getAll()
                                .filter(item => item.type !== 'bpmn:Process')
                                .map(item => item.id),
                        });
                    }
                }
            },
            /**关闭弹框*/
            onClose: () => {
                this.setState({ visible: false, BPMN_TYPE: null, isSave: false });
                this.expressionForm = null;
                // 取消当前选中图形
                this.selections.deselect(this.startEvent);
                if (isFn(closeDrawer) && this.state.isSave) {
                    closeDrawer({
                        nodeData: this.state.dataCache,
                        nodeID: this.startEvent.id,
                        type: this.startEvent.type,
                    });
                }
            },
        };

        const customUpdateModule = {
            __init__: ['customUpdate'],
            customUpdate: ['value', this.customUpdate],
        };
        if (isReadOnly) {
        }
        const options = {
            container: this.containerRef.current,
            // 添加控制板
            propertiesPanel: {
                parent: '#js-properties-panel',
            },
            // 自定义左侧工具栏配置
            paletteEntries: paletteConfig,
            additionalModules: [
                // 左边工具栏以及节点
                customPalette,
                // 右边的工具栏
                propertiesPanelModule,
                propertiesProviderModule,
                customUpdateModule,
            ],
            moddleExtensions: {
                //如果要在属性面板中维护camunda：XXX属性，则需要此
                // camunda: { ...camundaModdleDescriptor, ...camunda },
                camunda: camunda || camundaDefault,
            },
        };
        // 建模
        this.BPMN_MODEL_MODELER = new CustomModeler(options);

        this.COM_STACK = this.BPMN_MODEL_MODELER.get('commandStack');

        this.modeling = this.BPMN_MODEL_MODELER.get('modeling');

        this.elementRegistry = this.BPMN_MODEL_MODELER.get('elementRegistry');

        this.bpmnFactory = this.BPMN_MODEL_MODELER.get('bpmnFactory');

        this.elementFactory = this.BPMN_MODEL_MODELER.get('elementFactory');

        this.moddle = this.BPMN_MODEL_MODELER.get('moddle');

        this.selections = this.BPMN_MODEL_MODELER.get('selection');

        this.BPMN_MODEL_MODELER.on('import.done', event => {
            const { error, warnings } = event;
            if (error) {
                return this.handleError(error);
            }
            if (warnings.length) {
                this.handleShown(warnings);
            }

            this.BPMN_MODEL_MODELER.get('canvas').zoom(this.scale, 'auto');

            // 获取根元素，以便后续更新页面名称
            this.rootElement = this.BPMN_MODEL_MODELER.getDefinitions();

            // 回显已有流程名称
            const { rootElements } = this.rootElement;

            const [rootElement] = rootElements;

            this.setState({
                rootElementName: rootElement?.name,
                resultSubmit: { ...this.state.resultSubmit, procDefKey: this.diagramXMLFileID },
            });

            /*
             * 修复历史数据错误，删除用户任务节点下出现的抄送任务
             * */
            const elementList = this.elementRegistry.getAll().filter(item => /^bpmn:UserTask/.test(item.type));
            if (elementList?.length) {
                elementList.forEach(item => {
                    if (item.businessObject.extensionElements) {
                        delete item.businessObject.extensionElements;
                    }
                });
            }

            return this.handleLoading();
        });

        // 须要使用eventBus
        this.eventBus = this.BPMN_MODEL_MODELER.get('eventBus');

        this.BPMN_MODEL_MODELER.on('element.click', event => {
            this.setState({
                BPMN_TYPE: event.element.type,
                currentShape: event.element,
                businessObject: event.element.businessObject,
            });

            this.startEvent = event.element;
            this.setState({ BPMN_TYPE: event.element.type, nodeNumber: event.element.id });
            if (/ManualTask/.test(event.element.type)) {
                this.modeling.updateProperties(event.element, {
                    incoming: [],
                    outgoing: [],
                });
            }
        });

        if (url) {
            return this.fetchDiagram(url);
        }

        this.diagramXML = this.initialDiagram(this.diagramXMLFileID);

        if (typeof this.diagramXML !== 'string') {
            return this.handleError(this.diagramXML);
        }

        this.setState({ diagramXML: this.diagramXML });

        return this.displayDiagram(this.diagramXML);
    }

    componentWillUnmount() {
        this.setState({
            dataCache: [],
            resultSubmit: {
                procDefKey: '',
                pvms: [],
                pvmVars: [],
                pvmExps: [],
                pvmExpItems: [],
            },
        });
        this.BPMN_MODEL_MODELER?.destroy?.();
    }

    componentDidUpdate(prevProps, prevState) {
        const { props } = this;

        if (props.url && props.url !== prevProps.url) {
            return this.fetchDiagram(props.url);
        }

        const currentXML = prevProps?.diagramXML;

        const previousXML = prevState?.diagramXML;
        // 回显数据处理
        if (currentXML && currentXML !== previousXML) {
            this.setState({ diagramXML: currentXML });
            return this.displayDiagram(currentXML);
        }

        // 更新前缀prefix
        if (prevProps?.prefix && prevProps?.prefix !== this.state.prefix) {
            this.setState({ prefix: prevProps.prefix });
            this.prefix = `${prevProps.prefix}: `;
        }
    }

    initialDiagram = (diagramID = 'Process_1') => {
        return `
            <?xml version="1.0" encoding="UTF-8"?>
            <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"  targetNamespace="http://bpmn.io/schema/bpmn" id="Definitions_1" xmlns:activiti="http://activiti.org/bpmn">
                <bpmn:process id="${diagramID}" isExecutable="true">
                    <bpmn:startEvent id="StartEvent_1"/>
                </bpmn:process>
                <bpmndi:BPMNDiagram id="BPMNDiagram_1">
                    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${diagramID}">
                        <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
                            <dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/>
                        </bpmndi:BPMNShape>
                    </bpmndi:BPMNPlane>
                </bpmndi:BPMNDiagram>
            </bpmn:definitions>
        `;
    };

    /** 错误信息 */
    handleError = error => {
        if (isFn(this.props.onError)) {
            this.props.onError(error);
        }
    };

    /** 警告信息 */
    handleShown = warnings => {
        if (isFn(this.props.onShown)) {
            this.props.onShown(warnings);
        }
    };

    /**
     * 加载完成
     * @return {BPMN_MODEL_MODELER}  返回图形this指向
     * */
    handleLoading = () => {
        if (isFn(this.props.onLoading)) {
            this.props.onLoading(this);
        }
    };

    /** 转换数据格式 */
    fetchDiagram = url => {
        fetch(url)
            .then(response => response.text())
            .then(text => this.setState({ diagramXML: text }))
            .catch(err => this.handleError(err));
    };

    /** 根据名称获取数据 */
    getDataByName(name, data, id) {
        if (!data?.length) return '';
        const [current] = data.filter(item => item.name === name && item.id === id);
        if (current) {
            if (typeof current.value === 'object') return JSON.stringify(current.value);
            return current.value;
        }
        return '';
    }

    /** 自定义用户任务 */
    customUserTaskMethods(element, update) {
        const moddle = this.moddle;
        // 创建子属性层级结构标签
        const childrenProps = moddle.create(`${this.prefix}Activiti`, {
            fields: [],
        });
        // 请选择签署类型
        const signedTypes = moddle.create(`${this.prefix}signedTypes`, {
            name: 'signedTypes',
            value: this.getDataByName('signedTypes', update),
        });
        // 审批人
        const approver = moddle.create(`${this.prefix}collection`, {
            name: 'assignee',
            value: this.getDataByName('collection', update),
        });

        // 原生扩展属性数组
        const extensions = moddle.create('bpmn:ExtensionElements', {
            values: [],
        });

        // 开始节点插入原生属性
        childrenProps.fields.push(signedTypes);
        childrenProps.fields.push(approver);
        extensions.values.push(childrenProps);
        return extensions;
    }

    /**自定义流转条件、网关*/
    customExclusiveGatewayMethods(element, update) {
        let body = '';
        if (update) {
            const cache = this.getDataByName('expression', update, element.id);
            if (cache) {
                body = '${' + cache + '}';
                return this.moddle.create('bpmn:FormalExpression', {
                    body,
                });
            }
        }
        return null;
    }

    /** 自定义用户多实例任务 */
    multiInstanceLoopCharacteristics(element, update) {
        const [signedTypes] = update?.filter(item => item.name === 'signedTypes' && item.id === element.id) ?? [];
        const suffix = signedTypes?.value ? 'collection' : 'assignee';
        let multiInstance;
        /*
         * 签署类型: 0:普通签、1:会签、2:依次签、3:或签.
         * 依次签 isSequential 设置为 true, 其他签署类型设置为 false.
         * 签署类型为或签时添加 completionCondition
         * 并写入后端提供的固定表达式 ${nrOfCompletedInstances>0}
         * ApprovalFlowSettings/ElementTemplate/config.js formData --> signedTypes
         * */
        if (signedTypes?.value !== 0 && signedTypes?.value !== 4) {
            multiInstance = this.moddle.create('bpmn:MultiInstanceLoopCharacteristics');
            multiInstance.$parent = element;
            if (multiInstance?.$attrs?.[this.prefix + 'assignee']) {
                delete multiInstance?.$attrs?.[this.prefix + 'assignee'];
            }
            multiInstance.$attrs[this.prefix + 'collection'] = `\$\{${element.id}_list\}`;
            multiInstance.$attrs[this.prefix + 'elementVariable'] = `${element.id}_${
                suffix === 'assignee' ? suffix + 'r' : suffix
            }`;

            multiInstance.$attrs['isSequential'] = `${signedTypes?.value === 2}`;
        } else if (signedTypes?.value === 0) {
            if (multiInstance?.$attrs?.[this.prefix + 'collection']) {
                delete multiInstance?.$attrs?.[this.prefix + 'collection'];
                delete multiInstance?.$attrs?.[this.prefix + 'elementVariable'];
            }
            if (multiInstance?.$attrs?.[this.prefix + 'assignee']) {
                delete multiInstance?.$attrs?.[this.prefix + 'assignee'];
                delete multiInstance?.$attrs?.[this.prefix + 'elementVariable'];
            }
        }
        // 检测是否为或签，如果是写入后台固定表达式 ${nrOfCompletedInstances>0}
        if (signedTypes?.value === 3) {
            multiInstance['completionCondition'] = this.bpmnFactory.create('bpmn:FormalExpression', {
                body: '${nrOfCompletedInstances>0}',
            });
        }

        /*
         * 多实例: loopCharacteristics
         * 扩展属性: extensionElements
         * 前缀属性: prefix: suffix 默认: activiti: assignee|collection
         * */
        return {
            'activiti:assignee': `\$\{${element.id}_${suffix === 'assignee' ? suffix + 'r' : suffix}\}`,
            loopCharacteristics: multiInstance,
        };
    }

    /**
     * 抄送任务节点
     * @description 节点类型: manualTask （手动任务节点）. 扩展节点: activiti:executionListener.
     *      扩展属性: event="start" className="java class: com.sj.ac.listener.ManualTaskDelegate".
     * @param {Shape} element - 节点元素
     * @param {Array} update - 节点数据
     * @return {{extensionElements: Object}|null}
     */
    ccTaskNodeSetting(element, update) {
        if (!Array.isArray(update?.value)) return null;
        const multiInstance = this.moddle.create(`${this.prefix}ExecutionListener`);
        // 扩展属性数组
        const extensions = this.moddle.create('bpmn:ExtensionElements', {
            values: [],
        });

        multiInstance.$parent = element;
        multiInstance.$attrs.event = 'start';
        multiInstance.$attrs.class = 'com.sj.ac.listener.ManualTaskDelegate';

        extensions.values.push(multiInstance);
        // return { extensionElements: extensions };
        return extensions;
    }

    /**读取XML*/
    displayDiagram(diagramXML) {
        this.BPMN_MODEL_MODELER.importXML(diagramXML);
    }

    /** 恢复 */
    redo = () => this.COM_STACK.redo();

    /** 撤销 */
    undo = () => this.COM_STACK.undo();

    /**页面缩放、还原*/
    zoom = radio => {
        const newScale = !radio ? 1.0 : this.scale + radio;
        this.BPMN_MODEL_MODELER.get('canvas').zoom(newScale);

        this.scale = newScale;
    };

    /** 返回数据 */
    async returnData(data) {
        const result = await this.BPMN_MODEL_MODELER.saveXML({ format: true });
        const { error, xml } = result;
        if (!error) {
            if (isFn(this.props.onSubmit)) {
                console.group('开发测试: 查看节点数据(saveData)');
                const pvmIds = this.elementRegistry
                    .getAll()
                    .filter(item => item.type !== 'bpmn:Process')
                    .map(item => item.id);

                const json = {
                    ...encode(
                        // 过滤删除节点数据
                        data.filter(item => pvmIds.includes(item.id)),
                        {},
                        this.startEvent,
                        this.diagramXMLFileID,
                        this.state.rootElementName
                    ),
                    pvmIds,
                };
                if (!json?.procDefKey || json?.procDefKey !== this.props.diagramID) {
                    json.procDefKey = this.props.diagramID;
                }
                console.log('保存数据', { xml, json });
                console.groupEnd();
                return { xml, json };
            }
        }
        return error;
    }

    /**提交XML*/
    submit = async () => {
        const result = await this.returnData(this.state.dataCache);
        this.props.onSubmit(result.xml, result.json);
    };

    /**关闭弹框*/
    onClose = () => this.customUpdate.onClose();

    /** 更新 XML 数据 */
    updatingXMLData(node, nodeName, xmlData) {
        const option = { ...xmlData };
        if (nodeName) {
            option.name = nodeName;
        }
        this.modeling.updateProperties(node, option);
    }

    /** 保存数据 */
    async saveData(dataCache) {
        const name = this.getDataByName('name', dataCache, this.startEvent.id);
        let loopCharacteristics, conditionExpression, ccNode;
        let option = {};
        dataCache.forEach(item => {
            if (item.name === 'expression' && item.id === this.startEvent.id) {
                conditionExpression = this.customExclusiveGatewayMethods(this.startEvent, this.state.dataCache);
                if (conditionExpression) {
                    this.updatingXMLData(this.startEvent, name, { conditionExpression });
                }
            }
            if (/^bpmn:ManualTask/.test(item.type) && item.id === this.startEvent.id) {
                ccNode = this.ccTaskNodeSetting(this.startEvent, item);
                if (ccNode) {
                    option.extensionElements = ccNode;
                    // 清空输入、输出节点信息
                    option.extensionElements.incoming = [];
                    option.extensionElements.outgoing = [];
                    this.updatingXMLData(this.startEvent, name, option);
                }
            }
            if (/^bpmn:UserTask/.test(item.type) && item.id === this.startEvent.id) {
                loopCharacteristics = this.multiInstanceLoopCharacteristics(this.startEvent, this.state.dataCache);
                if (loopCharacteristics) {
                    this.updatingXMLData(this.startEvent, name, loopCharacteristics);
                }
            }
        });

        this.setState({ isSave: true, visible: false });
        // todo 以下为开发测试数据是否正确
        await this.returnData(this.state.dataCache);
    }

    /**保存弹框数据*/
    onSave = () => {
        const { dataCache } = this.state;
        const form = this.expressionForm?.current?.props?.form ?? null;
        // 表单存在则验证表单数据，否则执行保存
        form
            ? form?.validateFieldsAndScroll?.((error, values) => {
                  if (!error) {
                      this.saveData(dataCache);
                  }
              })
            : this.saveData(dataCache);
    };

    /**更新文档名称*/
    updateDocument(event) {
        const { rootElements } = this.rootElement;
        const [rootElement] = rootElements;
        this.setState({ rootElementName: event.name });
        rootElement.set('name', event.name);
    }

    render() {
        const {
            roleList,
            people,
            company,
            department,
            userList,
            echoData,
            businessList,
            type,
            isReadOnly,
        } = this.props;
        const { diagramID } = this.state;
        const templateConfig = {
            people,
            company,
            userList,
            department,
            businessList,
            echoData,
            roleList,
            isReadOnly,
            element: this.startEvent,
            task: this.state.BPMN_TYPE,
            procDefKey: this.state.diagramID,
            nodeList: this.props.nodeList,
            dataCache: this.state.dataCache,
            onChange: result => {
                if (this.startEvent) {
                    // this.setState({ dataCache: updateCacheData(result, this.state.dataCache, this.state.diagramID) });
                    this.setState({ dataCache: updateCachedData(result, this.state.dataCache, this.state.diagramID) });
                }
            },
            expressionForm: form => {
                if (form) {
                    this.expressionForm = form;
                    this.setState({ expressionForm: this.expressionForm });
                }
            },
        };
        return (
            <div className={css.approvalFlowSettings}>
                <div className={css.panelRight}>
                    <Input addonBefore='文档编号' disabled value={diagramID} />
                    <Input
                        addonBefore='名称'
                        placeholder='请输入名称'
                        value={this.state.rootElementName}
                        onChange={ev => this.updateDocument({ name: ev.target.value })}
                    />
                </div>
                <div className={css.canvas} ref={this.containerRef} />
                <div id='js-properties-panel' className={css.panel} />
                {type !== 'query' && (
                    <ul className={css.buttons}>
                        <li>
                            <Button type='primary' onClick={this.submit}>
                                提交
                            </Button>
                        </li>
                        <li>
                            <Button type='primary' onClick={this.undo}>
                                撤销
                            </Button>
                        </li>
                        <li>
                            <Button type='primary' onClick={this.redo}>
                                恢复
                            </Button>
                        </li>
                        <li>
                            <Button type='primary' onClick={() => this.zoom(0.1)}>
                                放大
                            </Button>
                        </li>
                        <li>
                            <Button type='primary' onClick={() => this.zoom(-0.1)}>
                                缩小
                            </Button>
                        </li>
                        <li>
                            <Button type='primary' onClick={() => this.zoom()}>
                                还原
                            </Button>
                        </li>
                    </ul>
                )}
                <Drawer
                    className={css.customGlobal}
                    destroyOnClose
                    title={
                        <>
                            <p className='nodes-number'>
                                节点编号<span>{this.state.nodeNumber}</span>
                            </p>
                            <p className='nodes-number'>
                                状态<span>{isReadOnly ? '只读' : '读写'}</span>
                            </p>
                        </>
                    }
                    width={800}
                    placement='right'
                    maskClosable={false}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    footer={[<Button onClick={this.onClose}>关闭</Button>]}
                >
                    <div className='ant-drawer-body-wrap'>
                        <ElementTemplate {...templateConfig} />
                    </div>
                    <div className={`ant-drawer-footer button-list ${css.footer} `}>
                        <Button onClick={this.onClose}>关闭</Button>
                        {isReadOnly ? null : (
                            <Button type='primary' onClick={this.onSave}>
                                保存
                            </Button>
                        )}
                    </div>
                </Drawer>
            </div>
        );
    }
}

export default ApprovalFlowSettings;
