import Modeler from 'bpmn-js/lib/Modeler';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import customTranslate from './customTranslate/customTranslate';
import customContextPad from '../ContextPad';

class CustomModeler extends Modeler {
    constructor(options) {
        super(options);
        this._customElements = [];
    }
}
/** 汉化包 */
const customTranslateModule = {
    translate: ['value', customTranslate],
};
// 去除默认工具栏
const modules = Modeler.prototype._modules;
const index = modules.findIndex(it => it.paletteProvider);
modules.splice(index, 1);
CustomModeler.prototype._modules = [].concat(modules, [
    ZoomScrollModule,
    MoveCanvasModule,
    customTranslateModule,
    customContextPad,
]);
export { CustomModeler };
