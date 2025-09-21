import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { u as useHead } from './index-CrXeyONu.mjs';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate } from 'vue/server-renderer';
import './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const appName = ref("");
    const loading = ref(false);
    const error = ref("");
    useHead({
      title: "Mobile App Review Insights - Analyze App Store Reviews",
      meta: [
        {
          name: "description",
          content: "Get comprehensive analytics and sentiment analysis from iOS App Store and Google Play reviews for any mobile app."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" }, _attrs))}><div class="container mx-auto px-4 py-16"><div class="max-w-2xl mx-auto text-center"><div class="mb-12"><div class="w-16 h-16 text-blue-600 mx-auto mb-4 flex items-center justify-center text-4xl"> \u{1F4F1} </div><h1 class="text-4xl font-bold text-gray-900 mb-4"> Mobile App Review Insights </h1><p class="text-xl text-gray-600"> Get comprehensive analytics and sentiment analysis from iOS App Store and Google Play reviews </p></div><div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 max-w-lg mx-auto"><form class="space-y-6"><div><label for="appName" class="block text-sm font-medium text-gray-700 mb-2"> App Name </label><input id="appName"${ssrRenderAttr("value", unref(appName))} type="text" placeholder="e.g., The North Face, Instagram, WhatsApp" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}><p class="text-sm text-gray-500 mt-2"> Enter the name of any mobile app to analyze its reviews </p></div><button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 w-full flex items-center justify-center space-x-2"${ssrIncludeBooleanAttr(unref(loading) || !unref(appName).trim()) ? " disabled" : ""}>`);
      if (unref(loading)) {
        _push(`<span>\u{1F504}</span>`);
      } else {
        _push(`<span>\u{1F50D}</span>`);
      }
      _push(`<span>${ssrInterpolate(unref(loading) ? "Analyzing Reviews..." : "Get Insights")}</span></button></form>`);
      if (unref(error)) {
        _push(`<div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"><div class="flex items-center space-x-2"><span class="text-red-600">\u26A0\uFE0F</span><p class="text-red-800 font-medium">${ssrInterpolate(unref(error))}</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mt-16 grid md:grid-cols-3 gap-8"><div class="text-center"><div class="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"><span class="text-2xl">\u{1F4CA}</span></div><h3 class="text-lg font-semibold text-gray-900 mb-2">Rating Analytics</h3><p class="text-gray-600">Visualize rating distributions and trends over time</p></div><div class="text-center"><div class="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"><span class="text-2xl">\u2764\uFE0F</span></div><h3 class="text-lg font-semibold text-gray-900 mb-2">Sentiment Analysis</h3><p class="text-gray-600">Understand user sentiment with AI-powered analysis</p></div><div class="text-center"><div class="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"><span class="text-2xl">\u{1F4F1}</span></div><h3 class="text-lg font-semibold text-gray-900 mb-2">Cross-Platform</h3><p class="text-gray-600">Analyze reviews from both iOS App Store and Google Play</p></div></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-D7_nVVma.mjs.map
