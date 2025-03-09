const { Router } = require("express");
const User = require("../models/user.model.js");

/**
 * Users controller
 */
class UsersController {
  constructor(io) {
    this.io = io;
    this.router = Router();
    this.router.post("/create", this.create.bind(this));
    this.router.post("/authenticate", this.authenticate.bind(this));
    this.router.get("/all", this.all.bind(this));
    this.router.get("/id", this.retrieveById.bind(this));
    this.router.get("/badge", this.retrieveByBadgeNumber.bind(this));
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
   * Create a new user in the database
   * @param {*} req
   * @param {*} res
   * @param { User } req.body
   * @returns { User } The created user
   * @example /api/user/create
   */
  async create(req, res) {
    const newUser = req.body;

    if (!newUser) {
      res.status(400).send({ message: "Missing user" });
      return;
    }

    const user = new User(newUser);

    await user.save().then(() => {
      res.json(user);
    });
  }

  /**
   * Find a user by badge number and emit the userAuthenticated event
   * @param {*} req
   * @param {*} res
   * @param { string } req.body.badgeNumber
   * @returns { User } The authenticated user
   * @example /api/user/authenticate
   */
  async authenticate(req, res) {
    const { badgeNumber } = req.body;

    if (!badgeNumber) {
      res.status(400).send({ message: "Missing badge number" });
      return;
    }

    await User.findOne({ where: { badge_number: badgeNumber } }).then(
      (user) => {
        if (!user) {
          res.status(404).send({ message: "User not found" });
        } else {
          res.json(user);
          this.io.emit("userAuthenticated", user);
        }
      }
    );
  }

  /**
   * Retrieve all users from the database
   * @param {*} req
   * @param {*} res
   * @returns { User[] } All users
   * @example /api/user/all
   */
  async all(req, res) {
    try {
      await User.findAll().then((users) => {
        res.json(users);
      });
    } catch (error) {
      res.status(500).send({ message: "Error retrieving users" });
      console.error(error);
    }
  }

  /**
   * Retrieve a user by id
   * @param {*} req
   * @param {*} res
   * @param { string } req.query.user_id
   * @returns { User } The user with the given id
   * @example /api/user/id?user_id=1
   */
  async retrieveById(req, res) {
    const user_id = req.query["user_id"];

    if (!user_id) return res.status(400).send({ message: "Missing user id" });

    await User.findOne({ where: { id: user_id } }).then((user) => {
      res.json(user);
    });
  }

  /**
   * Retrieve a user by badge number
   * @param {*} req
   * @param {*} res
   * @returns { User } The user with the given badge number
   * @example /api/user/badge?badge_number=123456
   */
  async retrieveByBadgeNumber(req, res) {
    const badgeNumber = req.query["badge_number"];

    if (!badgeNumber)
      return res.status(400).send({ message: "Missing badge_number" });

    await User.findOne({ where: { badge_number: badgeNumber } }).then(
      (user) => {
        res.json(user);
      }
    );
  }

  /**
   * Update a user in the database
   * @param {*} req
   * @param {*} res
   * @param { User } req.body
   * @param { string } req.query.user_id
   * @returns { User } The updated user
   * @example /api/user/update?user_id=1
   */
  async update(req, res) {
    const user_id = req.query["user_id"];
    const userToUpdate = req.body;

    if (!user_id) return res.status(400).send({ message: "Missing user id" });

    if (!userToUpdate)
      return res.status(404).send({ message: "Missing user object" });

    await User.findOne({ where: { id: user_id } }).then((user) => {
      if (!user) {
        res.status(404).send({ message: "User not found" });
      } else {
        user.update(userToUpdate).then(() => {
          res.json(userToUpdate);
        });
      }
    });
  }

  /**
   * Delete a user from the database
   * @param {*} req
   * @param {*} res
   * @param { string } req.query.user_id
   * @returns { User } The deleted user
   * @example /api/user/delete?user
   */
  async delete(req, res) {
    const user_id = req.query["user_id"];

    if (!user_id) return res.status(400).send({ message: "Missing user id" });

    await User.findOne({ where: { id: user_id } }).then((user) => {
      if (!user) {
        res.status(404).send({ message: "User not found" });
      } else {
        user.destroy().then(() => {
          res.json(user);
        });
      }
    });
  }
}

module.exports = { UsersController };
