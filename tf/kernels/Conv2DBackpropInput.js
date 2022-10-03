/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import { backend_util, Conv2DBackpropInput, util } from '@tensorflow/tfjs-core';
let wasmConv2DBackpropInput;
function setup(backend) {
    wasmConv2DBackpropInput = backend.wasm.cwrap(Conv2DBackpropInput, null, [
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
    ]);
}
function conv2DBackpropInput(args) {
    const { backend, inputs, attrs } = args;
    const { dy, filter } = inputs;
    const { strides, pad, dataFormat, dimRoundingMode, inputShape } = attrs;
    const dilations = 1;
    const $dataFormat = backend_util.convertConv2DDataFormat(dataFormat);
    const convInfo = backend_util.computeConv2DInfo(inputShape, filter.shape, strides, dilations, pad, dimRoundingMode, false /* depthwise */, $dataFormat);
    const { batchSize, filterHeight, filterWidth, inChannels, inHeight, inWidth, outChannels, outHeight, outWidth, strideHeight, strideWidth } = convInfo;
    const topPad = filterHeight - 1 - convInfo.padInfo.top;
    const leftPad = filterWidth - 1 - convInfo.padInfo.left;
    const isChannelsLast = convInfo.dataFormat === 'channelsLast';
    const dxStrides = util.computeStrides(convInfo.inShape);
    const dyStrides = util.computeStrides(dy.shape);
    const [fltS0, fltS1, fltS2] = util.computeStrides(filter.shape);
    const xBatchStride = dxStrides[0];
    const xRowStride = isChannelsLast ? dxStrides[1] : dxStrides[2];
    const xColStride = isChannelsLast ? dxStrides[2] : 1;
    const xChannelStride = isChannelsLast ? 1 : dxStrides[1];
    const yBatchStride = dyStrides[0];
    const yRowStride = isChannelsLast ? dyStrides[1] : dyStrides[2];
    const yColStride = isChannelsLast ? dyStrides[2] : 1;
    const yChannelStride = isChannelsLast ? 1 : dyStrides[1];
    const out = backend.makeOutput(convInfo.inShape, 'float32');
    const outId = backend.dataIdMap.get(out.dataId).id;
    const dyId = backend.dataIdMap.get(dy.dataId).id;
    const filterId = backend.dataIdMap.get(filter.dataId).id;
    wasmConv2DBackpropInput(dyId, filterId, batchSize, filterHeight, filterWidth, inHeight, inWidth, inChannels, outHeight, outWidth, outChannels, strideHeight, strideWidth, topPad, leftPad, fltS0, fltS1, fltS2, xBatchStride, xRowStride, xColStride, xChannelStride, yBatchStride, yRowStride, yColStride, yChannelStride, outId);
    return out;
}
export const conv2DBackpropInputConfig = {
    kernelName: Conv2DBackpropInput,
    backendName: 'wasm',
    setupFunc: setup,
    kernelFunc: conv2DBackpropInput
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udjJEQmFja3Byb3BJbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13YXNtL3NyYy9rZXJuZWxzL0NvbnYyREJhY2twcm9wSW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBRSxtQkFBbUIsRUFBNkYsSUFBSSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFJekssSUFBSSx1QkFROEMsQ0FBQztBQUVuRCxTQUFTLEtBQUssQ0FBQyxPQUFvQjtJQUNqQyx1QkFBdUIsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLEVBQUU7UUFDdEUsUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRO0tBQ1QsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELFNBQVMsbUJBQW1CLENBQUMsSUFJNUI7SUFDQyxNQUFNLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUMsR0FBRyxJQUFJLENBQUM7SUFDdEMsTUFBTSxFQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUMsR0FBRyxNQUFNLENBQUM7SUFDNUIsTUFBTSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUMsR0FBRyxLQUFLLENBQUM7SUFFdEUs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LEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFDdkUsVUFBVSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQ3ZFLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFDOUQsVUFBVSxFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFDaEUsY0FBYyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzNCLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLHlCQUF5QixHQUFpQjtJQUNyRCxVQUFVLEVBQUUsbUJBQW1CO0lBQy9CLFdBQVcsRUFBRSxNQUFNO0lBQ25CLFNBQVMsRUFBRSxLQUFLO0lBQ2hCLFVBQVUsRUFBRSxtQkFBdUM7Q0FDcEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtiYWNrZW5kX3V0aWwsIENvbnYyREJhY2twcm9wSW5wdXQsIENvbnYyREJhY2twcm9wSW5wdXRBdHRycywgQ29udjJEQmFja3Byb3BJbnB1dElucHV0cywgS2VybmVsQ29uZmlnLCBLZXJuZWxGdW5jLCBUZW5zb3JJbmZvLCB1dGlsfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG5pbXBvcnQge0JhY2tlbmRXYXNtfSBmcm9tICcuLi9iYWNrZW5kX3dhc20nO1xuXG5sZXQgd2FzbUNvbnYyREJhY2twcm9wSW5wdXQ6IChcbiAgICBkeUlkOiBudW1iZXIsIGZpbHRlcklkOiBudW1iZXIsIGJhdGNoU2l6ZTogbnVtYmVyLCBmaWx0ZXJIZWlnaHQ6IG51bWJlcixcbiAgICBmaWx0ZXJXaWR0aDogbnVtYmVyLCBpbkhlaWdodDogbnVtYmVyLCBpbldpZHRoOiBudW1iZXIsIGluQ2hhbm5lbHM6IG51bWJlcixcbiAgICBvdXRIZWlnaHQ6IG51bWJlciwgb3V0V2lkdGg6IG51bWJlciwgb3V0Q2hhbm5lbHM6IG51bWJlcixcbiAgICBzdHJpZGVIZWlnaHQ6IG51bWJlciwgc3RyaWRlV2lkdGg6IG51bWJlciwgdG9wUGFkOiBudW1iZXIsIGxlZnRQYWQ6IG51bWJlcixcbiAgICBmbHRTMDogbnVtYmVyLCBmbHRTMTogbnVtYmVyLCBmbHRTMjogbnVtYmVyLCB4QmF0Y2hTdHJpZGU6IG51bWJlcixcbiAgICB4Um93U3RyaWRlOiBudW1iZXIsIHhDb2xTdHJpZGU6IG51bWJlciwgeENoYW5uZWxTdHJpZGU6IG51bWJlcixcbiAgICB5QmF0Y2hTdHJpZGU6IG51bWJlciwgeVJvd1N0cmlkZTogbnVtYmVyLCB5Q29sU3RyaWRlOiBudW1iZXIsXG4gICAgeUNoYW5uZWxTdHJpZGU6IG51bWJlciwgb3V0SWQ6IG51bWJlcikgPT4gdm9pZDtcblxuZnVuY3Rpb24gc2V0dXAoYmFja2VuZDogQmFja2VuZFdhc20pOiB2b2lkIHtcbiAgd2FzbUNvbnYyREJhY2twcm9wSW5wdXQgPSBiYWNrZW5kLndhc20uY3dyYXAoQ29udjJEQmFja3Byb3BJbnB1dCwgbnVsbCwgW1xuICAgICdudW1iZXInLCAgLy8gZHlJZFxuICAgICdudW1iZXInLCAgLy8gZmlsdGVySWRcbiAgICAnbnVtYmVyJywgIC8vIGJhdGNoU2l6ZVxuICAgICdudW1iZXInLCAgLy8gZmlsdGVySGVpZ2h0XG4gICAgJ251bWJlcicsICAvLyBmaWx0ZXJXaWR0aFxuICAgICdudW1iZXInLCAgLy8gaW5IZWlnaHRcbiAgICAnbnVtYmVyJywgIC8vIGluV2lkdGhcbiAgICAnbnVtYmVyJywgIC8vIGluQ2hhbm5lbHNcbiAgICAnbnVtYmVyJywgIC8vIG91dEhlaWdodFxuICAgICdudW1iZXInLCAgLy8gb3V0V2lkdGhcbiAgICAnbnVtYmVyJywgIC8vIG91dENoYW5uZWxzXG4gICAgJ251bWJlcicsICAvLyBzdHJpZGVIZWlnaHRcbiAgICAnbnVtYmVyJywgIC8vIHN0cmlkZVdpZHRoXG4gICAgJ251bWJlcicsICAvLyB0b3BQYWRcbiAgICAnbnVtYmVyJywgIC8vIGxlZnRQYWRcbiAgICAnbnVtYmVyJywgIC8vIGZsdFMwXG4gICAgJ251bWJlcicsICAvLyBmbHRTMVxuICAgICdudW1iZXInLCAgLy8gZmx0UzJcbiAgICAnbnVtYmVyJywgIC8vIHhCYXRjaFN0cmlkZVxuICAgICdudW1iZXInLCAgLy8geFJvd1N0cmlkZVxuICAgICdudW1iZXInLCAgLy8geENvbFN0cmlkZVxuICAgICdudW1iZXInLCAgLy8geENoYW5uZWxTdHJpZGVcbiAgICAnbnVtYmVyJywgIC8vIHlCYXRjaFN0cmlkZVxuICAgICdudW1iZXInLCAgLy8geVJvd1N0cmlkZVxuICAgICdudW1iZXInLCAgLy8geUNvbFN0cmlkZVxuICAgICdudW1iZXInLCAgLy8geUNoYW5uZWxTdHJpZGVcbiAgICAnbnVtYmVyJywgIC8vIG91dElkXG4gIF0pO1xufVxuXG5mdW5jdGlvbiBjb252MkRCYWNrcHJvcElucHV0KGFyZ3M6IHtcbiAgYmFja2VuZDogQmFja2VuZFdhc20sXG4gIGlucHV0czogQ29udjJEQmFja3Byb3BJbnB1dElucHV0cyxcbiAgYXR0cnM6IENvbnYyREJhY2twcm9wSW5wdXRBdHRyc1xufSk6IFRlbnNvckluZm8ge1xuICBjb25zdCB7YmFja2VuZCwgaW5wdXRzLCBhdHRyc30gPSBhcmdzO1xuICBjb25zdCB7ZHksIGZpbHRlcn0gPSBpbnB1dHM7XG4gIGNvbnN0IHtzdHJpZGVzLCBwYWQsIGRhdGFGb3JtYXQsIGRpbVJvdW5kaW5nTW9kZSwgaW5wdXRTaGFwZX0gPSBhdHRycztcblxuICBjb25zdCBkaWxhdGlvbnMgPSAxO1xuXG4gIGNvbnN0ICRkYXRhRm9ybWF0ID0gYmFja2VuZF91dGlsLmNvbnZlcnRDb252MkREYXRhRm9ybWF0KGRhdGFGb3JtYXQpO1xuICBjb25zdCBjb252SW5mbyA9IGJhY2tlbmRfdXRpbC5jb21wdXRlQ29udjJESW5mbyhcbiAgICAgIGlucHV0U2hhcGUsIGZpbHRlci5zaGFwZSBhcyBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSwgc3RyaWRlcyxcbiAgICAgIGRpbGF0aW9ucywgcGFkLCBkaW1Sb3VuZGluZ01vZGUsIGZhbHNlIC8qIGRlcHRod2lzZSAqLywgJGRhdGFGb3JtYXQpO1xuICBjb25zdCB7XG4gICAgYmF0Y2hTaXplLFxuICAgIGZpbHRlckhlaWdodCxcbiAgICBmaWx0ZXJXaWR0aCxcbiAgICBpbkNoYW5uZWxzLFxuICAgIGluSGVpZ2h0LFxuICAgIGluV2lkdGgsXG4gICAgb3V0Q2hhbm5lbHMsXG4gICAgb3V0SGVpZ2h0LFxuICAgIG91dFdpZHRoLFxuICAgIHN0cmlkZUhlaWdodCxcbiAgICBzdHJpZGVXaWR0aFxuICB9ID0gY29udkluZm87XG5cbiAgY29uc3QgdG9wUGFkID0gZmlsdGVySGVpZ2h0IC0gMSAtIGNvbnZJbmZvLnBhZEluZm8udG9wO1xuICBjb25zdCBsZWZ0UGFkID0gZmlsdGVyV2lkdGggLSAxIC0gY29udkluZm8ucGFkSW5mby5sZWZ0O1xuXG4gIGNvbnN0IGlzQ2hhbm5lbHNMYXN0ID0gY29udkluZm8uZGF0YUZvcm1hdCA9PT0gJ2NoYW5uZWxzTGFzdCc7XG4gIGNvbnN0IGR4U3RyaWRlcyA9IHV0aWwuY29tcHV0ZVN0cmlkZXMoY29udkluZm8uaW5TaGFwZSk7XG4gIGNvbnN0IGR5U3RyaWRlcyA9IHV0aWwuY29tcHV0ZVN0cmlkZXMoZHkuc2hhcGUpO1xuICBjb25zdCBbZmx0UzAsIGZsdFMxLCBmbHRTMl0gPSB1dGlsLmNvbXB1dGVTdHJpZGVzKGZpbHRlci5zaGFwZSk7XG4gIGNvbnN0IHhCYXRjaFN0cmlkZSA9IGR4U3RyaWRlc1swXTtcbiAgY29uc3QgeFJvd1N0cmlkZSA9IGlzQ2hhbm5lbHNMYXN0ID8gZHhTdHJpZGVzWzFdIDogZHhTdHJpZGVzWzJdO1xuICBjb25zdCB4Q29sU3RyaWRlID0gaXNDaGFubmVsc0xhc3QgPyBkeFN0cmlkZXNbMl0gOiAxO1xuICBjb25zdCB4Q2hhbm5lbFN0cmlkZSA9IGlzQ2hhbm5lbHNMYXN0ID8gMSA6IGR4U3RyaWRlc1sxXTtcbiAgY29uc3QgeUJhdGNoU3RyaWRlID0gZHlTdHJpZGVzWzBdO1xuICBjb25zdCB5Um93U3RyaWRlID0gaXNDaGFubmVsc0xhc3QgPyBkeVN0cmlkZXNbMV0gOiBkeVN0cmlkZXNbMl07XG4gIGNvbnN0IHlDb2xTdHJpZGUgPSBpc0NoYW5uZWxzTGFzdCA/IGR5U3RyaWRlc1syXSA6IDE7XG4gIGNvbnN0IHlDaGFubmVsU3RyaWRlID0gaXNDaGFubmVsc0xhc3QgPyAxIDogZHlTdHJpZGVzWzFdO1xuXG4gIGNvbnN0IG91dCA9IGJhY2tlbmQubWFrZU91dHB1dChjb252SW5mby5pblNoYXBlLCAnZmxvYXQzMicpO1xuICBjb25zdCBvdXRJZCA9IGJhY2tlbmQuZGF0YUlkTWFwLmdldChvdXQuZGF0YUlkKS5pZDtcbiAgY29uc3QgZHlJZCA9IGJhY2tlbmQuZGF0YUlkTWFwLmdldChkeS5kYXRhSWQpLmlkO1xuICBjb25zdCBmaWx0ZXJJZCA9IGJhY2tlbmQuZGF0YUlkTWFwLmdldChmaWx0ZXIuZGF0YUlkKS5pZDtcblxuICB3YXNtQ29udjJEQmFja3Byb3BJbnB1dChcbiAgICAgIGR5SWQsIGZpbHRlcklkLCBiYXRjaFNpemUsIGZpbHRlckhlaWdodCwgZmlsdGVyV2lkdGgsIGluSGVpZ2h0LCBpbldpZHRoLFxuICAgICAgaW5DaGFubmVscywgb3V0SGVpZ2h0LCBvdXRXaWR0aCwgb3V0Q2hhbm5lbHMsIHN0cmlkZUhlaWdodCwgc3RyaWRlV2lkdGgsXG4gICAgICB0b3BQYWQsIGxlZnRQYWQsIGZsdFMwLCBmbHRTMSwgZmx0UzIsIHhCYXRjaFN0cmlkZSwgeFJvd1N0cmlkZSxcbiAgICAgIHhDb2xTdHJpZGUsIHhDaGFubmVsU3RyaWRlLCB5QmF0Y2hTdHJpZGUsIHlSb3dTdHJpZGUsIHlDb2xTdHJpZGUsXG4gICAgICB5Q2hhbm5lbFN0cmlkZSwgb3V0SWQpO1xuICByZXR1cm4gb3V0O1xufVxuXG5leHBvcnQgY29uc3QgY29udjJEQmFja3Byb3BJbnB1dENvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBDb252MkRCYWNrcHJvcElucHV0LFxuICBiYWNrZW5kTmFtZTogJ3dhc20nLFxuICBzZXR1cEZ1bmM6IHNldHVwLFxuICBrZXJuZWxGdW5jOiBjb252MkRCYWNrcHJvcElucHV0IGFzIHt9IGFzIEtlcm5lbEZ1bmNcbn07XG4iXX0=