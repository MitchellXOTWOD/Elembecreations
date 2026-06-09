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
    // ◄ FIXED: Changed from .gallery-grid to #gallery-grid so it ignores the order page grid!
    const galleryGrid = document.getElementById('gallery-grid'); 
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

// Target the new bottom section on the order page
const orderProductsGrid = document.getElementById('order-products-grid');

if (orderProductsGrid) {
    loadOrderProducts();
}

async function loadOrderProducts() {
    try {
        // Fetch strictly from the separate orders data file
        const response = await fetch('/data/order_products.json'); // Added a leading slash to keep paths consistent
        if (!response.ok) throw new Error("Order product database file not initialized.");
        
        const data = await response.json();
        const products = data.items || [];

        // Clear any placeholder text
        orderProductsGrid.innerHTML = '';

        products.forEach(product => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';

            // Matches your gallery style architecture perfectly, adding the price property
            galleryItem.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <div class="item-info">
                    <h4>${product.title}</h4>
                    <span class="item-category" style="font-size: 0.85rem; color: #888; display: block; margin-bottom: 0.25rem;">${product.category}</span>
                    <p style="margin-bottom: 0.5rem;">${product.description || ''}</p>
                    <span class="item-price" style="font-weight: 600; color: #b38059;">${product.price}</span>
                </div>
            `;

            orderProductsGrid.appendChild(galleryItem);
        });

    } catch (error) {
        console.warn("Could not separate order content or local JSON file is missing:", error);
    }
}

// ==========================================
// LIGHTBOX MODAL FUNCTIONALITY
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-target-img');
    const closeBtn = document.querySelector('.modal-close');

    // Safety check to ensure the elements exist on the current page
    if (!modal || !modalImg) return;

    // 1. Listen for clicks on any image inside a gallery element
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.gallery-item') && e.target.tagName === 'IMG') {
            modal.style.display = 'flex';
            modalImg.src = e.target.src;
            modalImg.alt = e.target.alt;
            
            // Optional: Freeze page scrolling behind the modal overlay
            document.body.style.overflow = 'hidden';
        }
    });

    // 2. Close modal when clicking the 'X' button
    closeBtn.addEventListener('click', closeModal);

    // 3. Close modal when clicking anywhere on the dark background
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    function closeModal() {
        modal.style.display = 'none';
        modalImg.src = ''; // Clear image memory paths
        document.body.style.overflow = ''; // Restore scrolling layout
    }
});