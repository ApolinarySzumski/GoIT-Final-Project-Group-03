// npm modules
import { mongoose, Schema, model } from "mongoose";

const ingredientMeasureSchema = new Schema({
  measure: {
    type: String,
    required: true,
  },
});

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      enum: ["tbs", "tsp", "kg", "g", "ml", "piece"],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Beef",
        "Breakfast",
        "Chicken",
        "Dessert",
        "Goat",
        "Lamb",
        "Miscellaneous",
        "Pasta",
        "Pork",
        "Seafood",
        "Side",
        "Starter",
        "Vegan",
        "Vegetarian",
      ],
      required: true,
    },
    area: {
      type: String,
    },
    instructions: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    thumb: {
      type: String,
      validate: /^(http|https):\/\/[^\s]+$/,
    },
    preview: {
      type: String,
      validate: /^(http|https):\/\/[^\s]+$/,
    },
    time: {
      type: Number,
      required: true,
    },
    favorites: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    youtube: {
      type: String,
      validate: /^(http|https):\/\/[^\s]+$/,
    },
    tags: [
      {
        type: String,
      },
    ],
    ingredients: [ingredientMeasureSchema],
    owner: {
      type: String,
      ref: "User",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const Recipe = model("recipe", recipeSchema, "recipes");

export default Recipe;
