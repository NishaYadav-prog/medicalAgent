import axios from "axios";

export const fetchOpenAlexData = async (query) => {
  try {
    const url = "https://api.openalex.org/works";

    const response = await axios.get(url, {
      params: {
        search: query,
        per_page: 20, // abhi 20, baad me 100+ karenge
      },
    });

    const results = response.data.results;

    const articles = results.map((item) => ({
      title: item.title || "No title",
      abstract: item.abstract_inverted_index
        ? Object.keys(item.abstract_inverted_index).join(" ")
        : "No abstract",
      authors:
        item.authorships?.map((a) => a.author.display_name).join(", ") ||
        "Unknown",
      year: item.publication_year,
      source: "OpenAlex",
      url: item.id,
    }));

    return articles;
  } catch (error) {
    console.error("OpenAlex fetch error:", error.message);
    return [];
  }
};
