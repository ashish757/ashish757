# Animation System Documentation

This document explains the scroll-based animation system used in the portfolio, specifically focusing on the **Projects Section (Phase 2)** and the transition to the **Contact Section (Phase 3)**.

All configuration values are stored in `constants.js`.

## 1. Core Concept: Scroll Phases

The animation logic is driven by the user's vertical scroll position (`window.scrollY`). The page height is artificially extended (via CSS `height: 450vh`) to allow for a long "scroll track" without actually moving down a traditional document flow.

The scroll timeline is divided into **Phases**:

*   **Phase 1 (0px - 250px):** Hero section fades out, blobs grow.
*   **Phase 2 (250px - 2500px):** The "Projects" section enters, pins in place, scrolls its internal cards, and then exits.
*   **Phase 3 (2500px+):** The "Contact" section reveals itself.

---

## 2. Phase 2: Projects Section Animation

This is the most complex phase. It maps the scroll range (250px to 2500px) to a 0.0 - 1.0 progress value (`sectionProgress`).

### A. Total Duration (The "Scroll Gap")
**Variable:** `SCROLL_PHASE_2_END` (currently `2500`)
*   **What it does:** Defines the total amount of scrolling pixels required to complete the entire project animation.
*   **How to adjust:**
    *   **Make it Slower:** Increase this value (e.g., to `3000`). This spreads the animation over more pixels, requiring more scrolling from the user.
    *   **Make it Faster:** Decrease this value.

### B. Internal Timeline
The 0.0 - 1.0 progress is split into three sub-stages:

1.  **Entry (Slide In)**
    *   **Range:** 0.0 to `PROJECT_ENTRY_THRESHOLD` (0.15 or 15%).
    *   **Behavior:** The entire project container slides in from the bottom (`120vh` to `0vh`).
    *   **Speed Control:** To make it enter *faster* (require less scroll), decrease `PROJECT_ENTRY_THRESHOLD`.

2.  **Pinned (Card Scrolling)**
    *   **Range:** `PROJECT_ENTRY_THRESHOLD` (15%) to `PROJECT_EXIT_THRESHOLD` (95%).
    *   **Behavior:** The container is "pinned" (fixed) on screen. As you scroll, the *internal* cards move upwards.
    *   **Card Speed:** Controlled by `PROJECT_FINAL_SCROLL_VH` (currently `-130`).
        *   This value represents how far up (in viewport height) the cards will move by the end of this sub-stage.
        *   **To scroll cards faster:** Make this number more negative (e.g., `-150`).
        *   **To scroll cards slower:** Make this number less negative (e.g., `-100`).

3.  **Exit (Slide Out)**
    *   **Range:** `PROJECT_EXIT_THRESHOLD` (95%) to 1.0 (100%).
    *   **Behavior:** The entire container slides up and fades out (`0vh` to `-100vh`).
    *   **Speed Control:** To make it exit *later* (stay pinned longer), increase `PROJECT_EXIT_THRESHOLD` (e.g., to `0.98`).

---

## 3. Phase 3: Contact Transition (The "Sub Gap")

**Scenario:** "I see a sub gap... even after phase 2 has exited... phase 3 comes up by time."

This "gap" is the transition between the Project section leaving and the Contact section appearing.

### Factors Affecting the Gap:

1.  **Exit Timing:**
    The Project section finishes exiting exactly when `scrollY` hits `SCROLL_PHASE_2_END` (2500px). At this exact pixel, the Project section is fully off-screen (-100vh).

2.  **Reveal Timing:**
    The Contact section *starts* revealing exactly when `scrollY > SCROLL_PHASE_2_END`.

3.  **Reveal Speed:**
    **Variable:** `CONTACT_REVEAL_SCROLL_DISTANCE` (currently `150`).
    *   This determines how many pixels you must scroll *after* Phase 2 ends for the Contact section to reach full opacity.
    *   **Current Behavior:** It takes 150px of scrolling (from 2500px to 2650px) to fade the contact section from 0% to 100%.
    *   **To reduce the gap:** Decrease `CONTACT_REVEAL_SCROLL_DISTANCE` (e.g., to `50`). This makes the contact section appear almost instantly.

### Why it feels like a gap:
Because the Project section is moving *up* and away, and the Contact section is fading *in* in place, there is a brief moment where the Project is mostly gone but the Contact isn't fully visible yet.

---

## 4. Summary of Controls (Cheat Sheet)

| Goal | Variable to Change in `constants.js` | Action |
| :--- | :--- | :--- |
| **Make the whole Project section scroll slower** | `SCROLL_PHASE_2_END` | **Increase** (e.g., 2500 -> 3000) |
| **Make the Project cards move up faster** | `PROJECT_FINAL_SCROLL_VH` | **Decrease** (e.g., -130 -> -150) |
| **Make the Project cards move up higher** | `PROJECT_FINAL_SCROLL_VH` | **Decrease** (e.g., -130 -> -150) |
| **Delay the Project section exit** | `PROJECT_EXIT_THRESHOLD` | **Increase** (e.g., 0.95 -> 0.98) |
| **Make Contact section appear sooner/faster** | `CONTACT_REVEAL_SCROLL_DISTANCE` | **Decrease** (e.g., 150 -> 50) |
