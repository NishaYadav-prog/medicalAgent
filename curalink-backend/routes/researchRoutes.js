import express from "express";
import { expandQuery } from "../utils/queryExpander.js";
import {
  fetchPubMedIDs,
  fetchPubMedDetails,
} from "../services/pubmedService.js";
import { fetchOpenAlexData } from "../services/openAlexService.js";
import { fetchClinicalTrials } from "../services/clinicalTrialsService.js";
import { rankArticles } from "../services/rankingService.js";
import { generateAIResponse } from "../services/llmService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { disease, query } = req.body;

    // 1️⃣ Query Expansion
    const expandedQueries = expandQuery(disease, query);

    let allArticles = [];

    for (let q of expandedQueries.slice(0, 2)) {
      const ids = await fetchPubMedIDs(q);
      const pubmedArticles = await fetchPubMedDetails(ids);
      const openAlexArticles = await fetchOpenAlexData(q);

      allArticles.push(...pubmedArticles, ...openAlexArticles);
    }

    // 2️⃣ Ranking
    const rankedArticles = rankArticles(allArticles, query, disease);

    // 3️⃣ Clinical Trials
    const trials = await fetchClinicalTrials(disease);

    // 4️⃣ LLM Response 🔥
    const aiResponse = await generateAIResponse(
      disease,
      query,
      rankedArticles.slice(0, 5),
      trials.slice(0, 3),
    );

    res.json({
      original: { disease, query },
      aiResponse,
      articles: rankedArticles.slice(0, 8),
      clinicalTrials: trials.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
