# Deloitte Survey & Prompt Finder

A simple, Deloitte-branded, Typeform-style web app that collects form responses and shows filtered AI prompts based on user choices.

## Features

- Multi-step survey form (one question per page)
- Filters prompt library by "Offering" and "Task category"
- Displays matching prompts after submission
- Option to download filtered prompts as CSV or text file
- Deloitte-inspired color palette and styling
- No backend required—works as a static site

## How to Use

1. **Clone or upload all files** (`index.html`, `style.css`, `main.js`) to a folder/repository on GitHub.

2. (Optional) To make it public, enable GitHub Pages:
    - Go to your repo’s **Settings** → **Pages**
    - Choose branch: `main` (or `master`), folder: `/root`
    - Visit the URL shown to see your live site!

3. **To update the questions or prompts:**
    - Edit the JavaScript arrays in `main.js`:
      - `surveyQuestions` for questions
      - `promptLibrary` for prompt data (copy more rows from your CSV)

## Customization

- To add/remove questions, edit the `surveyQuestions` array in `main.js`.
- To update prompts, edit the `promptLibrary` array.
- For more prompts, convert your CSV rows to objects like:
  ```js
  {
    offering: "Strategy",
    task_category: "Brainstorm",
    prompt: "Your prompt text here."
  }
  ```
- For more styling, adjust `style.css`.

## Support

If you have questions, open an issue or ask your assistant for help!# Survey-Test
