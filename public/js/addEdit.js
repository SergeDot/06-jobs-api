import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showFoodItems } from "./food-items.js";

let addEditDiv = null;

let foodItemName = null;
let brand = null;
let mealTime = null;
let calories = null;
let quantity = null;
let unit = null;
let consumeDate = null;
let comments = null;

let addingFoodItem = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-food-item");

  foodItemName = document.getElementById("foodName");
  brand = document.getElementById("brand");
  mealTime = document.getElementById("mealTime");
  calories = document.getElementById("calories");
  quantity = document.getElementById("quantity");
  unit = document.getElementById("unit");
  consumeDate = document.getElementById("consume-date");
  comments = document.getElementById("comments");

  addingFoodItem = document.getElementById("adding-food-item");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingFoodItem) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/food-items";

        if (addingFoodItem.textContent === "update") {
          method = "PATCH";
          url = `/api/v1/food-items/${addEditDiv.dataset.id}`;
        }

        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: foodItemName.value,
              brand: brand.value,
              mealTime: mealTime.value,
              calories: calories.value,
              amount: {
                quantity: quantity.value,
                unit: unit.value
              },
              consumeDate: consumeDate.value,
              comments: comments.value
            }),
          });

          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            if (response.status === 200) {
              // a 200 is expected for a successful update
              message.textContent = "The food item entry was updated.";
            } else {
              // a 201 is expected for a successful create
              message.textContent = "The food item entry was created.";
            }

            foodItemName.value = "";
            brand.value = "";
            mealTime.value = "pending";
            showFoodItems();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }

        enableInput(true);
      } else if (e.target === editCancel) {
        message.textContent = "";
        showFoodItems();
      }
    }
  });
};

const formattedDateEdit = (date) => {
  const timeZoneOffset = new Date(date).getTimezoneOffset();
  const offsetDate = new Date(Date.parse(date) + timeZoneOffset * 60 * 1000);
  const year = offsetDate.getFullYear();
  const month = (offsetDate.getMonth() + 1).toLocaleString(undefined, { minimumIntegerDigits: 2 });
  const day = (offsetDate.getDate()).toLocaleString(undefined, { minimumIntegerDigits: 2 });
  return `${year}-${month}-${day}`;
};

export const showAddEdit = async (foodItemId) => {
  if (!foodItemId) {
    foodItemName.value = "";
    brand.value = "";
    mealTime.value = "breakfast";
    calories.value = "";
    quantity.value = "";
    unit.value = "";
    consumeDate.value = new Date();
    comments.value = "";

    addingFoodItem.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/food-items/${foodItemId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {

        foodItemName.value = data.foodItem.name;
        brand.value = data.foodItem.brand || "";
        mealTime.value = data.foodItem.mealTime || "";
        calories.value = data.foodItem.calories;
        quantity.value = data.foodItem.amount.quantity;
        unit.value = data.foodItem.amount.unit;
        consumeDate.value = formattedDateEdit(data.foodItem.consumeDate);
        comments.value = data.foodItem.comments || "";

        addingFoodItem.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = foodItemId;

        setDiv(addEditDiv);
      } else {
        // might happen if the list has been updated since last display
        message.textContent = "The food item entry was not found";
        showFoodItems();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showFoodItems();
    }

    enableInput(true);
  }
};
