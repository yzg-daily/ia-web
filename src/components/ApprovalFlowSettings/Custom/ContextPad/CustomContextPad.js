import { assign, forEach } from 'min-dash';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import { hasPrimaryModifier } from 'diagram-js/lib/util/Mouse';
import { is } from 'bpmn-js/lib/util/ModelUtil';

/**
 * 参数注入是要根据$inject的顺序
 * */
export default function ContextPadProvider(
    config,
    injector,
    eventBus,
    contextPad,
    modeling,
    elementFactory,
    connect,
    create,
    popupMenu,
    canvas,
    rules,
    translate,
    customUpdate
) {
    config = config || {};

    contextPad.registerProvider(this);

    this._contextPad = contextPad;

    this._modeling = modeling;

    this._elementFactory = elementFactory;
    this._connect = connect;
    this._create = create;
    this._popupMenu = popupMenu;
    this._canvas = canvas;
    this._rules = rules;
    this._translate = translate;
    this.eventBus = eventBus;
    this.customUpdate = customUpdate;

    if (config.autoPlace !== false) {
        this._autoPlace = injector.get('autoPlace', false);
    }

    eventBus.on('create.end', 250, function(event) {
        var context = event.context,
            shape = context.shape;

        if (!hasPrimaryModifier(event) || !contextPad.isOpen(shape)) {
            return;
        }

        var entries = contextPad.getEntries(shape);

        if (entries.replace) {
            entries.replace.action.click(event, shape);
        }
    });
}

ContextPadProvider.$inject = [
    'config.contextPad',
    'injector',
    'eventBus',
    'contextPad',
    'modeling',
    'elementFactory',
    'connect',
    'create',
    'popupMenu',
    'canvas',
    'rules',
    'translate',
    'customUpdate',
];

ContextPadProvider.prototype.getContextPadEntries = function(element) {
    const contextPad = this._contextPad,
        modeling = this._modeling,
        elementFactory = this._elementFactory,
        connect = this._connect,
        create = this._create,
        popupMenu = this._popupMenu,
        canvas = this._canvas,
        rules = this._rules,
        autoPlace = this._autoPlace,
        translate = this._translate,
        customUpdate = this.customUpdate;

    const businessObject = element.businessObject;

    const actionsAll = {
        attribute: {
            group: 'edit',
            className: 'bpmn-icon-screw-wrench',
            title: translate('属性'),
            action: {
                click: function(ev, element) {
                    customUpdate.open(element);
                },
            },
        },
        'append.append-user-task': appendAction('bpmn:UserTask', 'bpmn-icon-user-task', translate('Append User Task')),
        'append.append-manual-task': appendAction(
            'bpmn:ManualTask',
            'bpmn-icon-manual-task',
            translate('Append Manual Task')
        ),
        'append.end-event': appendAction('bpmn:EndEvent', 'bpmn-icon-end-event-none', translate('Append EndEvent')),
        'append.gateway': appendAction('bpmn:ExclusiveGateway', 'bpmn-icon-gateway-none', translate('Append Gateway')),
        delete: {
            group: 'edit',
            className: 'bpmn-icon-trash',
            title: translate('Remove'),
            action: {
                click: removeElement,
            },
        },
        connect: {
            group: 'connect',
            className: 'bpmn-icon-connection-multi',
            title: translate(
                'Connect using ' + (businessObject.isForCompensation ? '' : 'Sequence/MessageFlow or ') + 'Association'
            ),
            action: {
                click: startConnect,
                dragstart: startConnect,
            },
        },
    };
    const actionsOther = {
        'append.append-user-task': appendAction('bpmn:UserTask', 'bpmn-icon-user-task', translate('Append User Task')),
        'append.append-manual-task': appendAction(
            'bpmn:ManualTask',
            'bpmn-icon-manual-task',
            translate('Append Manual Task')
        ),
        'append.end-event': appendAction('bpmn:EndEvent', 'bpmn-icon-end-event-none', translate('Append EndEvent')),
        'append.gateway': appendAction('bpmn:ExclusiveGateway', 'bpmn-icon-gateway-none', translate('Append Gateway')),
        delete: {
            group: 'edit',
            className: 'bpmn-icon-trash',
            title: translate('Remove'),
            action: {
                click: removeElement,
            },
        },
        connect: {
            group: 'connect',
            className: 'bpmn-icon-connection-multi',
            title: translate(
                'Connect using ' + (businessObject.isForCompensation ? '' : 'Sequence/MessageFlow or ') + 'Association'
            ),
            action: {
                click: startConnect,
                dragstart: startConnect,
            },
        },
    };
    const actions = {};

    if (element.type === 'label') {
        return actions;
    }

    function startConnect(event, element) {
        connect.start(event, element);
    }

    function removeElement(e) {
        modeling.removeElements([element]);
    }
    /**
     * Create an append action
     *
     * @param {string} type
     * @param {string} className
     * @param {string} [title]
     * @param {Object} [options]
     *
     * @return {Object} descriptor
     */
    function appendAction(type, className, title, options) {
        if (typeof title !== 'string') {
            options = title;
            title = translate('Append {type}', { type: type.replace(/^bpmn:/, '') });
        }

        function appendStart(event, element) {
            var shape = elementFactory.createShape(assign({ type: type }, options));
            create.start(event, shape, {
                source: element,
            });
        }

        var append = autoPlace
            ? function(event, element) {
                  var shape = elementFactory.createShape(assign({ type: type }, options));

                  autoPlace.append(element, shape);
              }
            : appendStart;

        return {
            group: 'model',
            className: className,
            title: title,
            action: {
                dragstart: appendStart,
                click: append,
            },
        };
    }

    if (isAny(businessObject, ['bpmn:EndEvent'])) {
        assign(actions, {
            delete: {
                group: 'edit',
                className: 'bpmn-icon-trash',
                title: translate('Remove'),
                action: {
                    click: removeElement,
                },
            },
        });
    }
    if (isAny(businessObject, ['bpmn:StartEvent', 'bpmn:ExclusiveGateway'])) {
        assign(actions, {
            ...actionsOther,
        });
    }
    if (isAny(businessObject, ['bpmn:UserTask', 'bpmn:ManualTask'])) {
        assign(actions, {
            ...actionsAll,
        });
    }
    /**
     * 设置(取消)默认流程
     * 源码参考路径 link: node_modules/bpmn-js/lib/features/popup-menu/ReplaceMenuProvider.js:330
     */

    if (isAny(businessObject, ['bpmn:SequenceFlow'])) {
        // 取消默认流程
        if (
            (is(businessObject.sourceRef, 'bpmn:ExclusiveGateway') ||
                is(businessObject.sourceRef, 'bpmn:InclusiveGateway') ||
                is(businessObject.sourceRef, 'bpmn:ComplexGateway') ||
                is(businessObject.sourceRef, 'bpmn:Activity')) &&
            businessObject.sourceRef.default === businessObject
        ) {
            assign(actions, {
                'replace-with-sequence-flow': {
                    group: 'replace-with-sequence-flow',
                    className: 'bpmn-icon-connection',
                    title: translate('Sequence Flow'),
                    action: {
                        click: function() {
                            modeling.updateProperties(element.source, { default: undefined });
                        },
                    },
                },
            });
        }
        // 设置默认流程
        if (
            businessObject.sourceRef.default !== businessObject &&
            (is(businessObject.sourceRef, 'bpmn:ExclusiveGateway') ||
                is(businessObject.sourceRef, 'bpmn:InclusiveGateway') ||
                is(businessObject.sourceRef, 'bpmn:ComplexGateway') ||
                is(businessObject.sourceRef, 'bpmn:Activity'))
        ) {
            console.log('设置默认流程 businessObject', businessObject);
            assign(actions, {
                'replace-with-default-flow': {
                    group: 'replace-with-default-flow',
                    className: 'bpmn-icon-default-flow',
                    title: translate('Default Flow'),
                    action: {
                        click: function() {
                            modeling.updateProperties(element.source, { default: businessObject });
                        },
                    },
                },
            });
        }
        assign(actions, {
            delete: {
                group: 'edit',
                className: 'bpmn-icon-trash',
                title: translate('Remove'),
                action: {
                    click: removeElement,
                },
            },
            attribute: {
                group: 'edit',
                className: 'bpmn-icon-screw-wrench',
                title: translate('属性'),
                action: {
                    click: function(ev, element) {
                        customUpdate.open(element);
                    },
                },
            },
        });
    }

    return actions;
};
