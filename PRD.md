# PRD.md
## FoodTinder(Temporary Name)

---

## Overview

GroupEats is a **mobile-first group dining decision platform** that helps groups of friends quickly and fairly decide where to eat together. 

Unlike existing food discovery apps that optimize for individuals, GroupEats treats the **group as the primary decision-making unit**.  
The product enables **silent preference input**, **real-time aggregation**, and **explicit consensus detection**.

The core goal is to eliminate awkward discussions, power imbalance, and indecision in group dining situations.

---

## Goals

- Enable fast group dining decisions without verbal negotiation
- Ensure fairness and equal participation among group members
- Reduce decision fatigue and social friction
- Make group consensus visible and actionable

---

## Non-Goals

- User accounts, profiles, or long-term personalization
- Reviews, ratings, or editorial food content
- Reservations, payments, or food ordering
- Social feeds, follower graphs, or history tracking
- Solo dining or individual recommendation optimization

---

## Audience

### Primary Users

- Groups of friends
- Students and young professionals
- Social groups meeting:
  - After class
  - After work
  - On weekends or spontaneously

These users value speed, fairness, and low effort.  
They want to avoid being the “decider” and prefer silent, frictionless coordination.

### Secondary Stakeholders

- Restaurants seeking higher-quality group traffic
- Food discovery platforms (potential future partners)

---

## Existing Solutions and Issues

Current solutions fail to support **group decision coordination**:

- **Map-based food discovery apps**
  - Individual-centric rankings
  - One person controls the decision
  - No concept of group consensus

- **Food delivery apps**
  - Optimized for ordering, not in-person dining
  - Assume a single decision-maker

- **Verbal group discussion**
  - Social pressure suppresses honest preferences
  - Dominant personalities skew outcomes
  - Slow and uncomfortable

---

## Assumptions

- Group dining decisions are time-sensitive
- Individuals often suppress strong preferences to avoid conflict
- Groups value fairness nearly as much as speed
- Silent input reduces social pressure
- Most groups only need a “good enough for everyone” option

---

## Constraints

- Mobile-first experience
- Short, time-bounded sessions
- Real-time, synchronous group participation
- No single controlling user
- Initial restaurant data sourced from external APIs (e.g. Google Places)

---

## Key Use Cases

- Deciding where to eat after class or work
- Coordinating preferences among 3–6 people
- Making spontaneous dining decisions in unfamiliar areas
- Avoiding repeated visits to the same familiar places

---

## Use Case 1: Group Creation

Users need a fast way to initiate a temporary decision session.

- Create a group session
- Optional group name
- Generate a shareable link or QR code
- No account required

---

## Use Case 2: Group Joining

Participants join the session with minimal friction.

- Join via link or QR code
- No login required
- Anonymous identifiers (User A, B, C…)

---

## Use Case 3: Silent Preference Input

Each participant submits preferences independently.

- Private and invisible to others
- No verbal justification required
- Skipping allowed

### MVP Preference Categories

- Cuisine type
- Budget range
- Distance / walkability
- Optional spice tolerance

### Input Format

- Yes / No / Neutral

---

## Use Case 4: Real-Time Aggregation

The system aggregates preferences continuously.

- Eliminate options violating shared constraints
- Update group state as inputs arrive
- Surface viable overlap zones

---

## Use Case 5: Consensus Detection

The system detects when agreement is sufficient.

- Trigger a **“Decision Ready”** state based on:
  - Aggregated agreement score
  - Number of remaining viable options
- No explicit voting required

---

## Use Case 6: Recommendation Display

- Show only 2–3 final candidates
- No ranked long lists
- No exposure of individual preferences

---

## Use Case 7: Final Selection

- Any participant can confirm the final choice
- No designated leader
- Session ends after confirmation
- Users navigate externally (e.g. map app)

---

## Success Metrics (MVP)

- Average decision time ≤ 1 minute
- ≥ 80% of group members submit preferences
- ≥ 70% of sessions reach “Decision Ready” state
- Low abandonment rate after preference input

---

## Risks & Open Questions

- How to scale consensus detection for large groups (6+)?
- How to handle partial participation?
- Optimal threshold for “Decision Ready” detection?
- What happens when no overlap exists?

---

## Key Differentiator

GroupEats is **not a recommendation app**.

It is a **decision coordination tool**.

By reframing food choice as a **collective coordination problem**, GroupEats creates a new category of group-first experiences.

The best part about this app is that it has a very Intuitive UI where people join the lobby like in kahoot and they can swipe left or right on the restraunts after they set the restraints.

There is also a groupchat for friends to disscuss.
---

## Future Extensions (Post-MVP)

- Reusable group history
- Smart defaults based on past group behavior
- Restaurant-side group promotions
- Expansion to other group decisions (cafes, activities, events)"