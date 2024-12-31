const { Router } = require("express");
const Settings = require("../models/settings.model.js");

class SettingsController {
  constructor() {
    this.router = Router();
    this.router.post("/server", this.saveServerSettings.bind(this));
    this.router.get("/server", this.getServerSettings.bind(this));
    this.router.post("/preferences", this.savePreferences.bind(this));
    this.router.get("/preferences", this.getPreferences.bind(this));
  }

  getRouter() {
    return this.router;
  }

  async saveServerSettings(req, res) {
    const { user_id, ip, port } = req.body;

    if (!user_id || !ip || !port) {
      res.status(400).send("Missing user_id, ip or port");
      return;
    }

    const settings = await Settings.findOne({ where: { user_id } });

    if (settings) {
      settings.ip = ip;
      settings.port = port;
      await settings.save();
    } else {
      await Settings.create({ user_id, ip, port });
    }

    res.json({ user_id, ip, port });
  }

  async getServerSettings(req, res) {
    const user_id = req.query["user_id"];

    if (!user_id) {
      res.status(400).send("Missing user_id");
      return;
    }

    const settings = await Settings.findOne({ where: { user_id } });

    if (!settings) {
      res.status(404).send("Settings not found");
      return;
    }

    res.json(settings);
  }

  async savePreferences(req, res) {
    const { user_id, darkMode, notifications } = req.body;

    if (!user_id || darkMode === undefined || notifications === undefined) {
      res.status(400).send("Missing user_id, darkMode or notifications");
      return;
    }

    const settings = await Settings.findOne({ where: { user_id } });

    if (settings) {
      settings.darkMode = darkMode;
      settings.notifications = notifications;
      await settings.save();
    } else {
      await Settings.create({ user_id, darkMode, notifications });
    }

    res.json({ user_id, darkMode, notifications });
  }

  async getPreferences(req, res) {
    const user_id = req.query["user_id"];

    if (!user_id) {
      res.status(400).send("Missing user_id");
      return;
    }

    const settings = await Settings.findOne({ where: { user_id } });

    if (!settings) {
      res.status(404).send("Settings not found");
      return;
    }

    res.json(settings);
  }
}

module.exports = { SettingsController };
