// Function to track a product view and store the viewed product in local storage
function trackView(productId) {
    // Retrieve the list of recently viewed products from local storage or initialize as an empty array
    let recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

    // If the product hasn't already been viewed, add it to the list
    if (!recentlyViewed.includes(productId)) {
        recentlyViewed.push(productId);

        // Limit to the 10 most recent products viewed
        if (recentlyViewed.length > 10) recentlyViewed.shift();

        // Save the updated list back to local storage
        localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
    }
}

// Function to generate personalized product recommendations based on viewed products
function getRecommendations() {
    let recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    let recommendations = [];  // Array to store recommended products
    let seasonal = seasonalRecommendations(); // Get seasonal recommendations

    // Loop through each viewed product to find recommendations based on category, tags, or price
    recentlyViewed.forEach(viewedId => {
        let viewedProduct = products.find(product => product.id === viewedId);

        // If the product exists, recommend products based on category, tags, or similar price range
        if (viewedProduct) {
            recommendations = recommendations.concat(products.filter(product => {
                return product.id !== viewedId && // Don't recommend the same product
                    (product.category === viewedProduct.category ||
                        product.tags.some(tag => viewedProduct.tags.includes(tag)) ||
                        (Math.abs(product.price - viewedProduct.price) <= 50)); // Price range match
            }));
        }
    });

    // Combine seasonal and personalized recommendations, remove duplicates
    recommendations = [...new Set(recommendations.concat(seasonal))];

    // Limit recommendations to 5 items to avoid overload
    return recommendations.slice(0, 5);
}

// Function to generate seasonal recommendations based on the current month
function seasonalRecommendations() {
    const today = new Date(); // Get the current date
    const month = today.getMonth(); // Get the current month (0-11)

    let seasonProducts = [];

    // Define seasonal ranges by month
    if (month >= 2 && month <= 4) { // Spring: March (2) to May (4)
        seasonProducts = products.filter(product => product.category === "Fashion" || product.tags.includes("spring"));
    } else if (month >= 5 && month <= 7) { // Summer: June (5) to August (7)
        seasonProducts = products.filter(product => product.category === "Fashion" || product.tags.includes("summer"));
    } else if (month >= 8 && month <= 10) { // Fall: September (8) to November (10)
        seasonProducts = products.filter(product => product.category === "Fashion" || product.tags.includes("fall"));
    } else { // Winter: December (11) to February (1)
        seasonProducts = products.filter(product => product.category === "Fashion" || product.tags.includes("winter"));
    }

    // Limit to 5 seasonal products
    return seasonProducts.slice(0, 5);
}

// Function to dynamically display the recommendations in the HTML
function displayRecommendations() {
    const recommendations = getRecommendations(); // Get the recommended products
    const recommendationsDiv = document.getElementById("recommendations"); // Get the recommendations div

    // Clear existing content
    recommendationsDiv.innerHTML = "";

    // If no recommendations exist, display a message
    if (recommendations.length === 0) {
        recommendationsDiv.innerHTML = "<p>No recommendations available. Please browse more products!</p>";
        return;
    }

    // Loop through each recommended product and generate the HTML
    recommendations.forEach(product => {
        // Create elements dynamically to avoid direct innerHTML manipulation
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        const productImage = document.createElement("img");
        productImage.src = product.image;
        productImage.alt = product.name;
        productImage.style.width = "100px";
        productImage.style.height = "100px";
        productCard.appendChild(productImage);

        const productName = document.createElement("h3");
        productName.textContent = product.name;
        productCard.appendChild(productName);

        const productCategory = document.createElement("p");
        productCategory.textContent = "Category: " + product.category;
        productCard.appendChild(productCategory);

        const productPrice = document.createElement("p");
        productPrice.textContent = "Price: $" + product.price;
        productCard.appendChild(productPrice);

        recommendationsDiv.appendChild(productCard);
        recommendationsDiv.appendChild(document.createElement("hr")); // Divider between products
    });
}

// Automatically call displayRecommendations to show suggestions when the page loads
document.addEventListener("DOMContentLoaded", function () {
    trackView(1);
    trackView(2);
    trackView(3);
    trackView(4);
    trackView(5);
    trackView(6);
    trackView(7);
    trackView(8);
    trackView(9);
    trackView(10);

    displayRecommendations(); 
});
