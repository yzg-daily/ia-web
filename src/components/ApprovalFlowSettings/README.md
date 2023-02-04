# BPMN 流程图组件

---

## 参数列表

|     参数名      | 类型                                |     说明     |
| :-------------: | :---------------------------------- | :----------: |
| diagramID | string | 业务类别 |
| diagramXML | string | XML(BPMN)文件 |
| url | string | XML(BPMN)文件 |
| prefix |string|标签前缀(后端提供.默认 activiti:)|
| businessList | object[] | 相关业务字段 |
| camunda | object[] | 自定义标签 |
| company | object | 公司数据 [说明](#说明) |
| department | object | 部门数据 [说明](#说明) |
| userList | object | 人员数据 [说明](#说明) |
| onLoading | (this) => void | 流程图加载完成 |
| onShown | (warnings) => void | 流程图警告信息 |
| onError | (error) => void | 流程图错误信息 |
| onSubmit | (xml，json) => void | 流程图提交信息返回 |
| openDrawer | ({ procDefKey: string, target: Shape, echoDataJSON: object[] }) => void | 打开属性编辑框 |
| closeDrawer | ({ nodeData: object[], nodeID: Shape.id, type: nodeID.type }) => void | 关闭属性编辑框 |

# 说明

|     参数名      | 类型                                |     说明     |
| :-------------: | :---------------------------------- | :----------: |
|      data       | object[]                            |   业务数据   |
|     methods     | {trigger: function}                 |   方法集合   |
| methods.trigger | ({gid: string, id: string}) => void | 调用相关接口 |
