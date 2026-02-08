You are working in my Next.js App Router project (trevo.lk). I’m getting:
“TypeError: categories.map is not a function”.

Goal: fix it permanently.

Steps:
1) Find every place where the UI does categories.map(...).
2) Ensure categories is always an array before mapping.
   - If categories comes from props, API, react-hook-form Controller, or DB query, normalize it.
   - Support these possible shapes:
     a) categories: string[]
     b) categories: { id: string; name: string }[]
     c) response: { categories: ... }
     d) categories is a comma-separated string like "Music, Sports"
     e) categories is null/undefined
3) Implement a single normalization helper:
   - function normalizeCategories(input): Category[]
   - returns [] if invalid
   - if string, split by comma and trim
   - if object with categories field, normalize that field
   - if array of strings, convert to objects { id: value, name: value }
   - if array of objects, keep as-is (ensure it has name)
4) Update the component to use:
   const categoryList = normalizeCategories(categories)
   then render:
   categoryList.map(...)
5) Add defensive UI:
   - If categoryList.length === 0 show “No categories yet” (small muted text)
6) Add minimal TypeScript types and runtime guards (Array.isArray).
7) Do NOT change feature behavior; only prevent crashes and keep rendering stable.

Output: show the exact updated code diff for the file(s) you changed.
