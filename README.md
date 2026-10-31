# 📚 Computational Linguistic & Sentiment Analysis of Jane Austen’s _Pride and Prejudice_

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Pandas](https://img.shields.io/badge/Pandas-Data%20Analysis-orange.svg)](https://pandas.pydata.org/)
[![NLTK & VADER](https://img.shields.io/badge/NLP-VADER%20%26%20TextBlob-green.svg)](https://www.nltk.org/)
[![NetworkX](https://img.shields.io/badge/NetworkX-Interaction%20Graphs-purple.svg)](https://networkx.org/)
[![Status](https://img.shields.io/badge/Status-Completed%20Successfully-success.svg)](<>)

An end-to-end computational linguistics study analyzing the macro narrative arcs, character interaction dynamics, spoken dialogue politeness structures, and emotional volatility of Jane Austen’s 1813 masterpiece, _Pride and Prejudice_ (Project Gutenberg eBook #1342).

---

## 📌 Project Overview & Objectives

Literary analysis traditionally relies on qualitative close reading. This project bridges qualitative literature and quantitative data science by building a **9-phase computational pipeline** that parses, tokenizes, scores, and visualizes the emotional and structural anatomy of a classic 19th-century novel.

### Key Research Questions:

1. **Macro Narrative Arc:** Does _Pride and Prejudice_ follow Kurt Vonnegut’s classic "Man in Hole" or "Cinderella" narrative trajectory?
2. **Spoken Dialogue vs. Prose:** Do Regency-era characters speak with more polite, positive emotional valence than the third-person narrator describes in prose?
3. **Character Dynamics:** How do sentiment and interaction frequencies shift between primary characters (e.g., Elizabeth & Darcy vs. Elizabeth & Wickham) across narrative acts?
4. **Model Alignment:** How reliably do rule-based lexicons (VADER) align with pattern-based sentiment engines (TextBlob) on 19th-century prose?

---

## ⚙️ Methodology & Pipeline Architecture

The project was executed across 9 rigorous phases in a Google Colab environment, with all datasets and visual artifacts permanently persisted to a dedicated Google Drive research directory (`/content/drive/MyDrive/Pride_Prejudice_Research`).

| Phase       | Core Focus                      | Key Techniques & Tools                                       | Output Artifacts                              |
| :---------- | :------------------------------ | :----------------------------------------------------------- | :-------------------------------------------- |
| **Phase 1** | Ingestion & Cleaning            | RegEx header scrubbing, Roman numeral splitting              | `pride_and_prejudice_chapters.csv`            |
| **Phase 2** | Tokenization & Scoring          | NLTK sentence tokenization, VADER & TextBlob                 | `pride_and_prejudice_sentences_sentiment.csv` |
| **Phase 3** | Macro Narrative Arc             | Rolling moving averages (window = 5 chapters)                | `pride_prejudice_narrative_arc.png`           |
| **Phase 4** | Character Entity Analysis       | Regex alias mapping, act-based sentiment segmentation        | `character_network_graph.png`                 |
| **Phase 5** | Co-occurrence Networks          | NetworkX graph modeling, shared sentence sentiment           | `character_cooccurrence_heatmap.png`          |
| **Phase 6** | Dialogue vs. Prose Segmentation | Quote extraction (`["“]`), dual component VADER scoring      | `dialogue_vs_prose_distribution.png`          |
| **Phase 7** | Volatility & Event Detection    | Standard deviation ($\sigma$) calculation, milestone mapping | `narrative_event_volatility.png`              |
| **Phase 8** | Lexicon Validation              | Pearson/Spearman correlation, confusion matrices             | `vader_vs_textblob_regression.png`            |
| **Phase 9** | Synthesis & Dashboard           | Multi-panel summary matrices, artifact manifests             | `master_research_dashboard.png`               |

---

## 📊 Key Findings & Insights

### 1. The Spoken Politeness Delta (Dialogue vs. Narrative Prose)

When comparing dialogue (text inside quotation marks) against third-person narrative prose, a striking social phenomenon emerged:

- **Mean Spoken Dialogue Sentiment:** Significantly more positive, driven by Regency social etiquette, pleasantries, and polite discourse.
- **Mean Narrative Prose Sentiment:** Leaner and more neutral-to-critical, reflecting the narrator's ironic social commentary and objective framing.

### 2. Emotional Volatility & Climax Detection

By calculating chapter-level standard deviation ($\sigma$) of sentence sentiment, major dramatic turning points were flagged algorithmically without manual annotation:

- **Chapter 34 (Darcy’s First Proposal at Hunsford):** Exhibited extreme emotional turbulence due to the violent shift from polite rejection to intense confrontation.
- **Chapter 46 (Discovery of Lydia’s Elopement):** Marked a sharp negative sentiment spike and high variance as family panic unfolded.

### 3. Lexicon Validation

- **Pearson Correlation ($r$):** Demonstrated strong positive statistical alignment between VADER and TextBlob at the chapter level ($r > 0.70$), proving robust cross-model agreement despite VADER’s structural advantage in handling punctuation and capitalization intensity.

---

## 🖼️ Visual Artifact Gallery

Here is a preview of the core visualizations generated during the research:

- **Master Research Dashboard:** Consolidated 4-panel view of narrative arcs, volatility, dialogue distributions, and lexicon regressions.
- **Character Interaction Network:** Graph layout displaying mention volume (node size), co-occurrence frequency (edge width), and emotional tone (edge color: Red for conflict, Blue for harmony).
- **Dialogue vs. Prose Density Curves:** KDE curves demonstrating the emotional shift between spoken words and narrative exposition.

_(Note: All high-resolution `.png` plots and `.csv` datasets are safely archived in the project's Google Drive storage manifest)._

---

## 💻 Code Highlight: Dialogue vs. Prose Extractor

Here is a sample of the core regular expression logic used in Phase 6 to segment direct speech from narrative exposition:

```python
import re

def extract_dialogue_and_prose(text):
    """
    Extracts spoken dialogue (inside quotation marks) and narrative prose.
    Handles standard double quotes and curved/smart quotes (“ ”).
    """
    quote_pattern = r'["“]([^"”]+)["”]'

    dialogues = re.findall(quote_pattern, text)
    narrative_prose = re.sub(quote_pattern, '', text).strip()
    dialogue_combined = " ".join(dialogues) if dialogues else ""

    return dialogue_combined, narrative_prose
```
