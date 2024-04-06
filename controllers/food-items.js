import FoodItem from "../models/FoodItem.js";
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../errors/index.js';

const getAllFoodItems = (req, res) => {
  res.send('get all food items');
};

const getFoodItem = (req, res) => {
  res.send('get food item');
};

const createFoodItem = async (req, res) => {
  req.body.createdBy = req.user.userID;
  let foodItem;
  try {
    foodItem = await FoodItem.create(req.body);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errorMessage = Object.values(error.errors).map(val => val.message);
      throw new BadRequestError(`Invalid food item data submitted: ${errorMessage.join(', ')}`);
    };
  };
  res.status(StatusCodes.CREATED).json({ foodItem });
};

const updateFoodItem = (req, res) => {
  res.send('update food item');
};

const deleteFoodItem = (req, res) => {
  res.send('delete food item');
};

export { getAllFoodItems, getFoodItem, createFoodItem, updateFoodItem, deleteFoodItem };
