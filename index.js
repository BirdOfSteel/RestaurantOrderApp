import { menuArray } from "/data.js"

const menuItemsDiv = document.getElementById("menu-items-div")
const orderInfo = document.getElementById("order-info")
const currentOrderDiv = document.getElementById("current-order-div")
const totalPriceValue = document.getElementById("total-price-value")

const paymentForm = document.getElementById("payment-form")

const mealDealDiscount = 0.15 // 15% off would be 0.15

let orderArray = [] // user orders are managed here

let reviewArray = [] // user reviews go here

renderAtStart() // runs render functions for menu and review stars

//listens to clicks on most buttons
document.addEventListener("click", (e) => {
    if(e.target.dataset.foodId) {
        addItemToOrderArray(e.target.dataset.foodId)
    }
    
    else if (e.target.dataset.remove) {
        removeItemFromOrder(e.target.dataset.remove)
    }
    
    else if (e.target.id === "confirm-order-btn") {
        document.getElementById("form-div").style.display = "flex";
    }
    
    else if (e.target.id === "close-payment") {
        document.getElementById("form-div").style.display = "none";
    }
    
    else if (e.target.id === "submit-payment-details-btn") {
        submitPaymentDetails(e)
    }
    
    else if (e.target.id === "close-review") {
        document.getElementById("review-div").style.display = "none";
    }
    
    else if (e.target.classList.contains("fa-star")) {
        renderStars(e.target.dataset.star)
    }
    
    else if (e.target.id === "submit-review-btn") {
        submitReview()
    }
})


function submitReview() {
   const userReviewTextarea = document.getElementById("review-textarea")
   const userRating = document.querySelectorAll(".fa-solid").length - 2
   
   if (userRating > 0 && userRating < 6) {
       const userRatingObject = {
           userRating: userRating
       }
       
       if (userReviewTextarea.value.length > 0) {
           userRatingObject.userReview = userReviewTextarea.value
       }
       
       reviewArray.push(userRatingObject)
       document.getElementById("review-div").style.display = "none";
       
       userReviewTextarea.value = ""
       renderStars(-1)
   }
   
   else {
       document.getElementById("review-error-div").innerHTML = "Please select how many stars you'd like to leave!"
   }
}
 

function renderStars(starClicked) {

    let starsHtml = "" 
   
    for (let i=0; i < 5; i++) {
        
        const starFill = starClicked >= i ? "fa-solid" : "fa-regular";
        
        starsHtml += `
        <div class="star-div">
            <i class="${starFill} fa-star" data-star=${i}></i>
            <p>${i+1}</p>
        </div>
        `         
    }
    
    document.getElementById("stars-div").innerHTML = starsHtml
}

function submitPaymentDetails(e) {
    const cardHolderName = document.getElementById("card-holder-name")
    const cardNumber = document.getElementById("card-number")
    const cvv = document.getElementById("cvv")
    const errorMessageDiv = document.getElementById("error-message-div")
    
    e.preventDefault()
    
    if (2 > cardHolderName.value.length || cardHolderName.value.length > 32) {
        errorMessageDiv.innerHTML = "Name must be within 2 and 32 characters long"
    }
    
    else if (cardNumber.value.length != 16) {
        errorMessageDiv.innerHTML = "Card number must be 16 digits long"
    }
    
    else if (cvv.value.length != 3) {
        errorMessageDiv.innerHTML = "CVV must be 3 digits long"
    }
    
    else {
        document.getElementById("form-div").style.display = "none"; 
        document.getElementById("review-div").style.display = "flex";    
    }
}


function removeItemFromOrder(foodId) {
    const foodItem = orderArray.filter(function(foodItem){
        return foodItem.id == foodId
    })[0]
    
    const index = orderArray.indexOf(foodItem)
    orderArray.splice(index,1)
    
    if (orderArray.length === 0){
        document.getElementById("order-info-div").style.display = "none"
    }
    
    renderOrderInfo(orderArray)
    
}


function checkForMealDeal(orderArray,totalPriceOfArray) {
    const mealDealOrderArray = []
    
    orderArray.forEach(function(order){
        mealDealOrderArray.push(order.mealDeal)
    })
    
    if (mealDealOrderArray.includes("food") && mealDealOrderArray.includes("drink")) {
        
        const totalPrice = (totalPriceOfArray * (1-mealDealDiscount)).toFixed(2)
        const mealDealSavings = (totalPriceOfArray * mealDealDiscount).toFixed(2)
    
        document.getElementById("meal-deal-applied-value").innerHTML = `-$${mealDealSavings}`
        document.getElementById("meal-deal-applied-div").style.display = "flex";
        
        return totalPrice
    }
    
    else {
        document.getElementById("meal-deal-applied-div").style.display = "none";
        
        return totalPriceOfArray
    }
}


function addItemToOrderArray(foodId) {
    const foodItem = menuArray.filter(function(foodItem){
        return foodItem.id == foodId
    })[0]
    
    orderArray.includes(foodItem) === false && orderArray.push(foodItem) //short-circuit

    renderOrderInfo(orderArray)
}


function renderOrderInfo(orderArray) {
    
    if (orderArray.length > 0) {
        document.getElementById("order-info-div").style.display = "flex";
    }
    
    let orderInfoString = ""
    
    orderArray.forEach(function(foodItem){
        
        orderInfoString +=
        `<div class="added-food-item-div">
            <div class="food-name-and-remove-button-div">
                <p class="added-food-item">${foodItem.name}</p>
                <p class="remove-food-item" data-remove=${foodItem.id}>REMOVE</p>
            </div>
            <p class="added-food-item-price">$${foodItem.price}</p>
        </div>`
    })
   
    const totalPriceOfArray = orderArray.reduce(function(total, currentVal){
        return total + currentVal.price
    },0)
    
    totalPriceValue.innerHTML = "$" + checkForMealDeal(orderArray,totalPriceOfArray)
    
    currentOrderDiv.innerHTML = orderInfoString
}


function renderMenuItems(menuArray) {
    
    let menuString = ""
    
    menuArray.forEach( (menuItem) => {
        
        const ingredients = menuItem.ingredients.join(", ")
        
        menuString +=
            `<div class="food-item-div">
                <div class="emoji-div">
                    <span class="emoji">${menuItem.emoji}</span>
                </div>
                <div class="food-item-details-div">
                    <p class="food-item-name">${menuItem.name}</p>
                    <p class="food-item-ingredients">${ingredients}</p>
                    <p class="food-item-price">$${menuItem.price}</p>
                </div>
                <div class="add-item-div" data-food-id=${menuItem.id}>
                    <i class="fa-regular fa-plus" data-food-id=${menuItem.id}></i>
                </div>
            </div>`
    })
    
    menuItemsDiv.innerHTML = menuString
    
}


function renderAtStart() {
    renderMenuItems(menuArray)
    renderStars()
}
