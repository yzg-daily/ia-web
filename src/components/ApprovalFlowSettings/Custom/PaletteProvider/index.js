import PaletteModule from 'diagram-js/lib/features/palette';
import CreateModule from 'diagram-js/lib/features/create';
import SpaceToolModule from 'diagram-js/lib/features/space-tool';
import LassoToolModule from 'diagram-js/lib/features/lasso-tool';
import HandToolModule from 'diagram-js/lib/features/hand-tool';
import GlobalConnectModule from 'diagram-js/lib/features/global-connect';
import translate from '../Modeler/customTranslate/translations';
import customPalette from './CustomPalette';
import PaletteProvider from './CustomPaletteProvider';
/**
 * 除了引进的模块的名字可以修改，其他的不建议修改，会报错
 * 自定义左侧工具栏
 * */
export default {
    __depends__: [
        {
            __init__: ['customPalette'],
            customPalette: ['type', customPalette],
        },
        PaletteModule,
        CreateModule,
        SpaceToolModule,
        LassoToolModule,
        HandToolModule,
        GlobalConnectModule,
        translate,
    ], // 依赖于 customPalette 这个模块
    __init__: ['customPaletteProvider'], // 调用 customPaletteProvider 来初始化
    customPaletteProvider: ['type', PaletteProvider],
};
