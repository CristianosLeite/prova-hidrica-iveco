const { Router } = require("express");
const Recipe = require("../models/recipe.model.js");

/**
 * Recipes controller
 */
class RecipeController {
  constructor(io) {
    this.io = io;
    this.router = Router();
    this.router.post("/create", this.create.bind(this));
    this.router.get("/all", this.all.bind(this));
    this.router.get("/vp", this.retrieveByVp.bind(this));
    this.router.get("/id", this.retrieveById.bind(this));
    this.router.put("/update", this.update.bind(this));
    this.router.delete("/delete", this.delete.bind(this));
  }

  /**
   * Get the router
   * @returns { Router }
   */
  getRouter() {
    return this.router;
  }

  /**
   * Create a new recipe in the database
   * @param {*} req
   * @param {*} res
   * @returns { Recipe }
   * @example /api/recipe/create
   */
  async create(req, res) {
    const newRecipe = req.body;

    if (!newRecipe) {
      res.status(400).send({ message: "Missing recipe" });
      return;
    }

    const recipe = new Recipe(newRecipe);

    await recipe.save().then(() => {
      res.json(recipe);
    });
  }

  /**
   * Retrieve all recipes from the database
   * @param {*} req
   * @param {*} res
   * @returns { Recipe[] }
   * @example /api/recipe/all
   */
  async all(req, res) {
    await Recipe.findAll().then((recipes) => {
      res.json(recipes);
    });
  }

  /**
   * Retrieve a recipe by its vp
   * @param {*} req
   * @param {*} res
   * @returns { Recipe }
   * @example /api/recipe/one?vp=123456
   */
  async retrieveByVp(req, res) {
    const { vp } = req.query;

    if (!vp) {
      res.status(400).send({ message: "Missing vp" });
      return;
    }

    await Recipe.findOne({ where: { vp } }).then((recipe) => {
      if (!recipe) {
        res.status(404).send({ message: "Recipe not found" });
      } else {
        res.json(recipe);
      }
    });
  }

  async retrieveById(req, res) {
    const { recipe_id } = req.query;

    if (!recipe_id) {
      res.status(400).send({ message: "Missing recipe ID" });
      return;
    }

    await Recipe.findOne({ where: { recipe_id } }).then((recipe) => {
      if (!recipe) {
        res.status(404).send({ message: "Recipe not found" });
      } else {
        res.json(recipe);
      }
    });
  }

  /**
   * Update a recipe in the database
   * @param {*} req
   * @param {*} res
   * @returns { Recipe }
   * @example /api/recipe/update?recipe_id=1
   */
  async update(req, res) {
    const { recipe_id } = req.query;
    const updatedRecipe = req.body;

    if (!recipe_id) {
      res.status(400).send({ message: "Missing recipe ID" });
      return;
    }

    if (!updatedRecipe) {
      res.status(400).send({ message: "Missing updated recipe" });
      return;
    }

    await Recipe.update(updatedRecipe, {
      where: { recipe_id: recipe_id },
    }).then(() => {
      res.json(updatedRecipe);
    });
  }

  /**
   * Delete a recipe from the database
   * @param {*} req
   * @param {*} res
   * @returns { json } message - Recipe deleted
   * @example /api/recipe/delete?recipe_id=1
   */
  async delete(req, res) {
    const { recipe_id } = req.query;

    if (!recipe_id) {
      res.status(400).send({ message: "Missing recipe ID" });
      return;
    }

    await Recipe.destroy({ where: { recipe_id } }).then(() => {
      res.json({ message: "Recipe deleted" });
    });
  }
}

module.exports = { RecipeController };
