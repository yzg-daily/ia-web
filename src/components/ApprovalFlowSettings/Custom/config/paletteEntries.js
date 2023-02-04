import { is } from 'bpmn-js/lib/util/ModelUtil';
import { assign } from 'min-dash';
import { append as svgAppend, attr as svgAttr, create as svgCreate, remove as svgRemove } from 'tiny-svg';

function createAction(type, group, className, title, imageUrl = '', drawShape) {
    function createListener(event, autoActivate, elementFactory, create) {
        const shape = elementFactory.createShape({ type });

        create.start(event, shape);
    }

    const config = {
        type, // 📌 渲染的时候需要判断
        group: group,
        className: className,
        title: title,
        drawShape: drawShape, // 📌
        action: {
            dragstart: createListener,
            click: createListener,
        },
    };
    if (imageUrl) {
        assign(config, {
            imageUrl,
        });
    }
    if (drawShape) {
        assign(config, {
            drawShape,
        });
    }

    return config;
}

/** @Link https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js*/
function drawRect(parentNode, width, height, borderRadius, strokeColor) {
    const rect = svgCreate('rect');

    svgAttr(rect, {
        width: width,
        height: height,
        rx: borderRadius,
        ry: borderRadius,
        stroke: strokeColor || '#000',
        strokeWidth: 2,
        fill: '#fff',
    });

    svgAppend(parentNode, rect);

    return rect;
}

// 这里将 CustomRenderer.js 渲染的方法搬到 paletteEntries
function drawShape(parentNode, element, bpmnRenderer) {
    const shape = bpmnRenderer.drawShape(parentNode, element);

    if (is(element, 'bpmn:Task')) {
        const height = 80;
        const width = 100;
        // 真实元素的宽高
        element.width = width;
        element.height = height;

        // 显示元素的宽高与真实的宽高需要一致
        const rect = drawRect(parentNode, width, height, TASK_BORDER_RADIUS, '#52B415');

        prependTo(rect, parentNode);

        svgRemove(shape);

        return shape;
    }

    const rect = drawRect(parentNode, 30, 20, TASK_BORDER_RADIUS, '#cc0000');

    svgAttr(rect, {
        transform: 'translate(-20, -10)',
    });

    return shape;
}

/** @Link https://github.com/bpmn-io/diagram-js/blob/master/lib/core/GraphicsFactory.js */
function prependTo(newNode, parentNode, siblingNode) {
    parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild);
}

export default {
    // 'global-connect-tool': {
    //     group: 'tools',
    //     className: 'bpmn-icon-connection-multi',
    //     title: translate('Activate the global connect tool'),
    //     action: {
    //         click: function (event) {
    //             globalConnect.toggle(event)
    //         }
    //     }
    // },

    'tool-separator': {
        group: 'tools',
        separator: true,
    },
    'create.start-event': createAction('bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none', '创建开始节点'),
    'create.end-event': createAction('bpmn:EndEvent', 'event', 'bpmn-icon-end-event-none', '创建结束节点'),
    'create.task': createAction('bpmn:UserTask', 'activity', 'bpmn-icon-user-task', '创建用户任务', '', drawShape),
    'create.exclusive-gateway': createAction('bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-none', '判断条件'),
};
