const { Router } = require("express");
const User = require("../models/user.model.js");

class UsersController {
  constructor(io) {
    this.io = io;
    this.router = Router();
    this.router.post("/create", this.create.bind(this));
    this.router.post("/authenticate", this.authenticate.bind(this));
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

  async authenticate(req, res) {
    console.log("Authenticating user");
    const { badgeNumber} = req.body;
    console.log(req.body);

    if (!badgeNumber) {
      res.status(400).send("Missing badge number");
      console.log("Missing badge number");
      return;
    }

    await User.findOne({ where: { badge_number: badgeNumber } }).then(
      (user) => {
        if (!user) {
          res.status(404).send("User not found");
          console.log("User not found");
        } else {
          res.json(user);
          this.io.emit("userAuthenticated", user);
          console.log("User authenticated");
        }
      }
    );
  };

  async all(req, res) {
    try {
      await User.findAll().then((users) => {
        res.json(users);
      });
      console.log("Users retrieved successfully");
    } catch (error) {
      res.status(500).send("Error retrieving users");
      console.error(error);
    }
  }

  async retrieve(req, res) {
    const user_id = req.query["user_id"];

    if (!user_id) res.status(400).send("Missing user id");

    await User.findOne({ where: { id: user_id } }).then((user) => {
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
    const user_id = req.body["id"];
    const userToUpdate = req.body;

    if (!user_id) res.status(400).send("Missing user id");

    if (!userToUpdate) res.status(400).send("Missing user");

    await User.findOne({ where: { id: user_id } }).then((user) => {
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
    const user_id = req.query["user_id"];

    if (!user_id) res.status(400).send("Missing user id");

    await User.findOne({ where: { id: user_id } }).then((user) => {
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
