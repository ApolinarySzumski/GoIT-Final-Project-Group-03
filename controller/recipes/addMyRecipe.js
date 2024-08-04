//node modules
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

//npm modules
import "dotenv/config";
import Jimp from "jimp";

//my modules
import Recipe from "../../service/schemas/recipe.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const thumbsDir = path.join(__dirname, "../../public/thumbnails");
const previewsDir = path.join(__dirname, "../../public/previews");

const addRecipe = async (userId, recipeData) => {
  try {
    const recipe = new Recipe({ ...recipeData, owner: userId });
    return await recipe.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addMyRecipe = async (req, res, next) => {
  const { title, description, category, time, ingredients, instructions } =
    req.body;

  let parsedIngredients;
  try {
    parsedIngredients = JSON.parse(ingredients);
  } catch (error) {
    return res.status(400).json({ message: "Invalid ingredients format" });
  }

  const { path: tmpPath, originalname } = req.file;

  try {
    const userId = req.user._id;

    await fs.mkdir(thumbsDir, { recursive: true });
    await fs.mkdir(previewsDir, { recursive: true });

    const img = await Jimp.read(tmpPath);

    const thumbName = `${userId}-${Date.now()}-${originalname}`;
    const thumbPath = path.join(thumbsDir, thumbName);
    await img.resize(357, 344).writeAsync(thumbPath);

    const previewName = `preview-${thumbName}`;
    const previewPath = path.join(previewsDir, previewName);
    await img.resize(318, 324).writeAsync(previewPath);

    const thumbURL = path.join("thumbnails", thumbName);
    const previewURL = path.join("previews", previewName);

    await fs.rename(tmpPath, thumbPath);

    const result = await addRecipe(userId, {
      title,
      description,
      category,
      time,
      ingredients: parsedIngredients,
      instructions,
      thumb: `${process.env.V_URL}${process.env.MAIN_PORT || 8000}/${thumbURL}`,
      preview: `${process.env.V_URL}${
        process.env.MAIN_PORT || 8000
      }/${previewURL}`,
    });
    res.json({
      message: "Recipe added successfully",
      data: { recipe: result },
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

export default addMyRecipe;