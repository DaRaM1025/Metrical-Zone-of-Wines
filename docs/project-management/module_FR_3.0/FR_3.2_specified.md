# Functional Requirement Specification

---

## Metadata

| Field            | Value                        |
|------------------|------------------------------|
| **ID**           | FR3-02                       |
| **Module**       | Wine Page — Reviews          |
| **Version**      | 1.0                          |
| **Status**       | Draft                        |
| **Date**         | 2026-03-21                   |
| **Author**       | David Ramirez                |
| **Reviewed by**  |                              |

---

## Description

**Statement:**
> The wine dashboard must display the reviews made to that specific wine, allowing the user to explore them and filter them by reviewer type.

**Involved Actor:**
Common consumer user or expert who is on a wine's dashboard. No authentication is required.

---

## Conditions

**Precondition:**
- The user is on a wine's dashboard.
- There are reviews of the wine stored in MongoDB.

**Postcondition:**
The user views the wine's reviews filtered according to the selected criteria. Read-only operation — no data is modified.

---

## Acceptance Criteria

### Reviews listing
- [ ] **AC1:** The listing of reviews made to the wine is displayed — it does not include reviews of the vineyard to which it belongs.
- [ ] **AC2:** Each amateur review shows: reviewer name, overall score (scale 0–100), experience description, consumption occasion, and recommendation indicator.
- [ ] **AC3:** Each expert or organization review shows: reviewer name, occupation, organization, years of experience, overall score (scale 0–100), review year, dimension scores (color, aroma, flavor, finish, structure), tasting notes, and suggested pairing.
- [ ] **AC4:** The listing is presented ordered by date descending by default (most recent first).

### Reviews filtering
- [ ] **AC5:** The user can filter the reviews by reviewer type: amateur, expert, or organization.
- [ ] **AC6:** The user can filter the reviews by overall score range, selecting a predefined option ordered from highest to lowest.
- [ ] **AC7:** The user can apply multiple filters simultaneously.
- [ ] **AC8:** The user can clear all filters with a single action, restoring the complete listing.

### General behavior
- [ ] **AC9:** If the wine has no registered reviews, an indicative message is displayed and an invitation to create the first review.
- [ ] **AC10:** The listing updates when applying or removing filters without reloading the complete page.

---

## Priority

| Level  | Description                                      |
|--------|--------------------------------------------------|
| High   | Essential for MVP, blocks other functions        |
| Medium | Important but does not block the main flow       |
| Low    | Desirable, can be deferred to a future version   |

**Assigned Priority:** High — reviews are the core value of the application.

---

## Dependencies

- Depends on: `FR3-01` — Wine dashboard
- Is prerequisite of: `FR3-03` — Create wine review

---

## Notes and Change History

- Wine reviews and vineyard reviews are separate entities in MongoDB. This FR covers exclusively reviews whose subject is the wine (`wine_id`), never the vineyard.
- The dimension scores of the expert (color, aroma, flavor, finish, structure) are exclusive to wine reviews — they do not exist in vineyard reviews.
- The backend queries MongoDB filtering according to the active filters.

| Date      | Version | Author | Change Description |
|------------|---------|-------|------------------------|
| 2026-03-21 | 1.0     | David Ramirez | Document creation |