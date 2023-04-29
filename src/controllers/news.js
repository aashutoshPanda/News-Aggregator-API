import { getNews, getNewsArticlesByPreference } from "../services/news.js";
import { User, News, Category } from "../models/index.js";

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

    res.json(news);
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

    res.json(news);
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
    const user = await User.findById(req.user.id).populate("read", "title description url publishedAt category");

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
    const promises = preferences.map((preference) => getNews(preference));

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

    // Storing the articles received in DB
    const promisesStoreNewsArticlesAndCategoriesInDB = preferences.map(async (preference) => {
      // check if this category is present or not, if not make one
      let category = await Category.findOne({ name: preference });
      if (!category) {
        category = new Category({
          name: preference,
        });
        await category.save();
      }
      // Now we have our category, so the articles fetched for this category will be added to it
      const articlesOfCurrentPreference = getNewsArticlesByPreference(preference, newsByPreferenceArray);
      const promisesStoreNewsArticlesinDB = articlesOfCurrentPreference.map(async (article) => {
        const { url, content, publishedAt, author, title } = article;
        let newsMongoObj = await News.findOne({ url });
        if (!newsMongoObj) {
          newsMongoObj = new News({
            url,
            content,
            publishedAt,
            author,
            title,
          });
          await newsMongoObj.save();
        }
        // Now we have the news item from the DB, we will put the correct category here
        if (newsMongoObj.category && !preference in newsMongoObj.category) {
          await newsMongoObj.addCategory(preference);
        }
        return newsMongoObj;
      });
      const resultsPromisesStoreNewsArticlesinDB = await Promise.all(promisesStoreNewsArticlesinDB);
      return { preference, articles: resultsPromisesStoreNewsArticlesinDB };
    });
    const resultsPromisesStoreNewsArticlesInDB = await Promise.all(promisesStoreNewsArticlesAndCategoriesInDB);
    res.send(resultsPromisesStoreNewsArticlesInDB);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
