import axios from "axios";

export const fetchPubMedIDs = async (query) => {
  try {
    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi`;

    const response = await axios.get(url, {
      params: {
        db: "pubmed",
        term: query,
        retmax: 5, // abhi 20, baad me 100+ karenge
        sort: "pub+date",
        retmode: "json",
      },
    });

    const ids = response.data.esearchresult.idlist;

    return ids;
  } catch (error) {
    console.error("PubMed ID fetch error:", error.message);
    return [];
  }
};
export const fetchPubMedDetails = async (ids) => {
  try {
    if (!ids || ids.length === 0) return [];

    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi`;

    const response = await axios.get(url, {
      params: {
        db: "pubmed",
        id: ids.join(","),
        retmode: "xml",
      },
    });

    const xmlData = response.data;

    // Simple extraction (basic parsing)
    const articles = [];

    const regex = /<PubmedArticle>([\s\S]*?)<\/PubmedArticle>/g;
    let match;

    while ((match = regex.exec(xmlData)) !== null) {
      const articleXML = match[1];

      const titleMatch = articleXML.match(
        /<ArticleTitle>(.*?)<\/ArticleTitle>/,
      );
      const abstractMatch = articleXML.match(
        /<AbstractText.*?>(.*?)<\/AbstractText>/,
      );

      articles.push({
        title: titleMatch ? titleMatch[1] : "No title",
        abstract: abstractMatch ? abstractMatch[1] : "No abstract",
        source: "PubMed",
      });
    }

    return articles;
  } catch (error) {
    console.error("PubMed details fetch error:", error.message);
    return [];
  }
};
