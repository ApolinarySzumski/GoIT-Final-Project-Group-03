const getRecipesByCategory = async (req, res, next) => {
  try {
    // code
    res.json({ message: "OK" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default getRecipesByCategory;
