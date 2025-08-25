This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

# How's it work?

Static Site Generation, baby.

Notes to self:
- We have to use the Page Router instead of the App Router
- We have to use `output: 'export'` in `next.config.ts`
- We have to use `import { InferGetStaticPropsType } from "next";` to put data into a page at compile time
- We *could* use dynamic pages with static generation, which would be good for each blog post in a new tab

# Blog Format

- Images go in `public/blogdata/images`
- Blog entries go in `public/blogdata/entries`
    - First line is the title
    - Second line is the City Name (Must match the name of a city in `public/blogdata/CITIES.json`)
    - Third line is Date (YYYY-MM-DD)
    - Fourth line blank
    - All other content (paragraphs, images, headers) must be separated by "\n\n"
        - Paragraphs: just write text (can be multiline)
        - Image: `[<image name>]`
        - Header: Line must start with `# ` (there is a space after that pound sign)

# How to Test

All commands run in root directory of project.

1. Start Blog Parser with `python main.py` (must have `flask` installed with `pip install flask`)
1. Build Static Site with `npm run build` (after this step you can kill the Blog Parser)
1. Run a file server to serve up the static files with `python -m http.server -d ./out`
1. Open [http://localhost:8000](http://localhost:8000) with your browser to see the result.

