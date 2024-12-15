// Function to hide all sections
function hideAllSections() {
    const sections = document.querySelectorAll('.card-container');
    sections.forEach(section => {
      section.classList.add('hidden');
    });
  }
  
  // Function to remove the active class from all buttons
  function resetActiveButtons() {
    const buttons = document.querySelectorAll('.medicene-btn button');
    buttons.forEach(button => {
      button.classList.remove('active');
    });
  }
  
  // Function to show a specific category
  function showCategory(categoryId, button) {
    hideAllSections();
    resetActiveButtons();
  
    const selectedSection = document.getElementById(categoryId);
    if (selectedSection) {
      selectedSection.classList.remove('hidden');
    }
  
    // Highlight the active button
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
            min="0"
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
    const quantity = parseInt(newQuantity, 10);
  
    if (quantity > 0) {
      cartItems[index].quantity = quantity;
  
      // Update the subtotal for this item
      const newSubtotal = cartItems[index].price * quantity;
      document.getElementById(`subtotal-${index}`).textContent = newSubtotal.toFixed(2);
    } else {
      // Remove the item if the quantity is zero
      cartItems.splice(index, 1);
    }
  
    // Refresh the cart table
    updateCart();
  }
  
  // Function to handle quantity input changes
  function handleQuantityChange(productName, productPrice, newQuantity) {
    const quantity = parseInt(newQuantity, 10);
    const existingItem = cartItems.find(item => item.name === productName);
  
    if (existingItem) {
      if (quantity > 0) {
        existingItem.quantity = quantity;
      } else {
        // Remove item if quantity becomes 0
        cartItems.splice(cartItems.indexOf(existingItem), 1);
      }
    } else if (quantity > 0) {
      // Add new item if quantity > 0
      cartItems.push({ name: productName, price: productPrice, quantity: quantity });
    }
  
    updateCart(); // Refresh the cart table
  }
  
  // Function to remove an item from the cart
  function removeItem(index) {
    cartItems.splice(index, 1);
    updateCart();
  }
  
  // Fetch the contents of the JSON file and dynamically generate product cards
  function loadMedicines() {
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
            const sanitizedName = medicine.name.replace(/\s+/g, '-');
  
            categorySection += `
              <div class="card">
                <img src="${medicine.image}" alt="${medicine.name}">
                <div class="card-info">
                  <h3>${medicine.name}</h3>
                  <p>Rs.${medicine.price}</p>
                  <label for="qty-${sanitizedName}">Quantity</label>
                  <input 
                    type="number" 
                    id="qty-${sanitizedName}" 
                    min="0" 
                    value="0" 
                    class="quantity-input"
                    onchange="handleQuantityChange('${medicine.name}', ${medicine.price}, this.value)"
                  />
                </div>
              </div>`;
          });
  
          categorySection += '</section>';
          document.getElementById('product-container').innerHTML += categorySection;
        });
      })
      .catch(error => console.error("Error loading the JSON file:", error));
  }
  
  // Add event listener to the "Buy Now" button
  document.getElementById("buyNow").addEventListener("click", function () {
    const cartBody = document.getElementById("cart-body").children;
  
    if (cartBody.length === 0) {
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
  
  // Call the loadMedicines function when the page is loaded
  document.addEventListener("DOMContentLoaded", loadMedicines);
  
  // Initial cart update
  updateCart();
  
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
    // Initial cart update
    updateCart();
  }
  
  //add event listener to apply favorites button
  document.getElementById("applyFavorites").addEventListener("click",applyFavorites);

//add event listener to the shopping cart button
document.getElementById("shopping-cart").addEventListener("click",function(){
document.getElementById("cartTable").scrollIntoView({behavior:"smooth"});
});

//add event listener to the upload prescription button
document.getElementById("prescription-btn").addEventListener("click",function(){
document.getElementById("prescription").scrollIntoView({behavior:"smooth"});
});    