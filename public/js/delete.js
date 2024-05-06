import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showFoodItems } from "./food-items.js";

let foodItemsDiv = null;

export const handleDelete = () => {
  const foodItemToDelete = document.getElementById(`delete`)
  const confirmDeleteYes = document.getElementById("confirmYes");
  const confirmDeleteNo = document.getElementById("confirmNo");
  foodItemsDiv = document.getElementById("food-items");

  foodItemToDelete.addEventListener("click", async (e) => {
    if (e.target.nodeName === "BUTTON") {
      if (e.target === confirmDeleteYes) {
        const method = "DELETE";
        const url = `/api/v1/food-items/${confirmDeleteYes.dataset.id}`;
        try {
          enableInput(false);
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            }
          });

          const data = await response.json();
          if (response.status === 200) {
            // a 200 is expected for a successful delete
            message.textContent = "The food item entry was deleted.";
            showFoodItems();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }
        enableInput(true);
      } else if (e.target === confirmDeleteNo) {
        message.textContent = "";
        showFoodItems();
      }
    }
  });
};

export const showDeleteConfirmation = async (foodItemId) => {
  const foodItemsTableHeader = document.getElementById("food-items-table-header");
  const foodItemsTable = document.getElementById("food-items-table");
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
      if (data.count === 0) {
        foodItemsTable.replaceChildren(foodItemsTableHeader); // clear this for safety
      } else {
        let rowEntry = document.createElement("tr");
        rowEntry.setAttribute('id', 'delete');

        let confirmDeleteYes = `<td><button type="button" class="confirmDelete" id="confirmYes" data-id=${data.foodItem._id}>delete</button></td>`;
        let confirmDeleteNo = `<td><button type="button" class="confirmDelete" id="confirmNo" data-id=${data.foodItem._id}>return</button></td>`;
        let rowHTML = `
          <td>${data.foodItemsname}</td>
          <td>${data.foodItem.brand || ""}</td>
          <td>${data.foodItem.mealTime || ""}</td>
          <td>${data.foodItem.amount.quantity} ${data.foodItem.amount.unit}</td>
          <td>${new Date(data.foodItem.consumeDate).toLocaleDateString()}</td>
          <td>${data.foodItem.calories}</td>
          <td>${data.foodItem.comments || ""}</td>
          ${confirmDeleteYes}
          ${confirmDeleteNo}
          `;
        rowEntry.innerHTML = rowHTML;
        foodItemsTable.replaceChildren(foodItemsTableHeader, rowEntry);
      };
      message.textContent = "Confirm unconsumption.";
      handleDelete();
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
  setDiv(foodItemsDiv);
};
