import { d as defineEventHandler, r as readBody, c as createError } from '../../nitro/nitro.mjs';
import gplay from 'google-play-scraper';
import store from 'app-store-scraper';
import Sentiment from 'sentiment';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const sentiment = new Sentiment();
function analyzeSentiment(text) {
  const result = sentiment.analyze(text);
  if (result.score > 1) return "positive";
  if (result.score < -1) return "negative";
  return "neutral";
}
async function findAppIds(appName) {
  const result = {};
  try {
    const iosResults = await store.search({
      term: appName,
      num: 5,
      country: "us"
    });
    if (iosResults && iosResults.length > 0) {
      const exactMatch = iosResults.find(
        (app) => app.title.toLowerCase().includes(appName.toLowerCase()) || appName.toLowerCase().includes(app.title.toLowerCase())
      );
      const selectedApp = exactMatch || iosResults[0];
      try {
        const appDetails = await store.app({ id: selectedApp.id.toString() });
        result.ios = {
          id: selectedApp.id.toString(),
          name: selectedApp.title,
          rating: appDetails.score,
          ratingCount: appDetails.reviews,
          icon: selectedApp.icon,
          developer: selectedApp.developer,
          price: selectedApp.price || "Free"
        };
      } catch (detailError) {
        result.ios = {
          id: selectedApp.id.toString(),
          name: selectedApp.title,
          rating: selectedApp.score,
          icon: selectedApp.icon,
          developer: selectedApp.developer,
          price: selectedApp.price || "Free"
        };
      }
    }
  } catch (error) {
    console.warn("iOS search failed:", error);
  }
  try {
    const androidResults = await gplay.search({
      term: appName,
      num: 5,
      country: "us",
      lang: "en"
    });
    if (androidResults && androidResults.length > 0) {
      const exactMatch = androidResults.find(
        (app) => app.title.toLowerCase().includes(appName.toLowerCase()) || appName.toLowerCase().includes(app.title.toLowerCase())
      );
      const selectedApp = exactMatch || androidResults[0];
      try {
        const appDetails = await gplay.app({ appId: selectedApp.appId });
        result.android = {
          id: selectedApp.appId,
          name: selectedApp.title,
          rating: appDetails.score,
          ratingCount: appDetails.reviews,
          icon: selectedApp.icon,
          developer: selectedApp.developer,
          price: selectedApp.priceText || "Free"
        };
      } catch (detailError) {
        result.android = {
          id: selectedApp.appId,
          name: selectedApp.title,
          rating: selectedApp.score,
          icon: selectedApp.icon,
          developer: selectedApp.developer,
          price: selectedApp.priceText || "Free"
        };
      }
    }
  } catch (error) {
    console.warn("Android search failed:", error);
  }
  return result;
}
async function fetchIOSReviews(appId, limit = 50) {
  try {
    const reviews = await store.reviews({
      id: appId,
      sort: store.sort.RECENT,
      page: 1,
      country: "us"
    });
    return reviews.slice(0, limit).map((review) => ({
      rating: review.score,
      date: review.date,
      title: review.title || "",
      content: review.text || "",
      sentiment: analyzeSentiment(review.text || ""),
      source: "ios"
    }));
  } catch (error) {
    console.error("Failed to fetch iOS reviews:", error);
    return [];
  }
}
async function fetchAndroidReviews(appId, limit = 50) {
  try {
    const reviews = await gplay.reviews({
      appId,
      sort: gplay.sort.NEWEST,
      num: limit,
      country: "us",
      lang: "en"
    });
    return reviews.data.map((review) => ({
      rating: review.score,
      date: review.date,
      title: review.title || "",
      content: review.text || "",
      sentiment: analyzeSentiment(review.text || ""),
      source: "android"
    }));
  } catch (error) {
    console.error("Failed to fetch Android reviews:", error);
    return [];
  }
}
const reviews_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { appName } = body;
    if (!appName || typeof appName !== "string") {
      throw createError({
        statusCode: 400,
        statusMessage: "App name is required"
      });
    }
    const appIds = await findAppIds(appName.trim());
    if (!appIds.ios && !appIds.android) {
      throw createError({
        statusCode: 404,
        statusMessage: `No apps found for "${appName}"`
      });
    }
    const reviewPromises = [];
    if (appIds.ios) {
      reviewPromises.push(fetchIOSReviews(appIds.ios.id));
    }
    if (appIds.android) {
      reviewPromises.push(fetchAndroidReviews(appIds.android.id));
    }
    const reviewResults = await Promise.all(reviewPromises);
    const allReviews = reviewResults.flat();
    allReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const limitedReviews = allReviews.slice(0, 100);
    return {
      success: true,
      appInfo: {
        searchTerm: appName,
        foundApps: appIds
      },
      reviews: limitedReviews,
      totalReviews: limitedReviews.length,
      summary: {
        ios: limitedReviews.filter((r) => r.source === "ios").length,
        android: limitedReviews.filter((r) => r.source === "android").length,
        sentimentDistribution: {
          positive: limitedReviews.filter((r) => r.sentiment === "positive").length,
          neutral: limitedReviews.filter((r) => r.sentiment === "neutral").length,
          negative: limitedReviews.filter((r) => r.sentiment === "negative").length
        },
        ratingDistribution: {
          5: limitedReviews.filter((r) => r.rating === 5).length,
          4: limitedReviews.filter((r) => r.rating === 4).length,
          3: limitedReviews.filter((r) => r.rating === 3).length,
          2: limitedReviews.filter((r) => r.rating === 2).length,
          1: limitedReviews.filter((r) => r.rating === 1).length
        }
      }
    };
  } catch (error) {
    console.error("API Error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Failed to fetch reviews"
    });
  }
});

export { reviews_post as default };
//# sourceMappingURL=reviews.post.mjs.map
