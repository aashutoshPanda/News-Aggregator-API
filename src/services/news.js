import crypto from "crypto";
import News from "../models/news.js";

const addHashToArticlesAndSave = async (articles) => {
  const promises = articles.map(async (article) => {
    const hash = crypto.createHash("md5").update(article.url).digest("hex");
    article.newsId = hash;
    const articleDB = await News.findOneAndUpdate(
      { urlHash: hash }, // search criteria
      article,
      { upsert: true, new: true } // options: create new document if not found
    );
  });
  await Promise.all(promises);
};
export const queryAPIByCategory = async (preference) => {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?category=${preference}&apiKey=${process.env.NEW_API_KEY}&pageSize=5`
    );
    const data = await response.json();
    addHashToArticlesAndSave(data.articles);
    return data;
  } catch (error) {
    console.error(error);
  }
};
export const queryAPIByKeyword = async (query) => {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${query}&apiKey=${process.env.NEW_API_KEY}&pageSize=5`
    );
    const data = await response.json();
    addHashToArticlesAndSave(data.articles);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getNewsByPreference = async (preference) => {
  const apiResults = await queryAPIByKeyword(preference);

  return { preference, news: apiResults.articles };
};

export const getNewsArticlesByPreference = (userPreference, articlesByPreferenceArray) => {
  const requiredData = articlesByPreferenceArray.filter(({ preference }) => preference == userPreference);
  if (requiredData) {
    return requiredData[0].news;
  }
};
export const getProperNewsJSON = (news) => {
  const newsJSON = news.toJSON();
  newsJSON.newsId = newsJSON.urlHash;
  delete newsJSON.urlHash;
  delete newsJSON._id;
  return newsJSON;
};
