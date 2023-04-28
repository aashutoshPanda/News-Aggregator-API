import { getNews } from "../services/news.js";
/**
 * @desc mark the given news id as read for the current user
 */
export const markNewsAsRead = async (req, res) => {};

/**
 * @desc mark the given news id as favourite for the current user
 */
export const markNewsAsFavourite = async (req, res) => {};

/**
 * @desc get all the news which have been marked as read by the current user
 */
export const getReadNews = async (req, res) => {};

/**
 * @desc get all the news which have been marked as favourite by the current user
 */
export const getFavouriteNews = async (req, res) => {};

/**
 * @desc search the 3rd party API for a keyword and return the news fetched
 */
export const getNewsByKeyword = async (req, res) => {};

/**
 * @desc Get all the news as per the user preferences
 */
export const getNewsByUserPreferences = async (req, res) => {
  const preferences = req.user.preferences;
  if (!preferences) {
    res.status(400).send({
      message: "Set at least one preference",
    });
  }
  const promises = preferences.map((preference) => getNews(preference));
  const newsByPreferenceArray = await Promise.all(promises);
  res.send(newsByPreferenceArray);
};
