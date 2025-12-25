# PLAN.md

## Goal
Ship a working demo on Vercel that demonstrates group-first decision making for dining.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Realtime: Supabase Realtime (or Ably)
- Deployment: Vercel

## MVP Strategy
- No login
- Can easily make and join lobby with 6 digit numeric code
- No database persistence beyond session
- Focus on decision flow, not restaurant accuracy
- Mock restaurant data acceptable
- Easy browsing of restraunts with Tinder like swiping mechanism

## Build Order
1. App scaffold + layout
2. Session creation & join
3. Preference input UI
4. Aggregation logic
5. Consensus detection
6. Swipe animations
7. Group chat
8. Final selection screen
9. Docs rendering
10. Vercel deploy

##Documentation
Document everything throughout the whole process
Frequently let us know of the progress and status
Create a documentation file explaining each file of code and each function and what it does and how to use it to make it easy to use

## Out of Scope
- Authentication
- Payments
- History
