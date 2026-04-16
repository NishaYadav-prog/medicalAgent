export const rankArticles = (articles, query, disease) => {
  if (!articles || articles.length === 0) return [];

  const keywords = (query + " " + disease).toLowerCase().split(" ");

  const scored = articles.map((article) => {
    let score = 0;

    const text = (article.title + " " + article.abstract).toLowerCase();

    // 🔹 Relevance Score (keyword match)
    keywords.forEach((word) => {
      if (text.includes(word)) {
        score += 2;
      }
    });

    // 🔹 Recency Score
    if (article.year) {
      const currentYear = new Date().getFullYear();
      const diff = currentYear - article.year;

      if (diff <= 1) score += 3;
      else if (diff <= 3) score += 2;
      else if (diff <= 5) score += 1;
    }

    // 🔹 Source Credibility
    if (article.source === "PubMed") score += 3;
    if (article.source === "OpenAlex") score += 2;

    return { ...article, score };
  });

  // 🔥 Sort by score (descending)
  scored.sort((a, b) => b.score - a.score);

  return scored;
};
