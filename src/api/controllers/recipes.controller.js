const { Router } = require("express");
const Recipe = require("../models/recipe.model.js");

class RecipeController {
  constructor(io) {
    this.io = io;
    this.router = Router();
    this.router.post("/create", this.create.bind(this));
    this.router.get("/all", this.all.bind(this));
    this.router.get("/one", this.retrieve.bind(this));
    this.router.put("/update", this.update.bind(this));
    this.router.delete("/delete", this.delete.bind(this));
  }

  getRouter() {
    return this.router;
  }

  async create(req, res) {
    const newRecipe = req.body;

    if (!newRecipe) {
      res.status(400).send("Missing recipe");
      return;
    }

    const recipe = new Recipe(newRecipe);

    await recipe.save().then(() => {
      res.json(recipe);
    });
  }

  async all(req, res) {
    await Recipe.findAll().then((recipes) => {
      res.json(recipes);
    });
  }

  async retrieve(req, res) {
    const { vp } = req.query;

    if (!vp) {
      res.status(400).send("Missing vp");
      return;
    }

    await Recipe.findOne({ where: { vp } }).then((recipe) => {
      if (!recipe) {
        res.status(404).send("Recipe not found");
      } else {
        res.json(recipe);
      }
    });
  }

  async update(req, res) {
    const updatedRecipe = req.body;

    if (!updatedRecipe) {
      res.status(400).send("Missing updated recipe");
      return;
    }

    await Recipe.update(updatedRecipe, {
      where: { recipe_id: updatedRecipe.recipe_id },
    }).then(() => {
      res.json(updatedRecipe);
    });
  }

  async delete(req, res) {
    const { recipe_id } = req.query;

    if (!recipe_id) {
      res.status(400).send("Missing recipe ID");
      return;
    }

    await Recipe.destroy({ where: { recipe_id } }).then(() => {
      res.json({ recipe_id });
    });
  }
}

module.exports = { RecipeController };
