# DESIGN.md

## Overview

We want the design to use more round curves rather than squary, sharp boxes. The app should follow a consistent color scheme that does not stand out too much. It uses cream as a background color, with a deep warm pink as the main color and a bright pink as the complementary (side) color.

The app should be very intuitive and especially aesthetic. When the user swipes right to accept a restaurant, there is feedback to confirm the action—such as a subtle but noticeable green flash on the borders. This feedback should not be so strong that it disturbs the experience. A similar red feedback is shown for rejection. These visual cues can be accompanied by haptics.

---

## Color Scheme

- Main: #873535
- Complementary: #ea3d77
- Background: #fffbed

---

## Logo Design

The logo features the words “FOOD TINDER” in bold, rounded typography, arranged in two lines.

- “FOOD” appears on the top line in a deep brown (main color), using thick, playful letterforms.
- “TINDER” appears below in a bright pink (complementary color), matching the overall vibrant and fun theme.

Behind the text is a stylized flame or droplet shape, split into two overlapping colors:
- Bright pink on the left  
- Dark brown on the right  

This shape visually resembles both a flame and a sauce drop, symbolizing heat, flavor, and food passion.

Above the letter “F” in “FOOD” sits a small chef’s hat icon outlined in dark red, reinforcing the culinary focus of the brand. Small decorative accents near the hat add a playful, hand-drawn feel.

The background is a light cream/off-white, providing strong contrast and keeping the logo clean and friendly. Overall, the logo combines food culture, warmth, and a playful swipe-style dating concept, visually aligning with an app or platform that helps people discover and match with restaurants.

---

## Card Design

The swipe card is designed as a vertical, mobile-first layout inspired by swipe-based decision interfaces. Each card represents a single restaurant and contains key information needed to make a quick accept or reject decision.

The user should also be able to click a see more option where he should be able to see individual reviews(doesn't have to be real, can just genereate them with an LLM) and also a map widget for its location that can be made from ChatKit.studio Widget Builder

### Card Structure

- Image Section (Top):  
  A large image container displaying photos of the restaurant’s best menu items. This is the primary focal point and helps users make an immediate, intuitive judgment based on food appeal.

- Restaurant Details (Below Image):
  - Restaurant Name: Displayed prominently (e.g., *Joe’s Coffee*).
  - Operating Hours: Clearly listed opening and closing times (e.g., *Open: 8:30, Closed: 10:00*).
  - Rating Section: Positioned on the right, referencing external reviews (e.g., Google ratings), shown using star icons and a numerical score.

- AI Review Summary:  
  A brief, AI-generated summary of customer reviews that condenses common feedback into a short, readable paragraph. This allows users to quickly understand the restaurant’s strengths without reading full reviews.

### Swipe Interactions

- Swipe Right: Accept or like the restaurant.
- Swipe Left: Reject or skip the restaurant.