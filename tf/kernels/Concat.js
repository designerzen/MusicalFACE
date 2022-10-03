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
import { backend_util, Concat, util } from '@tensorflow/tfjs-core';
import { concatImplCPU } from '../kernel_utils/shared';
import { identity } from './Identity';
import { reshape } from './Reshape';
export function concat(args) {
    const { inputs, backend } = args;
    const axis = util.parseAxisParam(args.attrs.axis, inputs[0].shape)[0];
    let outShape = backend_util.computeOutShape(inputs.map(t => t.shape), axis);
    // Keep only non-empty tensors (ignore tensors with 0 in their shape).
    const $inputs = inputs.filter(t => util.sizeFromShape(t.shape) > 0);
    if ($inputs.length === 1) {
        return identity({ inputs: { x: $inputs[0] }, backend });
    }
    const out = backend.makeOutput(outShape, inputs[0].dtype);
    if (util.sizeFromShape(outShape) === 0) {
        return out;
    }
    const shapes = $inputs.map(t => t.shape);
    backend_util.assertParamsConsistent(shapes, axis);
    if ($inputs[0].dtype === 'string') {
        // Any concat of n-dimensional tensors across any axis can be reduced to
        // a concatenation of two-dimensional tensors across the axis 1 by first
        // partitioning the axes of the original tensors into those less than the
        // axis to be concatenated and the rest. Then reshape the tensors
        // into a two-dimensional tensor by collapsing these two sets of axes and
        // concatenate the resulting matrices across the axis 1, finally reshaping
        // the result to have the proper shape.
        const inputs2D = $inputs.map(t => {
            const innerSize = util.sizeFromShape(t.shape.slice(axis));
            const shape = [-1, innerSize];
            return reshape({ inputs: { x: t }, backend, attrs: { shape } });
        });
        const inputsValShapes = inputs2D.map(t => {
            return { vals: backend.readSync(t.dataId), shape: t.shape };
        });
        // Concats 2d tensors along axis=1.
        outShape =
            backend_util.computeOutShape(inputs2D.map(t => t.shape), 1 /* axis */);
        const simplyConcat = inputs2D[0].shape[0] === 1;
        const outVals = concatImplCPU(inputsValShapes, outShape, inputs[0].dtype, simplyConcat);
        const finalOutShape = backend_util.computeOutShape($inputs.map(t => t.shape), axis);
        out.shape = finalOutShape;
        const outData = backend.dataIdMap.get(out.dataId);
        outData.stringBytes = backend_util.fromStringArrayToUint8(outVals);
        inputs2D.forEach(t => backend.disposeData(t.dataId));
        return out;
    }
    const batchDim = util.sizeFromShape($inputs[0].shape.slice(0, axis));
    let sumInnerDims = 0;
    const innerDims = $inputs.map(input => {
        const innerDim = util.sizeFromShape(input.shape.slice(axis));
        sumInnerDims += innerDim;
        return innerDim;
    });
    const inVals = $inputs.map(input => backend.typedArrayFromHeap(input));
    const outVals = backend.typedArrayFromHeap(out);
    for (let b = 0; b < batchDim; b++) {
        let outOffset = b * sumInnerDims;
        for (let i = 0; i < inVals.length; i++) {
            const innerDim = innerDims[i];
            const inOffset = b * innerDim;
            const vals = inVals[i].subarray(inOffset, inOffset + innerDim);
            outVals.set(vals, outOffset);
            outOffset += innerDim;
        }
    }
    return out;
}
export const concatConfig = {
    kernelName: Concat,
    backendName: 'wasm',
    kernelFunc: concat,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uY2F0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdhc20vc3JjL2tlcm5lbHMvQ29uY2F0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQUUsTUFBTSxFQUF1RCxJQUFJLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUd0SCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNwQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBRWxDLE1BQU0sVUFBVSxNQUFNLENBQ2xCLElBQXNFO0lBQ3hFLE1BQU0sRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFDLEdBQUcsSUFBSSxDQUFDO0lBRS9CLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXRFLElBQUksUUFBUSxHQUFHLFlBQVksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUU1RSxzRUFBc0U7SUFDdEUsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDeEIsT0FBTyxRQUFRLENBQUMsRUFBQyxNQUFNLEVBQUUsRUFB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QUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztZQUM3QixTQUFTLElBQUksUUFBUSxDQUFDO1NBQ3ZCO0tBQ0Y7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQWlCO0lBQ3hDLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLFdBQVcsRUFBRSxNQUFNO0lBQ25CLFVBQVUsRUFBRSxNQUEwQjtDQUN2QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2JhY2tlbmRfdXRpbCwgQ29uY2F0LCBDb25jYXRBdHRycywgQ29uY2F0SW5wdXRzLCBLZXJuZWxDb25maWcsIEtlcm5lbEZ1bmMsIHV0aWx9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7QmFja2VuZFdhc219IGZyb20gJy4uL2JhY2tlbmRfd2FzbSc7XG5pbXBvcnQge2NvbmNhdEltcGxDUFV9IGZyb20gJy4uL2tlcm5lbF91dGlscy9zaGFyZWQnO1xuaW1wb3J0IHtpZGVudGl0eX0gZnJvbSAnLi9JZGVudGl0eSc7XG5pbXBvcnQge3Jlc2hhcGV9IGZyb20gJy4vUmVzaGFwZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQoXG4gICAgYXJnczoge2lucHV0czogQ29uY2F0SW5wdXRzLCBiYWNrZW5kOiBCYWNrZW5kV2FzbSwgYXR0cnM6IENvbmNhdEF0dHJzfSkge1xuICBjb25zdCB7aW5wdXRzLCBiYWNrZW5kfSA9IGFyZ3M7XG5cbiAgY29uc3QgYXhpcyA9IHV0aWwucGFyc2VBeGlzUGFyYW0oYXJncy5hdHRycy5heGlzLCBpbnB1dHNbMF0uc2hhcGUpWzBdO1xuXG4gIGxldCBvdXRTaGFwZSA9IGJhY2tlbmRfdXRpbC5jb21wdXRlT3V0U2hhcGUoaW5wdXRzLm1hcCh0ID0+IHQuc2hhcGUpLCBheGlzKTtcblxuICAvLyBLZWVwIG9ubHkgbm9uLWVtcHR5IHRlbnNvcnMgKGlnbm9yZSB0ZW5zb3JzIHdpdGggMCBpbiB0aGVpciBzaGFwZSkuXG4gIGNvbnN0ICRpbnB1dHMgPSBpbnB1dHMuZmlsdGVyKHQgPT4gdXRpbC5zaXplRnJvbVNoYXBlKHQuc2hhcGUpID4gMCk7XG4gIGlmICgkaW5wdXRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBpZGVudGl0eSh7aW5wdXRzOiB7eDogJGlucHV0c1swXX0sIGJhY2tlbmR9KTtcbiAgfVxuXG4gIGNvbnN0IG91dCA9IGJhY2tlbmQubWFrZU91dHB1dChvdXRTaGFwZSwgaW5wdXRzWzBdLmR0eXBlKTtcblxuICBpZiAodXRpbC5zaXplRnJvbVNoYXBlKG91dFNoYXBlKSA9PT0gMCkge1xuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBjb25zdCBzaGFwZXMgPSAkaW5wdXRzLm1hcCh0ID0+IHQuc2hhcGUpO1xuICBiYWNrZW5kX3V0aWwuYXNzZXJ0UGFyYW1zQ29uc2lzdGVudChzaGFwZXMsIGF4aXMpO1xuXG4gIGlmICgkaW5wdXRzWzBdLmR0eXBlID09PSAnc3RyaW5nJykge1xuICAgIC8vIEFueSBjb25jYXQgb2Ygbi1kaW1lbnNpb25hbCB0ZW5zb3JzIGFjcm9zcyBhbnkgYXhpcyBjYW4gYmUgcmVkdWNlZCB0b1xuICAgIC8vIGEgY29uY2F0ZW5hdGlvbiBvZiB0d28tZGltZW5zaW9uYWwgdGVuc29ycyBhY3Jvc3MgdGhlIGF4aXMgMSBieSBmaXJzdFxuICAgIC8vIHBhcnRpdGlvbmluZyB0aGUgYXhlcyBvZiB0aGUgb3JpZ2luYWwgdGVuc29ycyBpbnRvIHRob3NlIGxlc3MgdGhhbiB0aGVcbiAgICAvLyBheGlzIHRvIGJlIGNvbmNhdGVuYXRlZCBhbmQgdGhlIHJlc3QuIFRoZW4gcmVzaGFwZSB0aGUgdGVuc29yc1xuICAgIC8vIGludG8gYSB0d28tZGltZW5zaW9uYWwgdGVuc29yIGJ5IGNvbGxhcHNpbmcgdGhlc2UgdHdvIHNldHMgb2YgYXhlcyBhbmRcbiAgICAvLyBjb25jYXRlbmF0ZSB0aGUgcmVzdWx0aW5nIG1hdHJpY2VzIGFjcm9zcyB0aGUgYXhpcyAxLCBmaW5hbGx5IHJlc2hhcGluZ1xuICAgIC8vIHRoZSByZXN1bHQgdG8gaGF2ZSB0aGUgcHJvcGVyIHNoYXBlLlxuICAgIGNvbnN0IGlucHV0czJEID0gJGlucHV0cy5tYXAodCA9PiB7XG4gICAgICBjb25zdCBpbm5lclNpemUgPSB1dGlsLnNpemVGcm9tU2hhcGUodC5zaGFwZS5zbGljZShheGlzKSk7XG4gICAgICBjb25zdCBzaGFwZSA9IFstMSwgaW5uZXJTaXplXTtcbiAgICAgIHJldHVybiByZXNoYXBlKHtpbnB1dHM6IHt4OiB0fSwgYmFja2VuZCwgYXR0cnM6IHtzaGFwZX19KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGlucHV0c1ZhbFNoYXBlcyA9IGlucHV0czJELm1hcCh0ID0+IHtcbiAgICAgIHJldHVybiB7dmFsczogYmFja2VuZC5yZWFkU3luYyh0LmRhdGFJZCksIHNoYXBlOiB0LnNoYXBlfTtcbiAgICB9KTtcblxuICAgIC8vIENvbmNhdHMgMmQgdGVuc29ycyBhbG9uZyBheGlzPTEuXG4gICAgb3V0U2hhcGUgPVxuICAgICAgICBiYWNrZW5kX3V0aWwuY29tcHV0ZU91dFNoYXBlKGlucHV0czJELm1hcCh0ID0+IHQuc2hhcGUpLCAxIC8qIGF4aXMgKi8pO1xuICAgIGNvbnN0IHNpbXBseUNvbmNhdCA9IGlucHV0czJEWzBdLnNoYXBlWzBdID09PSAxO1xuICAgIGNvbnN0IG91dFZhbHMgPSBjb25jYXRJbXBsQ1BVKFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzVmFsU2hhcGVzLCBvdXRTaGFwZSwgaW5wdXRzWzBdLmR0eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2ltcGx5Q29uY2F0KSBhcyBzdHJpbmdbXTtcblxuICAgIGNvbnN0IGZpbmFsT3V0U2hhcGUgPVxuICAgICAgICBiYWNrZW5kX3V0aWwuY29tcHV0ZU91dFNoYXBlKCRpbnB1dHMubWFwKHQgPT4gdC5zaGFwZSksIGF4aXMpO1xuXG4gICAgb3V0LnNoYXBlID0gZmluYWxPdXRTaGFwZTtcbiAgICBjb25zdCBvdXREYXRhID0gYmFja2VuZC5kYXRhSWRNYXAuZ2V0KG91dC5kYXRhSWQpO1xuICAgIG91dERhdGEuc3RyaW5nQnl0ZXMgPSBiYWNrZW5kX3V0aWwuZnJvbVN0cmluZ0FycmF5VG9VaW50OChvdXRWYWxzKTtcblxuICAgIGlucHV0czJELmZvckVhY2godCA9PiBiYWNrZW5kLmRpc3Bvc2VEYXRhKHQuZGF0YUlkKSk7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgY29uc3QgYmF0Y2hEaW0gPSB1dGlsLnNpemVGcm9tU2hhcGUoJGlucHV0c1swXS5zaGFwZS5zbGljZSgwLCBheGlzKSk7XG4gIGxldCBzdW1Jbm5lckRpbXMgPSAwO1xuICBjb25zdCBpbm5lckRpbXMgPSAkaW5wdXRzLm1hcChpbnB1dCA9PiB7XG4gICAgY29uc3QgaW5uZXJEaW0gPSB1dGlsLnNpemVGcm9tU2hhcGUoaW5wdXQuc2hhcGUuc2xpY2UoYXhpcykpO1xuICAgIHN1bUlubmVyRGltcyArPSBpbm5lckRpbTtcbiAgICByZXR1cm4gaW5uZXJEaW07XG4gIH0pO1xuICBjb25zdCBpblZhbHMgPSAkaW5wdXRzLm1hcChpbnB1dCA9PiBiYWNrZW5kLnR5cGVkQXJyYXlGcm9tSGVhcChpbnB1dCkpO1xuICBjb25zdCBvdXRWYWxzID0gYmFja2VuZC50eXBlZEFycmF5RnJvbUhlYXAob3V0KTtcbiAgZm9yIChsZXQgYiA9IDA7IGIgPCBiYXRjaERpbTsgYisrKSB7XG4gICAgbGV0IG91dE9mZnNldCA9IGIgKiBzdW1Jbm5lckRpbXM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpblZhbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGlubmVyRGltID0gaW5uZXJEaW1zW2ldO1xuICAgICAgY29uc3QgaW5PZmZzZXQgPSBiICogaW5uZXJEaW07XG4gICAgICBjb25zdCB2YWxzID0gaW5WYWxzW2ldLnN1YmFycmF5KGluT2Zmc2V0LCBpbk9mZnNldCArIGlubmVyRGltKTtcbiAgICAgIG91dFZhbHMuc2V0KHZhbHMsIG91dE9mZnNldCk7XG4gICAgICBvdXRPZmZzZXQgKz0gaW5uZXJEaW07XG4gICAgfVxuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbmV4cG9ydCBjb25zdCBjb25jYXRDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogQ29uY2F0LFxuICBiYWNrZW5kTmFtZTogJ3dhc20nLFxuICBrZXJuZWxGdW5jOiBjb25jYXQgYXMge30gYXMgS2VybmVsRnVuYyxcbn07XG4iXX0=