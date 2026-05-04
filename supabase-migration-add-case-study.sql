-- Migration: Add case_study column to projects table
-- Date: 2026-01-14
-- Description: Adds a JSONB column to store case study data for projects

-- Add case_study column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS case_study JSONB DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN projects.case_study IS 'Stores detailed case study information including summary, client, timeframe, challenge, objectives, strategy, deliverables, role, results, learnings, and what to show';

-- Example case study structure:
-- {
--   "oneLineSummary": "Brief project summary",
--   "client": "Client name",
--   "timeframe": "Project duration",
--   "context": "Project background",
--   "challenge": "Main challenge faced",
--   "objectives": ["Objective 1", "Objective 2"],
--   "strategyTitle": "Strategy heading",
--   "strategyDescription": "How we approached it",
--   "whatWeDid": [{"category": "Category", "items": ["Item 1", "Item 2"]}],
--   "deliverables": "What was delivered",
--   "role": "Your role",
--   "responsibilities": "Your responsibilities",
--   "resultsIntro": "Results introduction",
--   "resultsMetrics": [{"label": "Metric", "value": "Value"}],
--   "resultsDetails": ["Result 1", "Result 2"],
--   "whatMadeItWork": ["Success factor 1", "Success factor 2"],
--   "learnings": ["Learning 1", "Learning 2"],
--   "whatToShow": ["Highlight 1", "Highlight 2"],
--   "source": "Source attribution"
-- }
