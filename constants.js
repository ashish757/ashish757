/**
 * Animation and Scroll Constants
 */

const isMobile = window.innerWidth <= 768;

// Scroll Phases (in pixels)
const SCROLL_PHASE_1_END = 250;
const SCROLL_PHASE_2_END = 2500;
const SCROLL_PHASE_3_REVEAL_END = 2700;

// Project Section Animation Thresholds (0.0 to 1.0 relative to Phase 2 duration)
const PROJECT_ENTRY_THRESHOLD = 0.15;
const PROJECT_EXIT_THRESHOLD = 0.98;

// Derived Ranges
const PROJECT_SCROLL_DURATION = PROJECT_EXIT_THRESHOLD - PROJECT_ENTRY_THRESHOLD; 
const PROJECT_EXIT_DURATION = 1.0 - PROJECT_EXIT_THRESHOLD; 

// Project Visual Constants
const PROJECT_INITIAL_OFFSET_VH = 100;
const PROJECT_FINAL_SCROLL_VH = isMobile ? -180 : -130;

// Contact Section
const CONTACT_REVEAL_SCROLL_DISTANCE = isMobile ? 150 : 100;

// Hero Text Animation
const HERO_TEXT_DECAY_RATE = 0.0035;
const HERO_TEXT_SCALE_RATE = 0.001;

// Blob & Grid Scaling
const BLOB_SCALE_BASE = 1;
const BLOB_SCALE_GROWTH_PHASE_1 = 0.2;
const GRID_SCALE_BASE = 0.6;
const GRID_SCALE_GROWTH_PHASE_1 = 0.05;

const BLOB_SCALE_PHASE_2 = 1.2;
const GRID_SCALE_PHASE_2 = 0.65; // 0.6 + 0.05

const BLOB_SCALE_GROWTH_PHASE_3 = 0.3;
const GRID_SCALE_GROWTH_PHASE_3 = 0.35;

const BLOB_DROP_SHADOW_INTENSITY = 10;
const BLOB_DROP_SHADOW_SCROLL_FACTOR = 300;
