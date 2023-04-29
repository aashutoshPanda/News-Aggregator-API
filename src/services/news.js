const queryAPI = async (preference) => {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?category=${preference}&apiKey=${process.env.NEW_API_KEY}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getNews = async (preference) => {
  const apiResults = await queryAPI(preference);

  return { preference, news: apiResults.articles };
};
