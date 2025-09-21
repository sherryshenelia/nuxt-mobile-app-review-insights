import { _ as __nuxt_component_0 } from './nuxt-link-DdBPy2Dw.mjs';
import { u as useRoute } from './server.mjs';
import { ref, computed, mergeProps, withCtx, createVNode, unref, createTextVNode, useSSRContext } from 'vue';
import { u as useHead } from './index-CrXeyONu.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
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
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const loading = ref(true);
    const error = ref("");
    const reviewData = ref(null);
    const appInfo = computed(() => {
      var _a;
      return (_a = reviewData.value) == null ? void 0 : _a.appInfo;
    });
    const recentReviews = computed(() => {
      var _a;
      return ((_a = reviewData.value) == null ? void 0 : _a.reviews.slice(0, 5)) || [];
    });
    const primaryAppInfo = computed(() => {
      var _a;
      if (!((_a = appInfo.value) == null ? void 0 : _a.foundApps)) return null;
      return appInfo.value.foundApps.ios || appInfo.value.foundApps.android;
    });
    const averageRating = computed(() => {
      var _a;
      if (!((_a = reviewData.value) == null ? void 0 : _a.reviews.length)) return "0.0";
      const sum = reviewData.value.reviews.reduce((acc, review) => acc + review.rating, 0);
      return (sum / reviewData.value.reviews.length).toFixed(1);
    });
    const sentimentPercentage = computed(() => {
      var _a;
      if (!((_a = reviewData.value) == null ? void 0 : _a.summary)) return { positive: 0, neutral: 0, negative: 0 };
      const total = reviewData.value.totalReviews;
      const { positive, neutral, negative } = reviewData.value.summary.sentimentDistribution;
      return {
        positive: Math.round(positive / total * 100),
        neutral: Math.round(neutral / total * 100),
        negative: Math.round(negative / total * 100)
      };
    });
    const platformSplit = computed(() => {
      var _a;
      if (!((_a = reviewData.value) == null ? void 0 : _a.summary)) return "0/0";
      const { ios, android } = reviewData.value.summary;
      return `${ios}/${android}`;
    });
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    };
    const formatNumber = (num) => {
      if (num >= 1e6) {
        return (num / 1e6).toFixed(1) + "M";
      } else if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + "K";
      }
      return num.toString();
    };
    useHead({
      title: `${route.query.app || "App"} - Review Insights Dashboard`,
      meta: [
        {
          name: "description",
          content: `Comprehensive review analysis and insights for ${route.query.app || "mobile app"}`
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}><header class="bg-white shadow-sm border-b"><div class="container mx-auto px-4 py-4"><div class="flex items-center justify-between"><div class="flex items-center space-x-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center space-x-2 text-blue-600 hover:text-blue-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span${_scopeId}>\u2190</span><span class="font-medium"${_scopeId}>Back to Search</span>`);
          } else {
            return [
              createVNode("span", null, "\u2190"),
              createVNode("span", { class: "font-medium" }, "Back to Search")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="h-6 w-px bg-gray-300"></div><h1 class="text-xl font-bold text-gray-900">${ssrInterpolate(((_a = unref(appInfo)) == null ? void 0 : _a.searchTerm) || "App Insights")}</h1></div>`);
      if ((_b = unref(appInfo)) == null ? void 0 : _b.foundApps) {
        _push(`<div class="flex items-center space-x-2 text-sm text-gray-600"><span>\u{1F4F1}</span><span>${ssrInterpolate(unref(appInfo).foundApps.ios ? "iOS" : "")} ${ssrInterpolate(unref(appInfo).foundApps.ios && unref(appInfo).foundApps.android ? " & " : "")} ${ssrInterpolate(unref(appInfo).foundApps.android ? "Android" : "")}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></header><div class="container mx-auto px-4 py-8">`);
      if (unref(loading)) {
        _push(`<div class="flex items-center justify-center py-16"><div class="text-center"><div class="text-4xl mb-4">\u{1F504}</div><p class="text-gray-600">Analyzing app reviews...</p></div></div>`);
      } else if (unref(error)) {
        _push(`<div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 max-w-lg mx-auto text-center"><div class="text-4xl mb-4">\u26A0\uFE0F</div><h2 class="text-xl font-semibold text-gray-900 mb-2">Failed to Load Reviews</h2><p class="text-gray-600 mb-4">${ssrInterpolate(unref(error))}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Try Another App `);
            } else {
              return [
                createTextVNode(" Try Another App ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else if (unref(reviewData)) {
        _push(`<div class="space-y-8"><div class="bg-white rounded-lg shadow-md p-6 border border-gray-200"><div class="flex items-center space-x-4">`);
        if ((_c = unref(primaryAppInfo)) == null ? void 0 : _c.icon) {
          _push(`<div class="flex-shrink-0"><img${ssrRenderAttr("src", unref(primaryAppInfo).icon)}${ssrRenderAttr("alt", unref(primaryAppInfo).name)} class="w-20 h-20 rounded-xl shadow-md"></div>`);
        } else {
          _push(`<div class="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center"><span class="text-3xl">\u{1F4F1}</span></div>`);
        }
        _push(`<div class="flex-1"><h2 class="text-2xl font-bold text-gray-900 mb-1">${ssrInterpolate(((_d = unref(primaryAppInfo)) == null ? void 0 : _d.name) || ((_e = unref(appInfo)) == null ? void 0 : _e.searchTerm))}</h2>`);
        if ((_f = unref(primaryAppInfo)) == null ? void 0 : _f.developer) {
          _push(`<p class="text-gray-600 mb-2">by ${ssrInterpolate(unref(primaryAppInfo).developer)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="space-y-3">`);
        if ((_i = (_h = (_g = unref(appInfo)) == null ? void 0 : _g.foundApps) == null ? void 0 : _h.ios) == null ? void 0 : _i.rating) {
          _push(`<div class="flex items-center space-x-3"><div class="flex items-center space-x-1"><span class="text-sm font-medium text-blue-600 w-12">iOS</span><div class="flex items-center"><!--[-->`);
          ssrRenderList(5, (i) => {
            _push(`<span class="${ssrRenderClass(i <= Math.round(unref(appInfo).foundApps.ios.rating) ? "text-yellow-400" : "text-gray-300")}">\u2B50</span>`);
          });
          _push(`<!--]--></div><span class="font-semibold text-lg">${ssrInterpolate(unref(appInfo).foundApps.ios.rating.toFixed(1))}</span>`);
          if (unref(appInfo).foundApps.ios.ratingCount) {
            _push(`<span class="text-gray-500 text-sm">(${ssrInterpolate(formatNumber(unref(appInfo).foundApps.ios.ratingCount))})</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if ((_l = (_k = (_j = unref(appInfo)) == null ? void 0 : _j.foundApps) == null ? void 0 : _k.android) == null ? void 0 : _l.rating) {
          _push(`<div class="flex items-center space-x-3"><div class="flex items-center space-x-1"><span class="text-sm font-medium text-green-600 w-12">Android</span><div class="flex items-center"><!--[-->`);
          ssrRenderList(5, (i) => {
            _push(`<span class="${ssrRenderClass(i <= Math.round(unref(appInfo).foundApps.android.rating) ? "text-yellow-400" : "text-gray-300")}">\u2B50</span>`);
          });
          _push(`<!--]--></div><span class="font-semibold text-lg">${ssrInterpolate(unref(appInfo).foundApps.android.rating.toFixed(1))}</span>`);
          if (unref(appInfo).foundApps.android.ratingCount) {
            _push(`<span class="text-gray-500 text-sm">(${ssrInterpolate(formatNumber(unref(appInfo).foundApps.android.ratingCount))})</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if ((_m = unref(primaryAppInfo)) == null ? void 0 : _m.price) {
          _push(`<div class="flex items-center"><span class="text-green-600 font-medium">${ssrInterpolate(unref(primaryAppInfo).price)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="flex flex-col space-y-2">`);
        if ((_o = (_n = unref(appInfo)) == null ? void 0 : _n.foundApps) == null ? void 0 : _o.ios) {
          _push(`<span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full text-center"> iOS App Store </span>`);
        } else {
          _push(`<!---->`);
        }
        if ((_q = (_p = unref(appInfo)) == null ? void 0 : _p.foundApps) == null ? void 0 : _q.android) {
          _push(`<span class="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full text-center"> Google Play </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div><div class="grid grid-cols-1 md:grid-cols-4 gap-6"><div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center"><div class="text-2xl mb-2">\u{1F4C4}</div><div class="text-2xl font-bold text-gray-900">${ssrInterpolate(unref(reviewData).totalReviews)}</div><div class="text-sm text-gray-600">Total Reviews</div></div><div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center"><div class="text-2xl mb-2">\u2B50</div><div class="text-2xl font-bold text-gray-900">${ssrInterpolate(unref(averageRating))}</div><div class="text-sm text-gray-600">Average Rating</div></div><div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center"><div class="text-2xl mb-2">\u{1F49A}</div><div class="text-2xl font-bold text-gray-900">${ssrInterpolate(unref(sentimentPercentage).positive)}%</div><div class="text-sm text-gray-600">Positive Sentiment</div></div><div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center"><div class="text-2xl mb-2">\u{1F4F1}</div><div class="text-2xl font-bold text-gray-900">${ssrInterpolate(unref(platformSplit))}</div><div class="text-sm text-gray-600">iOS/Android Split</div></div></div><div class="bg-white rounded-lg shadow-md p-6 border border-gray-200"><h3 class="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3><div class="space-y-3"><!--[-->`);
        ssrRenderList(unref(reviewData).summary.ratingDistribution, (count, rating) => {
          _push(`<div class="flex items-center"><span class="w-12 text-sm font-medium">${ssrInterpolate(rating)} \u2B50</span><div class="flex-1 bg-gray-200 rounded-full h-4 mx-3"><div class="bg-blue-600 h-4 rounded-full transition-all duration-500" style="${ssrRenderStyle({ width: count / unref(reviewData).totalReviews * 100 + "%" })}"></div></div><span class="w-12 text-sm text-gray-600">${ssrInterpolate(count)}</span></div>`);
        });
        _push(`<!--]--></div></div><div class="bg-white rounded-lg shadow-md p-6 border border-gray-200"><h3 class="text-lg font-semibold text-gray-900 mb-4">Sentiment Analysis</h3><div class="grid grid-cols-3 gap-4"><div class="text-center"><div class="text-3xl mb-2">\u{1F60A}</div><div class="text-xl font-bold text-green-600">${ssrInterpolate(unref(reviewData).summary.sentimentDistribution.positive)}</div><div class="text-sm text-gray-600">Positive</div></div><div class="text-center"><div class="text-3xl mb-2">\u{1F610}</div><div class="text-xl font-bold text-yellow-600">${ssrInterpolate(unref(reviewData).summary.sentimentDistribution.neutral)}</div><div class="text-sm text-gray-600">Neutral</div></div><div class="text-center"><div class="text-3xl mb-2">\u{1F61E}</div><div class="text-xl font-bold text-red-600">${ssrInterpolate(unref(reviewData).summary.sentimentDistribution.negative)}</div><div class="text-sm text-gray-600">Negative</div></div></div></div><div class="bg-white rounded-lg shadow-md p-6 border border-gray-200"><h3 class="text-lg font-semibold text-gray-900 mb-6">Recent Reviews</h3><div class="space-y-4"><!--[-->`);
        ssrRenderList(unref(recentReviews), (review, index) => {
          _push(`<div class="border border-gray-200 rounded-lg p-4"><div class="flex items-start justify-between mb-2"><div class="flex items-center space-x-2"><div class="flex items-center"><!--[-->`);
          ssrRenderList(5, (i) => {
            _push(`<span class="${ssrRenderClass(i <= review.rating ? "text-yellow-400" : "text-gray-300")}">\u2B50</span>`);
          });
          _push(`<!--]--></div><span class="text-sm text-gray-600">${ssrInterpolate(formatDate(review.date))}</span><span class="${ssrRenderClass([
            "px-2 py-1 text-xs rounded-full",
            review.source === "ios" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
          ])}">${ssrInterpolate(review.source === "ios" ? "iOS" : "Android")}</span><span class="${ssrRenderClass([
            "px-2 py-1 text-xs rounded-full",
            review.sentiment === "positive" ? "bg-green-100 text-green-800" : review.sentiment === "negative" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
          ])}">${ssrInterpolate(review.sentiment)}</span></div></div>`);
          if (review.title) {
            _push(`<h4 class="font-medium text-gray-900 mb-2">${ssrInterpolate(review.title)}</h4>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<p class="text-gray-700 text-sm leading-relaxed">${ssrInterpolate(review.content)}</p></div>`);
        });
        _push(`<!--]--></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-D7VfPRwc.mjs.map
