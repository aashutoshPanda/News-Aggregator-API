import { getNewsByPreference, getProperNewsJSON, queryAPIByKeyword } from "../services/news.js";
import { User, News } from "../models/index.js";

/**
 * @desc mark the given news id as read for the current user
 */
export const markNewsAsRead = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // assuming you're using some kind of authentication middleware to add the user object to the request object
    const news = await News.findOne({ urlHash: req.params.id }).select("-__v");

    // no match found for the hash
    if (!news) {
      return res.status(404).json({ message: "Invalid news id passed" });
    }
    // Check if news already exists in the user's read list
    if (user.read.includes(news._id)) {
      return res.status(400).json({ message: "News already added to read list" });
    }

    // Add news to user's read list
    user.read.push(news._id);
    await user.save();

    const properNewsJSON = getProperNewsJSON(news);
    res.send(properNewsJSON);
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
    const news = await News.findOne({ urlHash: req.params.id }).select("-__v");

    // no match found for the hash
    if (!news) {
      return res.status(404).json({ message: "Invalid news id passed" });
    }
    // Check if news already exists in the user's favourites list
    // if (user.favourites.includes(news._id)) {
    //   return res.status(400).json({ message: "News already added to favourites list" });
    // }

    // Add news to user's favourites list
    user.favourites.push(news._id);
    await user.save();

    const properNewsJSON = getProperNewsJSON(news);
    res.send(properNewsJSON);
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
    const user = await User.findById(req.user.id).populate("read", "title description url publishedAt urlHash");
    const readNews = user.read.map((news) => getProperNewsJSON(news));
    res.send(readNews);
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
    const user = await User.findById(req.user.id).populate("favourites", "title description url publishedAt urlHash");

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
    const responseJSON = await queryAPIByKeyword(keyword);
    const articles = responseJSON.articles;

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
  try {
    const preferences = req.user.preferences;
    if (!preferences) {
      res.status(400).send({
        message: "Set at least one preference",
      });
    }
    // get news by querying the API
    const promises = preferences.map((preference) => getNewsByPreference(preference));

    // newsByPreferenceArray will have output like [
    // [
    //   {
    //     preference: "technology",
    //     articles: [{...}, {...}],
    //   },
    //   {
    //     preference: "entertainment",
    //     articles: [{...}, {...}],
    //   },
    // ];
    const newsByPreferenceArray = await Promise.all(promises);
    res.send(newsByPreferenceArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
