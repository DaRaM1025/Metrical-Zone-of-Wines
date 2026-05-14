# Functional Requirement Specification

---

## Metadata

| Field            | Value                        |
|------------------|------------------------------|
| **ID**           | FR3-01                       |
| **Module**       | Wine Page — Dashboard        |
| **Version**      | 1.0                          |
| **Status**       | Draft                        |
| **Date**         | 2026-03-21                   |
| **Author**       | David Ramirez                |
| **Reviewed by**  |                              |

---

## Description

**Statement:**
> The web application must display a dashboard with the complete information and metrics of each wine, satisfying both the needs of an amateur user and those of an expert critic.

**Involved Actor:**
Common consumer user or expert who accesses the wine dashboard from the wine listing of a vineyard (`FR2-02`) or from the general wine listing (`FR1-05`). No authentication is required.

---

## Conditions

**Precondition:**
- The selected wine exists in the system with its registered data.
- Calculated metrics are available for the wine.

**Postcondition:**
The user views the complete wine dashboard with its information and most recent metrics. Read-only operation — no data is modified.

---

## Acceptance Criteria

### Context information
- [ ] **AC1:** The name of the vineyard to which the wine belongs is displayed, as a direct link to its dashboard (`FR2-01`).
- [ ] **AC2:** The region and country of origin of the wine are displayed, derived from the vineyard to which it belongs.

### Basic wine information
- [ ] **AC3:** The wine label image is displayed, if available.
- [ ] **AC4:** The wine name, type, harvest year, and general description are displayed.
- [ ] **AC5:** The alcohol content and whether the wine is of natural production are displayed.
- [ ] **AC6:** The grape varieties of the wine are displayed with their composition percentage.

### Production information
- [ ] **AC7:** The average price in USD and its range category are displayed.
- [ ] **AC8:** The production volume in bottles is displayed.
- [ ] **AC9:** The aging months and the type of container used are displayed.

### Tasting information
- [ ] **AC10:** The wine's tasting notes are displayed.
- [ ] **AC11:** The wine's pairing suggestions are displayed.

### Performance metrics
- [ ] **AC12:** The overall average score, from amateurs and from experts, is displayed comparatively.
- [ ] **AC13:** The best score recorded for the wine is displayed.
- [ ] **AC14:** The total number of reviews received is displayed.
- [ ] **AC15:** The count of medals obtained is displayed, differentiated by type: gold, silver, and bronze.
- [ ] **AC16:** The prestige index of the wine is displayed in its level scale: `Emerging`, `Recognized`, `Acclaimed` or `Legendary`.
- [ ] **AC17:** The position of the wine in the ranking within its vineyard and within its country is displayed.

### General behavior
- [ ] **AC18:** All metric values correspond to the most recent record available in `wine_metrics`.
- [ ] **AC19:** If no calculated metrics exist for the wine, an indicator of insufficient data is displayed instead of empty values or errors.

---

## Priority

| Level  | Description                                      |
|--------|--------------------------------------------------|
| High   | Essential for MVP, blocks other functions        |
| Medium | Important but does not block the main flow       |
| Low    | Desirable, can be deferred to a future version   |

**Assigned Priority:** High — it is the central detail view of the wine catalog and prerequisite for creating reviews.

---


## Dependencies

- Depends on: `FR2-02` — Vineyard wine listing
- Depends on: `FR1-05` — Wine filtering *(alternative access)*
- Is prerequisite of: `FR3-02` — Wine reviews
- Is prerequisite of: `FR3-03` — Create wine review

---

## Notes and Change History

- The ranking position (AC17) is a value calculated by the backend at the time of building the response — it is not stored in `wine_metrics` but is derived by comparing the `avg_score` of the wine against the other wines of the same vineyard and country.
- `prestige_index` follows the same scale defined globally: `Emerging`, `Recognized`, `Acclaimed`, `Legendary`.

| Date      | Version | Author | Change Description |
|------------|---------|-------|------------------------|
| 2026-03-21 | 1.0     | David Ramirez | Document creation |