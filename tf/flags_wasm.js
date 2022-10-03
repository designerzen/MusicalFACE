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
import { env } from '@tensorflow/tfjs-core';
const ENV = env();
/**
 * True if SIMD is supported.
 */
// From: https://github.com/GoogleChromeLabs/wasm-feature-detect
ENV.registerFlag(
// This typed array passed in to WebAssembly.validate is WebAssembly binary
// code. In this case it is a small program that contains SIMD
// instructions.
'WASM_HAS_SIMD_SUPPORT', async () => WebAssembly.validate(new Uint8Array([
    0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3,
    2, 1, 0, 10, 9, 1, 7, 0, 65, 0, 253, 15, 26, 11
])));
/**
 * True if threads are supported.
 */
// From: https://github.com/GoogleChromeLabs/wasm-feature-detect
ENV.registerFlag('WASM_HAS_MULTITHREAD_SUPPORT', async () => {
    // TODO(annxingyuan): Enable node support once this is resolved:
    // https://github.com/tensorflow/tfjs/issues/3830
    if (ENV.get('IS_NODE')) {
        return false;
    }
    try {
        // Test for transferability of SABs (needed for Firefox)
        // https://groups.google.com/forum/#!msg/mozilla.dev.platform/IHkBZlHETpA/dwsMNchWEQAJ
        new MessageChannel().port1.postMessage(new SharedArrayBuffer(1));
        // This typed array is a WebAssembly program containing threaded
        // instructions.
        return WebAssembly.validate(new Uint8Array([
            0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5,
            4, 1, 3, 1, 1, 10, 11, 1, 9, 0, 65, 0, 254, 16, 2, 0, 26, 11
        ]));
    }
    catch (e) {
        return false;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxhZ3Nfd2FzbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13YXNtL3NyYy9mbGFnc193YXNtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUUxQyxNQUFNLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUVsQjs7R0FFRztBQUNILGdFQUFnRTtBQUNoRSxHQUFHLENBQUMsWUFBWTtBQUNaLDJFQUEyRTtBQUMzRSw4REFBOEQ7QUFDOUQsZ0JBQWdCO0FBQ2hCLHVCQUF1QixFQUFFLEtBQUssSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLFVBQVUsQ0FBQztJQUN2RSxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRyxDQUFDLEVBQUUsQ0FBQyxFQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUcsQ0FBQyxFQUFFLENBQUM7SUFDckQsQ0FBQyxFQUFFLENBQUMsRUFBRyxDQUFDLEVBQUksRUFBRSxFQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Q0FDcEQsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUVUOztHQUVHO0FBQ0gsZ0VBQWdFO0FBQ2hFLEdBQUcsQ0FBQyxZQUFZLENBQUMsOEJBQThCLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDMUQsZ0VBQWdFO0lBQ2hFLGlEQUFpRDtJQUNqRCxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFDdEIsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUVELElBQUk7UUFDRix3REFBd0Q7UUFDeEQsc0ZBQXNGO1FBQ3RGLElBQUksY0FBYyxFQUFFLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakUsZ0VBQWdFO1FBQ2hFLGdCQUFnQjtRQUNoQixPQUFPLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxVQUFVLENBQUM7WUFDekMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUcsQ0FBQyxFQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRyxFQUFFLEVBQUUsQ0FBQyxFQUFJLENBQUMsRUFBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRyxDQUFDLEVBQUUsQ0FBQztZQUNwRSxDQUFDLEVBQUUsQ0FBQyxFQUFHLENBQUMsRUFBSSxDQUFDLEVBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUU7U0FDbkUsQ0FBQyxDQUFDLENBQUM7S0FDTDtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTyxLQUFLLENBQUM7S0FDZDtBQUNILENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2Vudn0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuY29uc3QgRU5WID0gZW52KCk7XG5cbi8qKlxuICogVHJ1ZSBpZiBTSU1EIGlzIHN1cHBvcnRlZC5cbiAqL1xuLy8gRnJvbTogaHR0cHM6Ly9naXRodWIuY29tL0dvb2dsZUNocm9tZUxhYnMvd2FzbS1mZWF0dXJlLWRldGVjdFxuRU5WLnJlZ2lzdGVyRmxhZyhcbiAgICAvLyBUaGlzIHR5cGVkIGFycmF5IHBhc3NlZCBpbiB0byBXZWJBc3NlbWJseS52YWxpZGF0ZSBpcyBXZWJBc3NlbWJseSBiaW5hcnlcbiAgICAvLyBjb2RlLiBJbiB0aGlzIGNhc2UgaXQgaXMgYSBzbWFsbCBwcm9ncmFtIHRoYXQgY29udGFpbnMgU0lNRFxuICAgIC8vIGluc3RydWN0aW9ucy5cbiAgICAnV0FTTV9IQVNfU0lNRF9TVVBQT1JUJywgYXN5bmMgKCkgPT4gV2ViQXNzZW1ibHkudmFsaWRhdGUobmV3IFVpbnQ4QXJyYXkoW1xuICAgICAgMCwgOTcsIDExNSwgMTA5LCAxLCAwLCAwLCAwLCAxLCAgNCwgMSwgICA5NiwgMCwgIDAsIDMsXG4gICAgICAyLCAxLCAgMCwgICAxMCwgIDksIDEsIDcsIDAsIDY1LCAwLCAyNTMsIDE1LCAyNiwgMTFcbiAgICBdKSkpO1xuXG4vKipcbiAqIFRydWUgaWYgdGhyZWFkcyBhcmUgc3VwcG9ydGVkLlxuICovXG4vLyBGcm9tOiBodHRwczovL2dpdGh1Yi5jb20vR29vZ2xlQ2hyb21lTGFicy93YXNtLWZlYXR1cmUtZGV0ZWN0XG5FTlYucmVnaXN0ZXJGbGFnKCdXQVNNX0hBU19NVUxUSVRIUkVBRF9TVVBQT1JUJywgYXN5bmMgKCkgPT4ge1xuICAvLyBUT0RPKGFubnhpbmd5dWFuKTogRW5hYmxlIG5vZGUgc3VwcG9ydCBvbmNlIHRoaXMgaXMgcmVzb2x2ZWQ6XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90ZW5zb3JmbG93L3RmanMvaXNzdWVzLzM4MzBcbiAgaWYgKEVOVi5nZXQoJ0lTX05PREUnKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgLy8gVGVzdCBmb3IgdHJhbnNmZXJhYmlsaXR5IG9mIFNBQnMgKG5lZWRlZCBmb3IgRmlyZWZveClcbiAgICAvLyBodHRwczovL2dyb3Vwcy5nb29nbGUuY29tL2ZvcnVtLyMhbXNnL21vemlsbGEuZGV2LnBsYXRmb3JtL0lIa0JabEhFVHBBL2R3c01OY2hXRVFBSlxuICAgIG5ldyBNZXNzYWdlQ2hhbm5lbCgpLnBvcnQxLnBvc3RNZXNzYWdlKG5ldyBTaGFyZWRBcnJheUJ1ZmZlcigxKSk7XG4gICAgLy8gVGhpcyB0eXBlZCBhcnJheSBpcyBhIFdlYkFzc2VtYmx5IHByb2dyYW0gY29udGFpbmluZyB0aHJlYWRlZFxuICAgIC8vIGluc3RydWN0aW9ucy5cbiAgICByZXR1cm4gV2ViQXNzZW1ibHkudmFsaWRhdGUobmV3IFVpbnQ4QXJyYXkoW1xuICAgICAgMCwgOTcsIDExNSwgMTA5LCAxLCAwLCAgMCwgIDAsIDEsIDQsIDEsICA5NiwgMCwgICAwLCAgMywgMiwgMSwgIDAsIDUsXG4gICAgICA0LCAxLCAgMywgICAxLCAgIDEsIDEwLCAxMSwgMSwgOSwgMCwgNjUsIDAsICAyNTQsIDE2LCAyLCAwLCAyNiwgMTFcbiAgICBdKSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn0pO1xuIl19