const { Router } = require("express");
const Activity = require("../models/activity.model.js");

class ActivityController {
  constructor() {
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
    const newActivity = req.body;

    if (!newActivity) res.status(400).send("Missing activity");

    const activity = new Activity(newActivity);

    await activity.save().then(() => {
      res.json(activity);
    });
  }

  async all(req, res) {
    await Activity.findAll({ order: [["activity_id", "ASC"]] }).then(
      (activities) => {
        res.json(activities);
      }
    );
  }

  async retrieve(req, res) {
    const id = req.query["activity_id"];

    if (!id) res.status(400).send("Missing activity id");

    await Activity.findOne({ where: { activity_id: id } }).then((activity) => {
      res.json(activity);
    });
  }

  async update(req, res) {
    const id = req.body["activity_id"];
    const activityToUpdate = req.body;

    if (!id) res.status(400).send("Missing activity id");

    if (!activityToUpdate) res.status(400).send("Missing activity");

    await Activity.findOne({ where: { activity_id: id } }).then((activity) => {
      if (!activity) {
        res.status(404).send("Activity not found");
      } else {
        activity.update(activityToUpdate).then(() => {
          res.json(activity);
        });
      }
    });
  }

  async delete(req, res) {
    const id = req.query["activity_id"];

    if (!id) res.status(400).send({ message: "Missing activity id" });

    await Activity.destroy({ where: { activity_id: id } }).then(() => {
      res.status(200).send({ message: "Activity deleted" });
    });
  }
}

module.exports = { ActivityController };
