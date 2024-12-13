//function to hide all sections
function hideAllSections(){
  const sections = document.querySelectorAll('.card-container');
  sections.forEach(section => {
      section.classList.add('hidden');
  });
}

//function to remove the active class from all buttons
function resetActiveButtons(){
  const buttons = document.querySelectorAll('.medicene-btn button');
  buttons.forEach(button =>{
      button.classList.remove('active');
  })
}

//function to show a specific category
function showCategory(categoryId,button){
  hideAllSections();
  resetActiveButtons();

  const selectedSection = document.getElementById(categoryId);
  if (selectedSection){
      selectedSection.classList.remove('hidden');
  }

  //highlight the active button
  button.classList.add('active');
}

const cartItems = [];

// Function to update the cart table
function updateCart() {
const cartBody = document.getElementById("cart-body");
const totalPriceEl = document.getElementById("total-amount");

// Clear existing rows
cartBody.innerHTML = "";

let totalPrice = 0;

cartItems.forEach((item, index) => {
  const subtotal = item.price * item.quantity;
  totalPrice += subtotal;

  // Create a new row
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${item.name}</td>
    <td>Rs.${item.price.toFixed(2)}</td>
    <td>
      <input 
        type="number" 
        value="${item.quantity}" 
        min="1"
        class="quantity-input"
        onchange="updateQuantity(${index}, this.value)" 
      />
    </td>
    <td>Rs.<span id="subtotal-${index}">${subtotal.toFixed(2)}</span></td>
    <td><button onclick="removeItem(${index})" class="remove-btn">x</button></td>
  `;

  cartBody.appendChild(row);
});

// Update total price
totalPriceEl.textContent = totalPrice.toFixed(2);
}

// Function to update the quantity of an item
function updateQuantity(index, newQuantity) {
// Convert newQuantity to a number
const quantity = parseInt(newQuantity, 10);

if (quantity > 0) {
  cartItems[index].quantity = quantity;

  // Update the subtotal for this item
  const newSubtotal = cartItems[index].price * cartItems[index].quantity;
  document.getElementById(`subtotal-${index}`).textContent = newSubtotal.toFixed(2);

  // Update the total price
  updateCart();
}
}

// Function to add an item to the cart
function addToCart(productName, productPrice) {
// Check if the product already exists in the cart
const existingItem = cartItems.find(item => item.name === productName);

if (existingItem) {
  // Increase the quantity if it exists
  existingItem.quantity++;
} else {
  // Add new product to the cart
  cartItems.push({ name: productName, price: productPrice, quantity: 1 });
}

// Update the cart table
updateCart();
}

// Function to remove an item
function removeItem(index) {
cartItems.splice(index, 1);
updateCart();
}

//function to save the cart to local storage as favorites
function addToFavorites(){
  if(cartItems.length === 0){
    alert("Your cart is empty. Add some items to save as favorites.");
    return;
  }

  //save cart items to local storage
  localStorage.setItem("favorites", JSON.stringify(cartItems));
  alert("Cart saved to favorites!");
}

//add event listener to the add to favorites button
document.getElementById("addToFavorites").addEventListener("click",addToFavorites);

//function to apply favorites to the cart
function applyFavorites(){
  const savedFavorites = localStorage.getItem("favorites");

  if(!savedFavorites){
    alert("No favorites saved yet!");
    return;
  }

  //parse favorites from local storage
  const favoriteItems = JSON.parse(savedFavorites);


  //update cart with favorites
  favoriteItems.forEach(item => {
    cartItems.push({
      name: item.name,
      price: item.price,
      quantity: item.quantity
    });
  });
}

//add event listener to apply favorites button
document.getElementById("applyFavorites").addEventListener("click",applyFavorites);


// Initial cart update
updateCart();

//add event listener to the shopping cart button
document.getElementById("shopping-cart").addEventListener("click",function(){
document.getElementById("cartTable").scrollIntoView({behavior:"smooth"});
});


document.getElementById("buyNow").addEventListener("click", function(){
const cartBody = document.getElementById("cart-body").children;

if (cartBody.length === 0){
  alert("Your cart is empty!");
  return;
}

const cart = [];
for (let row of cartBody) {
  const productName = row.children[0].textContent;
  const price = row.children[1].textContent;
  const quantity = row.children[2].children[0].value;
  const subtotal = row.children[3].textContent;

  cart.push({ productName, price, quantity, subtotal });
}
const totalAmount = document.getElementById("total-amount").textContent;

  // Save cart and total to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("totalAmount", totalAmount);

  // Redirect to checkout page
  window.location.href = "checkout.html";
});

//navigate to checkout page when the buy now button is clicked
document.getElementById("buyNow").addEventListener("click",function(){
window.location.href = "checkout.html";
});

//fetch the contents of the json file
function loadMedicines(){
  fetch('index.json')
  .then(response => response.json())
  .then(data => {
      const categories = {
          analgesics: [],
          antibiotics: [],
          antidepressants: [],
          antihistamines: [],
          antihypertensives: []
      };
      // Categorize the medicines
      data.forEach(medicine => {
          categories[medicine.category].push(medicine);
      });

       // Dynamically generate medicine cards
       Object.keys(categories).forEach(category => {
          let categorySection = `<section class="card-container hidden" id="${category}">`;

          categories[category].forEach(medicine => {
              categorySection += `
                  <div class="card">
                      <img src="${medicine.image}" alt="${medicine.name}">
                      <div class="card-info">
                          <h3>${medicine.name}</h3>
                          <p>Rs.${medicine.price}</p>
                          <button onclick="addToCart('${medicine.name}', ${medicine.price})" class="add-to-cart">Add to cart</button>
                      </div>
                  </div>`;
          });

          categorySection += '</section>';
          document.getElementById('product-container').innerHTML += categorySection;
      });
  })
  .catch(error => console.error("Error loading the JSON file:", error));
}

// Call the loadMedicines function when the page is loaded
document.addEventListener("DOMContentLoaded", loadMedicines);

//add event listener to the upload prescription button
document.getElementById("prescription-btn").addEventListener("click",function(){
document.getElementById("prescription").scrollIntoView({behavior:"smooth"});
});