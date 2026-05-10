# RepoLens Architecture

RepoLens uses a split frontend/backend architecture.

## Backend Flow

1. Validate and parse a GitHub repository URL.
2. Fetch repository metadata, README, dependency manifests, and a filtered tree using the GitHub REST API.
3. Select important source files while ignoring generated and vendor folders.
4. Detect technologies from manifests, filenames, and folder conventions.
5. Build a compact AI prompt optimized for repository comprehension.
6. Request structured JSON analysis from Google Gemini through `backend/src/services/geminiService.js`.
7. Return normalized data to the frontend.

## Frontend Flow

1. User enters a repository URL in the top search bar.
2. The app submits the URL to the backend analysis endpoint.
3. Loading panels preview the final workspace layout.
4. Successful analysis renders folder explanations, summaries, setup guidance, features, suggestions, repository stats, and scoring.
5. Users can export the report as a JSON document.
