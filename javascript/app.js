// Get the navigation bar element by its ID
const nav = document.getElementById("mynav");

// Get the counter container and the individual counters by their IDs
const counterContainer = document.querySelector("#counterContainer");
let contador1 = document.querySelector("#counter1");
let contador2 = document.querySelector("#counter2");
let contador3 = document.querySelector("#counter3");
let contador4 = document.querySelector("#counter4");

// Flag to ensure the counters only start once
let countersStarted = false;

// Function to animate the counter by incrementing it gradually
function animateCounter(element, max) {
  let count = 0;
  // The increment value is calculated by dividing the maximum value by 100
  const increment = max / 100; 
  
  // This interval function updates the counter every 30 milliseconds
  const updateCounter = setInterval(() => {
    count += increment;
    element.textContent = "+" + Math.ceil(count); // Update the text content with the current count
    
    // Stop the animation once the count reaches the maximum value
    if (count >= max) {
      element.textContent = "+" + max;
      clearInterval(updateCounter); // Clear the interval to stop the animation
    }
  }, 30); // Set the speed of the animation (every 30 milliseconds)
}

// Scroll event listener to change the appearance of the navigation bar and trigger counter animation
window.onscroll = function () {
  // Check if the page has been scrolled down 100px or more, to add/remove a class that changes navbar style
  if (document.documentElement.scrollTop >= 100) {
    nav.classList.add("navbar-scroll"); // Add the class to change navbar style
  } else {
    nav.classList.remove("navbar-scroll"); // Remove the class if not scrolled
  }

  // Check if the counter container is visible on the screen
  const counterContainer = document.querySelector('#counterContainer'); // Select the counter container
  if (counterContainer) {
    const containerPosition = counterContainer.getBoundingClientRect().top; // Get the position of the container relative to the viewport
    const screenPosition = window.innerHeight; // Get the height of the visible screen area

    // If the counter container is in view and the counters haven't been started yet
    if (containerPosition < screenPosition && !countersStarted) {
      countersStarted = true; // Set flag to prevent restarting the counters
      // Start animating each counter with their respective maximum values
      animateCounter(contador1, 1300); 
      animateCounter(contador2, 1100); 
      animateCounter(contador3, 900); 
      animateCounter(contador4, 256); 
    }
  }
};

// Select all images inside the gallery
const galleryImages = document.querySelectorAll(".gallery-img");

// Get the image element inside the modal
const modalImage = document.getElementById("modalImage");

// Add a click event listener to each gallery image to open the modal and display the clicked image
galleryImages.forEach((img) => {
  img.addEventListener("click", () => {
    modalImage.src = img.src; // Set the modal image source to the clicked image's source
    const modal = new bootstrap.Modal(document.getElementById('imageModal')); // Initialize the modal using Bootstrap's modal component
    modal.show(); // Display the modal with the selected image
  });
});


