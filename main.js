
const handleScrollAnimation = (callback) => {
    let ticking = false;

    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                callback({
                    scrollY: window.scrollY,
                    innerHeight: window.innerHeight,
                    innerWidth: window.innerWidth
                });
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll);
    
    // Trigger once on load to set initial state
    onScroll();
};

document.addEventListener('DOMContentLoaded', () => {
    const layerUnifiedGrid = document.querySelector('.layer-unified-grid');
    const gridPattern = document.querySelector('.grid-pattern'); // Select grid pattern
    const interactiveGridOverlay = document.querySelector('.interactive-grid-overlay');
    const contactContentGrid = document.querySelector('.contact-content-grid');
    const layerContact = document.querySelector('.layer-contact');
    const layerBlobs = document.querySelector('.layer-blobs');
    const heroInfo = document.querySelector('.info');

    const nav = document.querySelector('nav');
    const homeMenu = document.querySelector('.nav-link .item-home');
    const contactMenu = document.querySelector('.nav-link .item-contact');
    const projectsMenu = document.querySelector('.nav-link .item-projects');
    const blobSlider = document.querySelector('.blob-slider');

    const bgGrid = document.querySelectorAll('.bg-grid');

    // Adjust scroll spacer height based on animation constants
    const scrollSpacer = document.querySelector('.scroll-spacer');
    if (scrollSpacer) {
        // Add some buffer (e.g. 50vh) to the end of the last phase
        const requiredHeight = SCROLL_PHASE_3_REVEAL_END + (window.innerHeight * 0.1); 
        scrollSpacer.style.height = `${requiredHeight}px`;
    }
    
    // Generate Interactive Grid Cells
    if (interactiveGridOverlay) {
        const cols = 20;
        const rows = 20;
        
        interactiveGridOverlay.style.gridTemplateColumns = `repeat(${cols}, 120px)`;
        interactiveGridOverlay.style.gridTemplateRows = `repeat(${rows}, 120px)`;
        
        for (let i = 0; i < cols * rows; i++) {
            const cell = document.createElement('div');
            cell.classList.add('interactive-cell');
            interactiveGridOverlay.appendChild(cell);
        }
    }
    
    // const slotTop = document.querySelector('.slot-top');
    // const slotBottom = document.querySelector('.slot-bottom');
    // const slotLeft = document.querySelector('.slot-left');
    // const slotRight = document.querySelector('.slot-right');

    if (layerBlobs || heroInfo) {
        handleScrollAnimation(({ scrollY }) => {
            
            // Phased Scaling Logic
            // Phase 1 (0-250px): Hero Text Fades Out, Blobs Grow
            // Phase 2 (250-1500px): Projects Placeholder Fades In/Out
            // Phase 3 (1500px+): Grid Expands, Contact Grid Reveals

            const bgSizex = 0 + (scrollY * 0.02) -1;
            const bgSizey = 0 + (scrollY * 0.02) -2;
            console.log("BG SIZES ", bgSizex, bgSizey); 

            const phase1 = SCROLL_PHASE_1_END;
            const phase2 = SCROLL_PHASE_2_END; 
            const phase3RevealEnd = SCROLL_PHASE_3_REVEAL_END; 
            
            let blobScale = BLOB_SCALE_BASE;
            let blobFilter = 'none';
            
            // Grid Scale Logic:
            // Start bigger (0.6) -> Grow to 0.75 in Phase 2 -> Grow to 1.0 in Phase 3
            let gridScale = GRID_SCALE_BASE; 
            let isPhase3 = false; // Track phase 3 state
            const navLeft = nav.getBoundingClientRect().left;
            
            // --- Phase 1: Blobs Grow ---
            if (scrollY < phase1) {
                const homeMenuRect = homeMenu.getBoundingClientRect();
                blobSlider.style.left = `${homeMenuRect.left -navLeft}px`;
                blobSlider.style.width = `${homeMenuRect.width}px`;
                homeMenu.classList.add('active');
                projectsMenu.classList.remove('active');
                contactMenu.classList.remove('active');


                const progress = scrollY / phase1;
                blobScale = BLOB_SCALE_BASE + (BLOB_SCALE_GROWTH_PHASE_1 * progress);
                
                gridScale = GRID_SCALE_BASE + (progress * GRID_SCALE_GROWTH_PHASE_1);
            } 
            else if (scrollY < phase2) {
                const projectMenuRect = projectsMenu.getBoundingClientRect();
                blobSlider.style.left = `${projectMenuRect.left -navLeft}px`;
                blobSlider.style.width = `${projectMenuRect.width}px`;
                homeMenu.classList.remove('active');
                projectsMenu.classList.add('active');
                contactMenu.classList.remove('active');

                bgGrid.forEach(grid => {
                    grid.style.backgroundSize = `${bgSizex}px ${bgSizey}px`;
                });

                blobScale = BLOB_SCALE_PHASE_2;
                blobFilter = `brightness(1.1) drop-shadow(0 0 ${BLOB_DROP_SHADOW_INTENSITY * ((scrollY - phase1)/BLOB_DROP_SHADOW_SCROLL_FACTOR)}px rgba(37, 99, 235, 0.3))`;
                
                gridScale = GRID_SCALE_PHASE_2;
            } 
            // --- Phase 3: Grid grows & Contact ---
            else {
                isPhase3 = true; 
                const contactMenuRect = contactMenu.getBoundingClientRect();
                blobSlider.style.left = `${contactMenuRect.left -navLeft}px`;
                blobSlider.style.width = `${contactMenuRect.width}px`;
                homeMenu.classList.remove('active');
                projectsMenu.classList.remove('active');
                contactMenu.classList.add('active');
                
                    const progress = (scrollY - phase2) / (phase3RevealEnd - phase2);
                    blobScale = BLOB_SCALE_PHASE_2 + (BLOB_SCALE_GROWTH_PHASE_3 * progress);
                    blobFilter = 'brightness(1.1) drop-shadow(0 0 10px rgba(37, 99, 235, 0.3))';
                    
                    // Resume growth from 0.65 to 1.0
                    gridScale = GRID_SCALE_PHASE_2 + (progress * GRID_SCALE_GROWTH_PHASE_3); 
                
            }

            if (layerBlobs) {
                layerBlobs.style.transform = `translate(-50%, -50%) scale(${blobScale})`;
                layerBlobs.style.filter = blobFilter;
            }

            if (layerUnifiedGrid) {
                layerUnifiedGrid.style.transform = `translate(-50%, -50%) scale(${gridScale})`;
            }

            if (layerContact) {
                layerContact.style.transform = `translate(-50%, -50%) scale(${gridScale})`;
            }
            
            // make grid lines darker in phase 3
            if (gridPattern) {
                if (isPhase3) {
                    gridPattern.classList.add('active');
                } else {
                    gridPattern.classList.remove('active');
                }
            }

            // Hero Text Scale Down & Fade
            if (heroInfo) {
                const textBaseScale = 1;
                const decayRate = HERO_TEXT_DECAY_RATE; 
                const textNewScale = Math.max(0.8, textBaseScale - (scrollY * HERO_TEXT_SCALE_RATE));
                const newOpacity = Math.max(0, 1 - (scrollY * decayRate));
                
                heroInfo.style.transform = `scale(${textNewScale})`;
                heroInfo.style.opacity = newOpacity;
                heroInfo.style.pointerEvents = newOpacity <= 0 ? 'none' : 'auto';
            }

            // --- Phase 2: Projects Animation (Scroll Up Effect) ---
            const layerProjects = document.querySelector('.layer-projects-placeholder');
            const projectsWrapper = document.querySelector('.cards-scroll-wrapper');
            
            if (layerProjects) {
                let projOpacity = 0;
                let projTranslateY = PROJECT_INITIAL_OFFSET_VH; // Start further off-screen (120vh)
                let cardsTranslateY = 0;

                if (scrollY > phase1 && scrollY < phase2) {
                    const sectionProgress = (scrollY - phase1) / (phase2 - phase1);
                    
                    
                    if (sectionProgress < PROJECT_ENTRY_THRESHOLD) {
                        // Entering
                        const enterProgress = sectionProgress / PROJECT_ENTRY_THRESHOLD;
                        projTranslateY = PROJECT_INITIAL_OFFSET_VH * (1 - enterProgress);
                        projOpacity = 1;
                        cardsTranslateY = 0;
                    } else if (sectionProgress > PROJECT_EXIT_THRESHOLD) {
                        // Exiting
                        const exitProgress = (sectionProgress - PROJECT_EXIT_THRESHOLD) / PROJECT_EXIT_DURATION;
                        projTranslateY = -100 * exitProgress;
                        projOpacity = 1 - exitProgress;
                        // Keep cards at final scroll position
                        cardsTranslateY = PROJECT_FINAL_SCROLL_VH; 
                    } else {
                        // Pinned Phase (Scrolling Cards)
                        projTranslateY = 0;
                        projOpacity = 1;
                        
                        const scrollProgress = (sectionProgress - PROJECT_ENTRY_THRESHOLD) / PROJECT_SCROLL_DURATION;
                        cardsTranslateY = PROJECT_FINAL_SCROLL_VH * scrollProgress;
                    }
                } else if (scrollY >= phase2) {
                    // Fully exited
                    projTranslateY = -100;
                    projOpacity = 0;
                } else {
                    // Not started
                    projTranslateY = PROJECT_INITIAL_OFFSET_VH;
                    projOpacity = 0;
                }

                layerProjects.style.opacity = projOpacity;
                layerProjects.style.transform = `translate(-50%, calc(-50% + ${projTranslateY}vh))`;
                layerProjects.style.pointerEvents = projOpacity > 0.5 ? 'auto' : 'none';
                
                if (projectsWrapper) {
                    projectsWrapper.style.transform = `translateY(${cardsTranslateY}vh)`;
                }
            }

            // --- Phase 3: Contact Content Reveal ---
            if (contactContentGrid) {
                let contactOpacity = 0;

                if (scrollY > phase2) {
                    const progress = (scrollY - phase2) / CONTACT_REVEAL_SCROLL_DISTANCE; // Reveal twice as fast
                    contactOpacity = Math.min(1, progress);
                }

                contactContentGrid.style.opacity = contactOpacity;
                contactContentGrid.style.pointerEvents = contactOpacity > 0.8 ? 'auto' : 'none';
            }
        });
    }

    // Navigation Link Handling
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetScroll = parseInt(link.getAttribute('data-target'));
            
            window.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });
        });
    });

    // Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        body.setAttribute('data-theme', 'dark');
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
});


const img = document.querySelectorAll('.project-gallery img, .header-gallery img');
const modal = document.querySelector('#img-modal');
const modalImg = modal.querySelector('img');

// Helper to close modal
const closeModal = () => {
    modal.classList.remove('active');
    modalImg.classList.remove('mobile'); // Reset classes
    document.body.style.overflow = ''; // Restore scrolling
};

img.forEach((image) => {
    image.addEventListener('click', () => {
        const src = image.getAttribute('src');
        modalImg.setAttribute('src', src);
        // modalImg.className = 'mobile'; // Reset classes
        if(image.classList.contains('mobile')){
            modalImg.classList.add('mobile');
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Block scrolling
    });
});

// Close when clicking outside the image
modal.addEventListener('click', (e) => {
        closeModal();
});

// Close on Escape key
window.addEventListener('keydown', (event) => {
    if (event.key === "Escape" && modal.classList.contains('active')) {
        closeModal();
    }
});