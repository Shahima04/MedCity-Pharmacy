//save order to the local storage
window.onload = function(){
    const cart = JSON.parse(localStorage.getItem("cart"));
    const totalAmount = localStorage.getItem("totalAmount");

    if (!cart || cart.length === 0){
        alert("No order found!");
        return;
    }

    //displays a summary of the order in the checkout page
    const checkoutBody = document.getElementById("checkout-body");

    cart.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML =`
        <td>${item.productName}</td>
        <td>${item.price}</td>
        <td>${item.quantity}</td>
        <td>${item.subtotal}</td>
        `;
        checkoutBody.appendChild(row);
    });
    document.getElementById("checkout-total").textContent = totalAmount;
};
//displays a message when the pay button is clicked
document.getElementById("payNow").addEventListener("click",()=>{
    const form = document.getElementById('checkout-form');
    const message = document.getElementById('message');
    const cartBody = document.getElementById('checkout-body');
    const totalAmount = document.getElementById('checkout-total');

    if (form.checkValidity()){
        const today = new Date();
        const deliveryDate = new Date();
        deliveryDate.setDate(today.getDate()+5);

        alert(`Thankyou for your purchase! Your order will be delivered by ${deliveryDate.toDateString()}.`);
        message.classList.remove('hidden');

        //clear the form
        form.reset();

        //clear the cart table body
        cartBody.innerHTML = '';
        totalAmount.textContent = '0.00';
    }
    else{
        alert('Please fill out all fields correctly.');
    }
});