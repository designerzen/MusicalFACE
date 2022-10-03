/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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
import { backend_util, Conv2D } from '@tensorflow/tfjs-core';
let wasmConv2d;
function setup(backend) {
    wasmConv2d = backend.wasm.cwrap(Conv2D, null /* void */, [
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
function conv2d(args) {
    const { inputs, attrs, backend } = args;
    const { x, filter } = inputs;
    const xId = backend.dataIdMap.get(x.dataId).id;
    const filterId = backend.dataIdMap.get(filter.dataId).id;
    const { strides, dilations, pad, dimRoundingMode, dataFormat } = attrs;
    const $dataFormat = backend_util.convertConv2DDataFormat(dataFormat);
    const convInfo = backend_util.computeConv2DInfo(x.shape, filter.shape, strides, dilations, pad, dimRoundingMode, false, $dataFormat);
    const filterHeight = convInfo.filterHeight;
    const filterWidth = convInfo.filterWidth;
    const padTop = convInfo.padInfo.top;
    const padRight = convInfo.padInfo.right;
    const padBottom = convInfo.padInfo.bottom;
    const padLeft = convInfo.padInfo.left;
    const dilationHeight = convInfo.dilationHeight;
    const dilationWidth = convInfo.dilationWidth;
    const strideHeight = convInfo.strideHeight;
    const strideWidth = convInfo.strideWidth;
    const inputChannels = convInfo.inChannels;
    const outputChannels = convInfo.outChannels;
    const isSamePad = convInfo.padInfo.type === 'SAME' ? 1 : 0;
    if (convInfo.dataFormat !== 'channelsLast') {
        throw new Error(`wasm backend Conv2D does not support dataFormat:'` +
            `${convInfo.dataFormat}'. Please use 'channelsLast'.`);
    }
    const out = backend.makeOutput(convInfo.outShape, 'float32');
    const outId = backend.dataIdMap.get(out.dataId).id;
    wasmConv2d(xId, x.shape[0], x.shape[1], x.shape[2], filterId, filterHeight, filterWidth, padTop, padRight, padBottom, padLeft, isSamePad, dilationHeight, dilationWidth, strideHeight, strideWidth, inputChannels, outputChannels, outId);
    return out;
}
export const conv2DConfig = {
    kernelName: Conv2D,
    backendName: 'wasm',
    setupFunc: setup,
    kernelFunc: conv2d
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udjJELmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdhc20vc3JjL2tlcm5lbHMvQ29udjJELnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQUUsTUFBTSxFQUFnRSxNQUFNLHVCQUF1QixDQUFDO0FBSTFILElBQUksVUFNc0IsQ0FBQztBQUUzQixTQUFTLEtBQUssQ0FBQyxPQUFvQjtJQUNqQyxVQUFVLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUU7UUFDdkQsUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtLQUNULENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxTQUFTLE1BQU0sQ0FDWCxJQUFzRTtJQUN4RSxNQUFNLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUMsR0FBRyxJQUFJLENBQUM7SUFFdEMsTUFBTSxFQUFDLENBQUMsRUFBRSxNQUFNLEVBQUMsR0FBRyxNQUFNLENBQUM7SUFDM0IsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUMvQyxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDO0lBRXpELE1BQU0sRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxlQUFlLEVBQUUsVUFBVSxFQUFDLEdBQUcsS0FBSyxDQUFDO0lBQ3JFLE1BQU0sV0FBVyxHQUFHLFlBQVksQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNyRSxNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsaUJBQWlCLENBQzFDLENBQWMsQ0FBQyxLQUFLLEVBQUcsTUFBbUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFDckUsR0FBRyxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFOUMsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQztJQUMzQyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO0lBQ3pDLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQ3BDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQ3hDLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQzFDLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ3RDLE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUM7SUFDL0MsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQztJQUM3QyxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDO0lBQzNDLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUM7SUFDekMsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQztJQUMxQyxNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO0lBQzVDLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFM0QsSUFBSSxRQUFRLENBQUMsVUFBVSxLQUFLLGNBQWMsRUFBRTtRQUMxQyxNQUFNLElBQUksS0FBSyxDQUNYLG1EQUFtRDtZQUNuRCxHQUFHLFFBQVEsQ0FBQyxVQUFVLCtCQUErQixDQUFDLENBQUM7S0FDNUQ7SUFFRCxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDN0QsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNuRCxVQUFVLENBQ04sR0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQy9ELFdBQVcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUM1RCxjQUFjLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUN2RSxjQUFjLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDM0IsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFpQjtJQUN4QyxVQUFVLEVBQUUsTUFBTTtJQUNsQixXQUFXLEVBQUUsTUFBTTtJQUNuQixTQUFTLEVBQUUsS0FBSztJQUNoQixVQUFVLEVBQUUsTUFBMEI7Q0FDdkMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtiYWNrZW5kX3V0aWwsIENvbnYyRCwgQ29udjJEQXR0cnMsIENvbnYyRElucHV0cywgS2VybmVsQ29uZmlnLCBLZXJuZWxGdW5jLCBUZW5zb3I0RH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtCYWNrZW5kV2FzbX0gZnJvbSAnLi4vYmFja2VuZF93YXNtJztcblxubGV0IHdhc21Db252MmQ6IChcbiAgICB4SWQ6IG51bWJlciwgYmF0Y2hTaXplOiBudW1iZXIsIGlucHV0SGVpZ2h0OiBudW1iZXIsIGlucHV0V2lkdGg6IG51bWJlcixcbiAgICBmaWx0ZXJJZDogbnVtYmVyLCBmaWx0ZXJIZWlnaHQ6IG51bWJlciwgZmlsdGVyV2lkdGg6IG51bWJlciwgcGFkVG9wOiBudW1iZXIsXG4gICAgcGFkUmlnaHQ6IG51bWJlciwgcGFkQm90dG9tOiBudW1iZXIsIHBhZExlZnQ6IG51bWJlciwgaXNTYW1lUGFkOiBudW1iZXIsXG4gICAgZGlsYXRpb25IZWlnaHQ6IG51bWJlciwgZGlsYXRpb25XaWR0aDogbnVtYmVyLCBzdHJpZGVIZWlnaHQ6IG51bWJlcixcbiAgICBzdHJpZGVXaWR0aDogbnVtYmVyLCBpbnB1dENoYW5uZWxzOiBudW1iZXIsIG91dHB1dENoYW5uZWxzOiBudW1iZXIsXG4gICAgb3V0SWQ6IG51bWJlcikgPT4gdm9pZDtcblxuZnVuY3Rpb24gc2V0dXAoYmFja2VuZDogQmFja2VuZFdhc20pIHtcbiAgd2FzbUNvbnYyZCA9IGJhY2tlbmQud2FzbS5jd3JhcChDb252MkQsIG51bGwgLyogdm9pZCAqLywgW1xuICAgICdudW1iZXInLCAgLy8geElkXG4gICAgJ251bWJlcicsICAvLyBiYXRjaFNpemVcbiAgICAnbnVtYmVyJywgIC8vIGlucHV0SGVpZ2h0XG4gICAgJ251bWJlcicsICAvLyBpbnB1dFdpZHRoXG4gICAgJ251bWJlcicsICAvLyBmaWx0ZXJJZFxuICAgICdudW1iZXInLCAgLy8gZmlsdGVySGVpZ2h0XG4gICAgJ251bWJlcicsICAvLyBmaWx0ZXJXaWR0aFxuICAgICdudW1iZXInLCAgLy8gcGFkVG9wXG4gICAgJ251bWJlcicsICAvLyBwYWRSaWdodFxuICAgICdudW1iZXInLCAgLy8gcGFkQm90dG9tXG4gICAgJ251bWJlcicsICAvLyBwYWRMZWZ0XG4gICAgJ251bWJlcicsICAvLyBpc1NhbWVQYWRcbiAgICAnbnVtYmVyJywgIC8vIGRpbGF0aW9uSGVpZ2h0XG4gICAgJ251bWJlcicsICAvLyBkaWxhdGlvbldpZHRoXG4gICAgJ251bWJlcicsICAvLyBzdHJpZGVIZWlnaHRcbiAgICAnbnVtYmVyJywgIC8vIHN0cmlkZVdpZHRoXG4gICAgJ251bWJlcicsICAvLyBpbnB1dENoYW5uZWxzXG4gICAgJ251bWJlcicsICAvLyBvdXRwdXRDaGFubmVsc1xuICAgICdudW1iZXInLCAgLy8gb3V0SWRcbiAgXSk7XG59XG5cbmZ1bmN0aW9uIGNvbnYyZChcbiAgICBhcmdzOiB7aW5wdXRzOiBDb252MkRJbnB1dHMsIGJhY2tlbmQ6IEJhY2tlbmRXYXNtLCBhdHRyczogQ29udjJEQXR0cnN9KSB7XG4gIGNvbnN0IHtpbnB1dHMsIGF0dHJzLCBiYWNrZW5kfSA9IGFyZ3M7XG5cbiAgY29uc3Qge3gsIGZpbHRlcn0gPSBpbnB1dHM7XG4gIGNvbnN0IHhJZCA9IGJhY2tlbmQuZGF0YUlkTWFwLmdldCh4LmRhdGFJZCkuaWQ7XG4gIGNvbnN0IGZpbHRlcklkID0gYmFja2VuZC5kYXRhSWRNYXAuZ2V0KGZpbHRlci5kYXRhSWQpLmlkO1xuXG4gIGNvbnN0IHtzdHJpZGVzLCBkaWxhdGlvbnMsIHBhZCwgZGltUm91bmRpbmdNb2RlLCBkYXRhRm9ybWF0fSA9IGF0dHJzO1xuICBjb25zdCAkZGF0YUZvcm1hdCA9IGJhY2tlbmRfdXRpbC5jb252ZXJ0Q29udjJERGF0YUZvcm1hdChkYXRhRm9ybWF0KTtcbiAgY29uc3QgY29udkluZm8gPSBiYWNrZW5kX3V0aWwuY29tcHV0ZUNvbnYyREluZm8oXG4gICAgICAoeCBhcyBUZW5zb3I0RCkuc2hhcGUsIChmaWx0ZXIgYXMgVGVuc29yNEQpLnNoYXBlLCBzdHJpZGVzLCBkaWxhdGlvbnMsXG4gICAgICBwYWQsIGRpbVJvdW5kaW5nTW9kZSwgZmFsc2UsICRkYXRhRm9ybWF0KTtcblxuICBjb25zdCBmaWx0ZXJIZWlnaHQgPSBjb252SW5mby5maWx0ZXJIZWlnaHQ7XG4gIGNvbnN0IGZpbHRlcldpZHRoID0gY29udkluZm8uZmlsdGVyV2lkdGg7XG4gIGNvbnN0IHBhZFRvcCA9IGNvbnZJbmZvLnBhZEluZm8udG9wO1xuICBjb25zdCBwYWRSaWdodCA9IGNvbnZJbmZvLnBhZEluZm8ucmlnaHQ7XG4gIGNvbnN0IHBhZEJvdHRvbSA9IGNvbnZJbmZvLnBhZEluZm8uYm90dG9tO1xuICBjb25zdCBwYWRMZWZ0ID0gY29udkluZm8ucGFkSW5mby5sZWZ0O1xuICBjb25zdCBkaWxhdGlvbkhlaWdodCA9IGNvbnZJbmZvLmRpbGF0aW9uSGVpZ2h0O1xuICBjb25zdCBkaWxhdGlvbldpZHRoID0gY29udkluZm8uZGlsYXRpb25XaWR0aDtcbiAgY29uc3Qgc3RyaWRlSGVpZ2h0ID0gY29udkluZm8uc3RyaWRlSGVpZ2h0O1xuICBjb25zdCBzdHJpZGVXaWR0aCA9IGNvbnZJbmZvLnN0cmlkZVdpZHRoO1xuICBjb25zdCBpbnB1dENoYW5uZWxzID0gY29udkluZm8uaW5DaGFubmVscztcbiAgY29uc3Qgb3V0cHV0Q2hhbm5lbHMgPSBjb252SW5mby5vdXRDaGFubmVscztcbiAgY29uc3QgaXNTYW1lUGFkID0gY29udkluZm8ucGFkSW5mby50eXBlID09PSAnU0FNRScgPyAxIDogMDtcblxuICBpZiAoY29udkluZm8uZGF0YUZvcm1hdCAhPT0gJ2NoYW5uZWxzTGFzdCcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGB3YXNtIGJhY2tlbmQgQ29udjJEIGRvZXMgbm90IHN1cHBvcnQgZGF0YUZvcm1hdDonYCArXG4gICAgICAgIGAke2NvbnZJbmZvLmRhdGFGb3JtYXR9Jy4gUGxlYXNlIHVzZSAnY2hhbm5lbHNMYXN0Jy5gKTtcbiAgfVxuXG4gIGNvbnN0IG91dCA9IGJhY2tlbmQubWFrZU91dHB1dChjb252SW5mby5vdXRTaGFwZSwgJ2Zsb2F0MzInKTtcbiAgY29uc3Qgb3V0SWQgPSBiYWNrZW5kLmRhdGFJZE1hcC5nZXQob3V0LmRhdGFJZCkuaWQ7XG4gIHdhc21Db252MmQoXG4gICAgICB4SWQsIHguc2hhcGVbMF0sIHguc2hhcGVbMV0sIHguc2hhcGVbMl0sIGZpbHRlcklkLCBmaWx0ZXJIZWlnaHQsXG4gICAgICBmaWx0ZXJXaWR0aCwgcGFkVG9wLCBwYWRSaWdodCwgcGFkQm90dG9tLCBwYWRMZWZ0LCBpc1NhbWVQYWQsXG4gICAgICBkaWxhdGlvbkhlaWdodCwgZGlsYXRpb25XaWR0aCwgc3RyaWRlSGVpZ2h0LCBzdHJpZGVXaWR0aCwgaW5wdXRDaGFubmVscyxcbiAgICAgIG91dHB1dENoYW5uZWxzLCBvdXRJZCk7XG4gIHJldHVybiBvdXQ7XG59XG5cbmV4cG9ydCBjb25zdCBjb252MkRDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogQ29udjJELFxuICBiYWNrZW5kTmFtZTogJ3dhc20nLFxuICBzZXR1cEZ1bmM6IHNldHVwLFxuICBrZXJuZWxGdW5jOiBjb252MmQgYXMge30gYXMgS2VybmVsRnVuY1xufTtcbiJdfQ==