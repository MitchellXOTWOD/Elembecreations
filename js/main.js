// Wait until the HTML document is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Toggle the 'active' class when the hamburger is clicked
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
});

// Function to load gallery items directly from the GitHub repository data folder
async function loadDynamicGallery() {
    const galleryGrid = document.querySelector('.gallery-grid'); // Make sure this matches your CSS grid class
    if (!galleryGrid) return; // Only run this code if we are actually on the gallery page

    // Replace with your actual GitHub username and repository name
    const repoOwner = "MitchellXOTWOD";
    const repoName = "Elembecreations"; 
    const folderPath = "data/gallery";

    try {
        // 1. Fetch the list of all files inside the data/gallery folder from GitHub
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`);
        if (!response.ok) throw new Error("Failed to fetch gallery folder structure");
        
        const files = await response.json();
        
        // Clear out any placeholder hardcoded HTML items inside the grid
        galleryGrid.innerHTML = '';

        // 2. Loop through each file found in the folder
        for (const file of files) {
            if (file.name.endsWith('.json')) {
                const fileResponse = await fetch(file.download_url);
                const projectData = await fileResponse.json();

                // 1. Create the outer div wrapper with the exact class name
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';

                // 2. Inject the internal tags matching your original HTML architecture perfectly
                galleryItem.innerHTML = `
                    <img src="${projectData.image}" alt="${projectData.description || projectData.title}">
                    <div class="item-info">
                        <h4>${projectData.title}</h4>
                        <p>${projectData.description}</p>
                    </div>
                `;

                // 3. Append directly into the gallery-grid container
                galleryGrid.appendChild(galleryItem);
            }
        }
    } catch (error) {
        console.error("Error loading dynamic gallery items:", error);
        galleryGrid.innerHTML = `<p style="text-align:center; width:100%;">Give us a moment, we're pulling the latest custom pieces into the gallery...</p>`;
    }
}

// Fire off the function the absolute second the webpage loads up
document.addEventListener('DOMContentLoaded', loadDynamicGallery);