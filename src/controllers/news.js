import { getNews } from "../services/news.js";
import { User, News } from "../models/index.js";
/**
 * @desc mark the given news id as read for the current user
 */
export const markNewsAsRead = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // assuming you're using some kind of authentication middleware to add the user object to the request object
    const news = await News.findById(req.params.id);

    // Check if news already exists in the user's read list
    if (user.read.includes(news._id)) {
      return res.status(400).json({ message: "News already added to read list" });
    }

    // Add news to user's read list
    user.read.push(news._id);
    await user.save();

    res.json({ message: "News added to read list" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc mark the given news id as favourite for the current user
 */
export const markNewsAsFavourite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // assuming you're using some kind of authentication middleware to add the user object to the request object
    const news = await News.findById(req.params.id);

    // Check if news already exists in the user's favourites list
    if (user.favourites.includes(news._id)) {
      return res.status(400).json({ message: "News already added to favourites list" });
    }

    // Add news to user's favourites list
    user.favourites.push(news._id);
    await user.save();

    res.json({ message: "News added to favourites list" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc get all the news which have been marked as read by the current user
 */
export const getReadNews = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("read", "title description url publishedAt");

    res.json({ news: user.read });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc get all the news which have been marked as favourite by the current user
 */
export const getFavouriteNews = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favourites", "title description url publishedAt");

    res.json({ news: user.favourites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc search the 3rd party API for a keyword and return the news fetched
 */
export const getNewsByKeyword = async (req, res) => {
  try {
    const { keyword } = req.params;
    const response = await fetch(`https://newsapi.org/v2/top-headlines?q=${keyword}&apiKey=${process.env.NEW_API_KEY}`);
    const responseJSON = await response.json();
    const articles = responseJSON.articles;
    console.log({ keyword, articles });
    return res.status(200).send(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

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
