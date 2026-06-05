// Wait until the HTML document is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Toggle the 'active' class when the hamburger is clicked
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Fire off the gallery loading function cleanly inside the DOM loop
    loadDynamicGallery();
});

// Function to load gallery items directly from your production data file
async function loadDynamicGallery() {
    const galleryGrid = document.querySelector('.gallery-grid'); 
    if (!galleryGrid) return; 

    try {
        // Fetch the unified database file created by Decap CMS
        const response = await fetch('/data/gallery.json');
        if (!response.ok) throw new Error("Failed to fetch gallery data file");
        
        const galleryData = await response.json();
        
        // Clear out any loading indicators or placeholders
        galleryGrid.innerHTML = '';

        // Loop through the array of items saved inside your gallery file
        if (galleryData && galleryData.items) {
            galleryData.items.forEach(projectData => {
                
                // 1. Create the outer div wrapper with your exact class name
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';

                // 2. Inject your original HTML architecture exactly as you designed it
                galleryItem.innerHTML = `
                    <img src="${projectData.image}" alt="${projectData.description || projectData.title}">
                    <div class="item-info">
                        <h4>${projectData.title}</h4>
                        <p>${projectData.category || ''}</p>
                    </div>
                `;

                // 3. Append directly into your CSS layout grid
                galleryGrid.appendChild(galleryItem);
            });
        }
    } catch (error) {
        console.error("Error loading dynamic gallery items:", error);
        galleryGrid.innerHTML = `<p style="text-align:center; width:100%;">Give us a moment, we're pulling the latest custom pieces into the gallery...</p>`;
    }
}