// References to DOM elements
const productsRow = document.querySelector("#productsRow"); // Container for displaying game products
let resultNumber = document.querySelector("#resultNumber"); // Displays the number of results found
const sortingSelect = document.querySelector("#sortingOptions"); // Dropdown for sorting options
const sortingStores = document.querySelector("#sortingStores"); // Dropdown for store options
const sortingGenres = document.querySelector("#sortingGenres"); // Dropdown for genre options
const previousPageButton = document.querySelector("#previousPage"); // Button to go to the previous page
const nextPageButton = document.querySelector("#nextPage"); // Button to go to the next page
let pageNumberElement = document.querySelector("#pageNumber"); // Element displaying the current page number

// State variables for tracking current selections and URLs
let currentStore = 1; // Default store ID
let currentGenre = "none"; // Default genre selection
let genreTitles = []; // List of titles matching the selected genre
let pageNumber = 1; // Current page number (1-indexed for display)
let currentPage = 0; // Current page number (0-indexed for API)
let currentUrl = `https://www.cheapshark.com/api/1.0/deals?storeID=${currentStore}&sortBy=Metacritic&desc=0&pageNumber=${currentPage}&pageSize=16`; // Initial API URL

// Initialize the page number display
pageNumberElement.textContent = pageNumber;

// Function to fetch and display games based on the provided URL
function obtainGames(myUrl) {
  productsRow.innerHTML = ""; // Clear the current game display
  let url = myUrl; // Use the provided URL
  let obtainedGames = []; // List to track already displayed game titles (to prevent duplicates)

  // Adjust URL parameters if no specific genre is selected
  if (currentGenre === "none" || genreTitles.length === 0) {
    const urlNew = new URL(url);
    urlNew.searchParams.set("pageNumber", currentPage);
    urlNew.searchParams.set("pageSize", 16);
    url = urlNew.toString();
  } else {
    const urlNew = new URL(url);
    urlNew.searchParams.delete("pageNumber");
    urlNew.searchParams.delete("pageSize");
    url = urlNew.toString();
  }

  // Fetch games from the API
  if (url) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network error"); // Handle fetch errors
        }
        return response.json();
      })
      .then((data) => {
        let counter = 0; // Tracks the number of games processed
        let pageElementsCounter = 0; // Tracks the number of games displayed on the current page

        // Handle display when no specific genre is selected
        if (currentGenre === "none" || genreTitles.length === 0) {
          data.forEach(function (game) {
            // Calculate the discount percentage
            let savingPercentage = Math.floor(
              ((game.normalPrice - game.salePrice) / game.normalPrice) * 100
            );

            // Create a card for each game
            const classes = ["col-lg-6", "col-md-6", "col-sm-12", "mb-4"];
            let gameCol = document.createElement("div");
            gameCol.classList.add(...classes);

            // Avoid duplicate games
            if (!obtainedGames.includes(game.title)) {
              obtainedGames.push(game.title);
              // Column innerHTML with the game info 
              gameCol.innerHTML += `
                <div class="shop-col">
                    <img src="${game.thumb}" class="img-fluid mb-2" />
                    <h5 class="product-title">${game.title}</h5>
                    <p class="price-p">
                    <span class="sale-percentage-span">-${savingPercentage}%</span>
                    <span class="text-decoration-line-through text-secondary">${game.normalPrice}$</span>
                    <span>${game.salePrice}$</span>
                    </p>
                    <p>
                      <span>Score:</span>
                      <span class="rating-span">${game.metacriticScore}</span>
                      <button class="buy-button">BUY NOW</button>
                    </p>
                </div>`;
              pageElementsCounter++; // Increase the page counter
              productsRow.appendChild(gameCol); // Add the card to the container
              counter++; // Increase the counter
            }
          });
        } else {
          // Handle display for selected genres
          pageNumber = 1;
          // Reset pagination for genres
          currentPage = 0;
          pageNumberElement.textContent = pageNumber;
          // Calculate the discount percentage
          data.forEach(function (game) {
            let savingPercentage = Math.floor(
              ((game.normalPrice - game.salePrice) / game.normalPrice) * 100
            );
                        
            // Create a card for each game
            const classes = ["col-lg-6", "col-md-6", "col-sm-12", "mb-4"];
            let gameCol = document.createElement("div");
            gameCol.classList.add(...classes);

            // Filter games by matching title with genre keywords
            for (const title of genreTitles) {
              // Avoid duplicates
              if (!obtainedGames.includes(game.title)) {
                let lowerTitle = game.title.toLowerCase();
                if (lowerTitle.includes(title)) {
                  obtainedGames.push(game.title); 
                  if (counter < 16) {
                    // Column innerHTML with the game info 
                    gameCol.innerHTML += `
                      <div class="shop-col">
                          <img src="${game.thumb}" class="img-fluid mb-2" />
                          <h5 class="product-title">${game.title}</h5>
                          <p class="price-p">
                          <span class="sale-percentage-span">-${savingPercentage}%</span>
                          <span class="text-decoration-line-through text-secondary">${game.normalPrice}$</span>
                          <span>${game.salePrice}$</span>
                          </p>
                          <p>
                            <span>Score:</span>
                            <span class="rating-span">${game.metacriticScore}</span>
                            <button class="buy-button">BUY NOW</button>
                          </p>
                      </div>`;
                    pageElementsCounter++; // Increase the page counter
                  }
                  productsRow.appendChild(gameCol); // Add the card to the container
                  counter++; // Increase the counter
                }
              }
            }
          });
        }
        resultNumber.textContent = `Showing ${pageElementsCounter} results`; // Update the results display
      })
      .catch((error) => {
        console.error("Error:", error); // Log any errors
      });
  } else {
    console.error("The URL is not properly configured."); // Log invalid URL errors
  }
}

// Function to obtain the active stores from the API
function obtainStores() {
  const url = `https://www.cheapshark.com/api/1.0/stores`; // API endpoint to fetch store information

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network error"); // Handle network errors
      }
      return response.json();
    })
    .then((data) => {
      let counter = 0;

      data.forEach(function (store) {
        if (store.isActive === 1) { // Only include active stores
          let option = document.createElement("option");
          option.textContent = store.storeName; // Set store name as dropdown option text
          option.value = store.storeID; // Set store ID as the option value
          if (counter === 0) {
            option.selected = true; // Select the first store by default
            currentStore = store.storeID; // Update current store
          }
          sortingStores.appendChild(option); // Add option to the store dropdown
          counter++;
        }
      });
    })
    .catch((error) => {
      console.error("Error:", error); // Log errors
    });
}

// Function that obtain the genres from the json
function obtainGenres(currentGenre) {
  return fetch("./genres.json") // Fetch local JSON file containing genre keywords
    .then((response) => {
      if (!response.ok) {
        throw new Error("Genre not found"); // Handle fetch errors
      }
      return response.json();
    })
    .then((data) => {
      if (data[currentGenre]) {
        genreTitles = data[currentGenre]; // Update genre keywords if found
      } else {
        genreTitles = []; // Clear genre keywords if none match
      }
    })
    .catch((error) => {
      console.error("Error:", error); // Log errors
    });
}


// Genres select event listener
sortingSelect.addEventListener("change", (event) => {
  const selectedValue = event.target.value; // Get the selected sorting option value

  // Update the current API URL based on the selected sorting option
  switch (selectedValue) {
    case "1": // Sort by Title (ascending)
      currentUrl = `https://www.cheapshark.com/api/1.0/deals?storeID=${currentStore}&sortBy=Title&desc=0&pageNumber=${currentPage}&pageSize=16`;
      break;
    case "2": // Sort by Title (descending)
      currentUrl = `https://www.cheapshark.com/api/1.0/deals?storeID=${currentStore}&sortBy=Title&desc=1&pageNumber=${currentPage}&pageSize=16`;
      break;
    case "3": // Sort by Price (ascending)
      currentUrl = `https://www.cheapshark.com/api/1.0/deals?storeID=${currentStore}&sortBy=Price&desc=0&pageNumber=${currentPage}&pageSize=16`;
      break;
    case "4": // Sort by Price (descending)
      currentUrl = `https://www.cheapshark.com/api/1.0/deals?storeID=${currentStore}&sortBy=Price&desc=1&pageNumber=${currentPage}&pageSize=16`;
      break;
    case "5": // Sort by Recently Added
      currentUrl = `https://www.cheapshark.com/api/1.0/deals?storeID=${currentStore}&sortBy=Recent&desc=0&pageNumber=${currentPage}&pageSize=16`;
      break;
    default: // Default sorting (Metacritic Score)
      currentUrl = `https://www.cheapshark.com/api/1.0/deals?storeID=${currentStore}&sortBy=Metacritic&desc=0&pageNumber=${currentPage}&pageSize=16`;
  }

  // Fetch and display games with the updated URL
  obtainGames(currentUrl);
});

// Stores select event listener
sortingStores.addEventListener("change", (event) => {
  const selectedValue = event.target.value; // Get the selected store ID

  currentStore = selectedValue; // Update the current store ID

  // Update the storeID parameter in the API URL
  const url = new URL(currentUrl);
  url.searchParams.set("storeID", currentStore);
  currentUrl = url.toString();

  // Fetch and display games for the selected store
  obtainGames(currentUrl);
});

// Genres select event listener
sortingGenres.addEventListener("change", async (event) => {
  const selectedValue = event.target.value; // Get the selected genre

  currentGenre = selectedValue.toLowerCase(); // Update the current genre

  await obtainGenres(currentGenre); // Fetch and update genre keywords

  obtainGames(currentUrl); // Fetch and display games matching the selected genre
});



// Previous page button event listener
previousPageButton.addEventListener("click", () => {
  if (pageNumber !== 1) { // Prevent going to a page number less than 1
    pageNumber--; // Decrement page number
    currentPage--; // Decrement currentPage for API
    pageNumberElement.textContent = pageNumber; // Update displayed page number
    obtainGames(currentUrl); // Fetch and display games for the previous page
  }
});

// Next page button event listener
nextPageButton.addEventListener("click", () => {
  pageNumber++; // Increment page number
  currentPage++; // Increment currentPage for API
  pageNumberElement.textContent = pageNumber; // Update displayed page number
  obtainGames(currentUrl); // Fetch and display games for the next page
});


obtainStores(); // Populate store options on page load

obtainGames(currentUrl); // Fetch and display games for the default settings

