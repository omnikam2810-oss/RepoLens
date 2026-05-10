# RepoLens Backend

Express API that fetches public GitHub repository data, filters important files, detects technologies, and uses Google Gemini to generate structured repository analysis.

## Scripts

- `npm run dev` - Start development server.
- `npm start` - Start production server.
- `npm run check` - Syntax-check the main server files.
- `npm run test:gemini` - Verify Gemini API key, client initialization, and response generation.

## Environment

Store secrets only in `backend/.env`.

```env
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
```

## Endpoints

- `GET /api/health` - API health check.
- `POST /api/analyze` - Analyze a public GitHub repository.

Request body:

```json
{
  "repositoryUrl": "https://github.com/owner/repo",
  "mode": "standard"
}
```
