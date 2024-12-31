const { Router } = require("express");
const User = require("../models/user.model.js");

class UsersController {
  constructor() {
    this.router = Router();
    this.router.post("/create", this.create.bind(this));
    this.router.get("/all", this.all.bind(this));
    this.router.get("/one", this.retrieve.bind(this));
    this.router.get("/badge", this.retrieveByBadgeNumber.bind(this));
    this.router.put("/update", this.update.bind(this));
    this.router.delete("/delete", this.delete.bind(this));
  }

  getRouter() {
    return this.router;
  }

  async create(req, res) {
    const newUser = req.body;

    if (!newUser) {
      res.status(400).send("Missing user");
      return;
    }

    const user = new User(newUser);

    await user.save().then(() => {
      res.json(user);
    });
  }

  async all(req, res) {
    await User.findAll().then((users) => {
      res.json(users);
    });
  }

  async retrieve(req, res) {
    const id = req.query["user_id"];

    if (!id) res.status(400).send("Missing user_id");

    await User.findOne({ where: { user_id: id } }).then((user) => {
      res.json(user);
    });
  }

  async retrieveByBadgeNumber(req, res) {
    const badgeNumber = req.query["badge_number"];

    if (!badgeNumber) res.status(400).send("Missing badge_number");

    await User.findOne({ where: { badge_number: badgeNumber } }).then(
      (user) => {
        res.json(user);
      }
    );
  }

  async update(req, res) {
    const id = req.body["user_id"];
    const userToUpdate = req.body;

    if (!id) res.status(400).send("Missing user id");

    if (!userToUpdate) res.status(400).send("Missing user");

    await User.findOne({ where: { user_id: id } }).then((user) => {
      if (!user) {
        res.status(404).send("User not found");
      } else {
        user.update(userToUpdate).then(() => {
          res.json(userToUpdate);
        });
      }
    });
  }

  async delete(req, res) {
    const id = req.query["user_id"];

    if (!id) res.status(400).send("Missing user id");

    await User.findOne({ where: { user_id: id } }).then((user) => {
      if (!user) {
        res.status(404).send("User not found");
      } else {
        user.destroy().then(() => {
          res.json(user);
        });
      }
    });
  }
}

module.exports = { UsersController };
