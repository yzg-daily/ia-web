export default {
    name: 'Activiti',
    uri: 'http://activiti.org/bpmn',
    prefix: 'activiti',
    xml: {
        tagAlias: 'lowerCase',
    },
    types: [
        {
            name: 'Activiti',
            superClass: ['Element'],
            meta: {
                allowedIn: ['bpmn:StartEvent', 'bpmn:UserTask'],
            },
            properties: [
                {
                    name: 'fields',
                    type: 'FormField',
                    isMany: true,
                },
                {
                    name: 'businessKey',
                    type: 'String',
                    isAttr: true,
                },
                {
                    name: 'default',
                    isAttr: true,
                    type: 'String',
                },
            ],
        },
        {
            name: 'AsyncCapable',
            isAbstract: true,
            extends: ['bpmn:Activity', 'bpmn:Gateway', 'bpmn:Event'],
            properties: [
                {
                    name: 'async',
                    isAttr: true,
                    type: 'Boolean',
                    default: false,
                },
                {
                    name: 'asyncBefore',
                    isAttr: true,
                    type: 'Boolean',
                    default: false,
                },
                {
                    name: 'asyncAfter',
                    isAttr: true,
                    type: 'Boolean',
                    default: false,
                },
                {
                    name: 'exclusive',
                    isAttr: true,
                    type: 'Boolean',
                    default: true,
                },
            ],
        },
        {
            name: 'ApproverValue',
            superClass: ['InputOutputParameterDefinition'],
            properties: [
                {
                    name: 'id',
                    isAttr: true,
                    type: 'String',
                },
                {
                    name: 'label',
                    isAttr: true,
                    type: 'String',
                },
                {
                    name: 'value',
                    isBody: true,
                    type: 'String',
                },
            ],
        },
        {
            name: 'Value',
            superClass: ['InputOutputParameterDefinition'],
            properties: [
                {
                    name: 'id',
                    isAttr: true,
                    type: 'String',
                },
                {
                    name: 'name',
                    isAttr: true,
                    type: 'String',
                },
                {
                    name: 'value',
                    isBody: true,
                    type: 'String',
                },
            ],
        },
        {
            name: 'SignedTypes',
            superClass: ['InputOutputParameterDefinition'],
            properties: [
                {
                    name: 'id',
                    isAttr: true,
                    type: 'String',
                },
                {
                    name: 'name',
                    isAttr: true,
                    type: 'String',
                },
                {
                    name: 'value',
                    isBody: true,
                    type: 'String',
                },
            ],
        },
        {
            name: 'Approver',
            superClass: ['InputOutputParameterDefinition'],
            properties: [
                {
                    name: 'id',
                    isAttr: true,
                    type: 'String',
                },
                {
                    name: 'name',
                    isAttr: true,
                    type: 'String',
                },
                {
                    name: 'value',
                    isBody: true,
                    type: 'Value',
                },
            ],
        },
        {
            name: 'FormalExpression',
            isAbstract: true,
            extends: ['bpmn:FormalExpression'],
            properties: [
                {
                    name: 'expression',
                    isAttr: true,
                    type: 'String',
                },
            ],
        },
        {
            name: 'InputOutputParameterDefinition',
            isAbstract: true,
        },
        {
            name: 'Collectable',
            isAbstract: true,
            extends: ['bpmn:MultiInstanceLoopCharacteristics'],
            superClass: ['activiti:AsyncCapable'],
            properties: [
                {
                    name: 'collection',
                    isAttr: true,
                    type: 'String',
                },
                {
                    name: 'elementVariable',
                    isAttr: true,
                    type: 'String',
                },
            ],
        },
        {
            name: 'FormField',
            superClass: ['Element'],
            properties: [
                {
                    name: 'id',
                    type: 'String',
                    isAttr: true,
                },
                {
                    name: 'type',
                    type: 'String',
                    isAttr: true,
                },
                {
                    name: 'defaultValue',
                    type: 'String',
                    isAttr: true,
                },
                {
                    name: 'values',
                    type: 'Value',
                    isMany: true,
                },
                {
                    name: 'signedTypes',
                    type: 'SignedTypes',
                    isAttr: true,
                },
                {
                    name: 'expression',
                    type: 'FormalExpression',
                    isMany: true,
                },
                {
                    name: 'approver',
                    type: 'ApproverValue',
                    isMany: true,
                },
                {
                    name: 'multiInstance',
                    type: 'Collectable',
                    isBody: true,
                },
            ],
        },
        {
            name: 'ExecutionListener',
            superClass: ['Element'],
            properties: [
                {
                    name: 'event',
                    isAttr: true,
                    type: 'String',
                },
                {
                    name: 'className',
                    isAttr: true,
                    type: 'String',
                },
            ],
        },
    ],
};
