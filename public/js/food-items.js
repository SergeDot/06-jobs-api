import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";
import { showDeleteConfirmation } from "./delete.js";

let foodItemsDiv = null;
let foodItemsTable = null;
let foodItemsTableHeader = null;

const formattedDateQueryResult = (date) => {
  const timeZoneOffset = new Date(date).getTimezoneOffset();
  return new Date(Date.parse(date) + timeZoneOffset * 60 * 1000).toLocaleDateString();
};

export const handleFoodItems = () => {
  foodItemsDiv = document.getElementById("food-items");
  const logoff = document.getElementById("logoff-button");
  const addFoodItem = document.getElementById("add-food-item-button");
  foodItemsTable = document.getElementById("food-items-table");
  foodItemsTableHeader = document.getElementById("food-items-table-header");

  foodItemsDiv.addEventListener("click", (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addFoodItem) {
        showAddEdit(null);
      } else if (e.target === logoff) {
        setToken(null);
        message.textContent = "You have been logged off.";
        foodItemsTable.replaceChildren(foodItemsTableHeader);
        showLoginRegister();
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = "";
        showAddEdit(e.target.dataset.id);
      } else if (e.target.classList.contains("deleteButton")) {
        message.textContent = "";
        showDeleteConfirmation(e.target.dataset.id);
      }
    }
  });
};

export const showFoodItems = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/food-items", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    let children = [foodItemsTableHeader];

    if (response.status === 200) {
      if (data.count === 0) {
        foodItemsTable.replaceChildren(...children); // clear this for safety
      } else {
        let totalCalories = 0;
        for (let i = 0; i < data.foodItems.length; i++) {
          let rowEntry = document.createElement("tr");

          let editButton = `<td><button type="button" class="editButton" data-id=${data.foodItems[i]._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.foodItems[i]._id}>delete</button></td>`;
          let rowHTML = `
            <td>${data.foodItems[i].name}</td>
            <td>${data.foodItems[i].brand || ""}</td>
            <td>${data.foodItems[i].mealTime || ""}</td>
            <td>${data.foodItems[i].amount.quantity} ${data.foodItems[i].amount.unit}</td>
            <td>${formattedDateQueryResult(data.foodItems[i].consumeDate)}</td>
            <td>${data.foodItems[i].calories}</td>
            <td>${data.foodItems[i].comments || ""}</td>
            ${editButton}
            ${deleteButton}
            `;
          totalCalories += data.foodItems[i].calories;
          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        };
        let totalRow = document.createElement('tr');
        totalRow.innerHTML = `<td colspan="9" id="table-row-total">Total calories: ${totalCalories}</td>`;
        foodItemsTable.replaceChildren(...children);
        foodItemsTable.appendChild(totalRow)
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
  setDiv(foodItemsDiv);
};
