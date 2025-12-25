# FoodTinder MVP Documentation

This document explains each custom file and each exported function/component.

## Root files
- `README.md`: Setup and usage instructions.
- `PRD.md` / `PROBLEM.md` / `SOLUTION.md` / `DESIGN.md`: Product specs and design rules used as source of truth.
- `AGENT.md`, `PLAN.md`, `TODO.md`: Project constraints, build order, and checklist.
- `package.json`: Project scripts and dependency list.
- `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`: Build tooling configuration.

## Data and scripts
- `src/data/restaurants.json`: Seed dataset with 30 restaurants.
- `public/data/DragonMasterData.json`: Primary swipe dataset loaded at runtime for cards and details.
- `public/data/README.md`: Instructions for adding Excel/CSV files.
- `scripts/excel-to-json.js`:
  - `inputPath` / `outputPath`: Resolve default paths for conversion.
  - `xlsx.readFile(...)`: Load Excel workbook from disk.
  - `xlsx.utils.sheet_to_json(...)`: Convert the first sheet into JSON rows.
  - `fs.writeFileSync(...)`: Write JSON output to `src/data/restaurants.json`.

## Global styles
- `src/app/globals.css`: Tailwind import plus app color tokens and typography variables.
- `src/app/layout.tsx`:
  - `RootLayout(...)`: Applies fonts, background, and wraps content in `PhoneFrame`.
  - `metadata`: App title and description for Next.js.

## Core pages (App Router)
- `src/app/page.tsx`:
  - `HomePage(...)`: Landing hero screen styled like the reference mock with CTA.
- `src/app/loading.tsx`:
  - `Loading(...)`: Global loading screen shown during route transitions.
- `src/app/create/page.tsx`:
  - `CreateSessionPage(...)`: Create a session, save to localStorage, and navigate to preferences.
  - `handleCreate(...)`: Generates session + host member via `createSession`.
- `src/app/join/page.tsx`:
  - `JoinSessionPage(...)`: Join an existing session by code.
  - `handleJoin(...)`: Adds member via `joinSession` and navigates to preferences.
- `src/app/preferences/page.tsx`:
  - `PreferencesPage(...)`: Capture preference inputs and save to localStorage.
  - `handleSave(...)`: Persists preference data and navigates to swipe.
- `src/app/swipe/page.tsx`:
  - `SwipePage(...)`: Shows swipe deck with optional chat toggle and DM button.
  - `handleSwipe(...)`: Persists a like/dislike per restaurant.
- `src/app/results/page.tsx`:
  - `ResultsPage(...)`: Aggregated ranking list and match highlights.
- `src/app/restaurants/page.tsx`:
  - `RestaurantsPage(...)`: Full restaurant list ("See more") screen.
- `src/app/restaurants/[id]/page.tsx`:
  - `RestaurantDetailPage(...)`: Restaurant details, menu sample, and map placeholder.
- `src/app/chat/page.tsx`:
  - `ChatPage(...)`: Dedicated group/DM chat screen.
- `src/app/admin/page.tsx`:
  - `AdminPage(...)`: Debug panel showing local session state.
- `src/app/docs/page.tsx`:
  - `loadDoc(...)`: Reads a markdown file from the repo root.
  - `DocsPage(...)`: Renders PRD/Problem/Solution/Design via `react-markdown`.

## Components
- `src/components/phone-frame.tsx`:
  - `PhoneFrame(...)`: Wraps screens in a rounded phone shell with a notch.
- `src/components/nav-bar.tsx`:
  - `NavBar(...)`: Header with optional back button and action slot.
- `src/components/member-list.tsx`:
  - `MemberList(...)`: Shows members and preference completion badges.
- `src/components/consensus-meter.tsx`:
  - `ConsensusMeter(...)`: Displays consensus percentage and decision readiness.
- `src/components/preference-form.tsx`:
  - `PreferenceForm(...)`: Compact preference UI with scales and vivid selection states.
  - `OptionRow(...)`: Single preference row with choice controls.
  - `ChoiceButton(...)`: Visual toggle for a preference state.
- `src/components/restaurant-card.tsx`:
  - `RestaurantCard(...)`: Swipe card content with image placeholder, details, and See more action.
- `src/components/restaurant-detail-sheet.tsx`:
  - `RestaurantDetailSheet(...)`: Bottom sheet modal that renders full restaurant details.
- `src/components/swipe-deck.tsx`:
  - `SwipeDeck(...)`: Maintains a 3-card stack, handles drag swipe gestures, and shifts cards after animation.
  - `handleSwipe(...)`: Triggers like/dislike and animates the top card off-screen.
- `src/components/chat-panel.tsx`:
  - `ChatPanel(...)`: Local chat with group/DM modes and polling.
  - `handleSend(...)`: Persists a group or direct message in localStorage.
- `src/components/result-list.tsx`:
  - `ResultList(...)`: Ranked list with like counts and member highlights.

## UI primitives (shadcn/ui style)
- `src/components/ui/button.tsx`:
  - `Button(...)`: Rounded button with variant/size styles.
- `src/components/ui/card.tsx`:
  - `Card(...)`, `CardHeader(...)`, `CardTitle(...)`, `CardContent(...)`, `CardFooter(...)`: Layout wrappers.
- `src/components/ui/badge.tsx`:
  - `Badge(...)`: Small pill label for tags or statuses.
- `src/components/ui/input.tsx`:
  - `Input(...)`: Rounded text input.
- `src/components/ui/textarea.tsx`:
  - `Textarea(...)`: Rounded multiline input.
- `src/components/ui/progress.tsx`:
  - `Progress(...)`, `ProgressIndicator(...)`: Simple progress bar.
- `src/components/ui/separator.tsx`:
  - `Separator(...)`: Horizontal divider.

## Lib utilities
- `src/lib/types.ts`: Type definitions and constant arrays for options.
- `src/lib/restaurant-data.ts`:
  - `normalizeRestaurant(...)`: Cleans raw JSON into a `Restaurant` model.
  - `normalizeHappyRestaurant(...)`: Normalizes fallback restaurant data for swipe/results.
  - `getOtherFields(...)`: Extracts non-core keys for See more.
- `src/lib/utils.ts`:
  - `cn(...)`: Tailwind class merge helper.
- `src/lib/preferences.ts`:
  - `createDefaultPreferences(...)`: Builds neutral preference object for a member.
  - `getNextMemberName(...)`: Suggests `User A/B/...` labels.
- `src/lib/storage.ts`:
  - `generateSessionCode(...)`: Creates a 6-digit session code.
  - `getCurrentSession(...)` / `setCurrentSession(...)`: Read/write current member context.
  - `getSession(...)` / `saveSession(...)`: Read/write session state to localStorage.
  - `createSession(...)`: Initializes a session with the host member.
  - `joinSession(...)`: Adds a member to an existing session.
  - `savePreferences(...)`: Persist member preferences.
  - `getSavedPreferencesByName(...)`: Load preferences saved for a nickname.
  - `savePreferencesForName(...)`: Save preferences by nickname.
  - `saveSwipe(...)`: Persist a member swipe per restaurant.
  - `addChatMessage(...)`: Append a message to session chat.
  - `addDirectMessage(...)`: Append a message to a direct-message thread.
- `src/lib/filters.ts`:
  - `filterRestaurants(...)`: Applies preference logic to filter restaurants.
- `src/lib/aggregation.ts`:
  - `aggregateResults(...)`: Computes like/dislike counts and match score.
  - `getConsensusStatus(...)`: Derives consensus percent and ready state.
