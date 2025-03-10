const { Router } = require("express");
const { Op } = require("sequelize");
const Operation = require("../models/operation.model.js");

/**
 * Operations controller
 */
class OperationController {
  constructor(io) {
    this.io = io;
    this.router = Router();
    this.router.post("/create", this.create.bind(this));
    this.router.get("/all", this.all.bind(this));
    this.router.get("/amount_operations", this.amount_operations.bind(this));
    this.router.get("/paginated", this.paginated_operations.bind(this));
    this.router.get("/one", this.retrieveById.bind(this));
    this.router.get("/amount", this.retrieveLastOperationsByAmount.bind(this));
    this.router.get("/operator", this.retrieveByOperator.bind(this));
    this.router.get("/recipe", this.retrieveByRecipe.bind(this));
    this.router.get("/date_interval", this.retrieveByDateInterval.bind(this));
    this.router.put("/update", this.update.bind(this));
    this.router.delete("/delete", this.delete.bind(this));
  }

  /**
   * Return the router
   * @returns { Router }
   */
  getRouter() {
    return this.router;
  }

  /**
   * Create a new operation
   * @param {*} req
   * @param {*} res
   * @param { Operation } req.body
   * @returns { Operation }
   * @example /api/operation/create
   */
  async create(req, res) {
    const newOperation = req.body;

    if (!newOperation) {
      res.status(400).send("Missing operation");
      return;
    }

    const operation = new Operation(newOperation);

    await operation.save().then(() => {
      res.json(operation);
    });
  }

  /**
   * Return all operations
   * @param {*} req
   * @param {*} res
   * @returns { Operation[] }
   * @example /api/operation/all
   */
  async all(req, res) {
    await Operation.findAll().then((operations) => {
      res.json(operations);
    });
  }

  //  /**
  //  * Return a number of operations
  //  * @param {*} req
  //  * @param {*} res
  //  * @returns { number }
  //  * @example /api/operation/amount_operations
  //  */
  // async amount_operations(req, res) {
  //   const [result] = await db.query('SELECT COUNT(*) as total FROM operations');
  //   res.json(result.total);
  // }

  // /**
  //  * Return paginated operations
  //  * @param {*} req
  //  * @param {*} res
  //  * @returns { Operation[] }
  //  * @example /api/operation/paginated?page=1&limit=9
  //  */
  // async paginated_operations(req, res) {
  //   const page = req.query.page;
  //   const limit = req.query.limit;
  //   const offset = (page - 1) * limit;

  //   const operations = await Operation.findAll({
  //     offset: offset,
  //     limit: limit,
  //     order: [['StartTime', 'DESC']]
  //   });
  //   res.json(operations);
  // }
  /**
   * Return an operation by id
   * @param {*} req
   * @param {*} res
   * @returns { Operation }
   * @example /api/operation/one?operation_id=1
   */
  async retrieveById(req, res) {
    const id = req.query["operation_id"];

    if (!id) res.status(400).send("Missing operation_id");

    await Operation.findOne({ where: { operation_id: id } }).then((operation) => {
      res.json(operation);
    });
  }

  /**
   * Return operations by specific amount
   * @param {*} req
   * @param {*} res
   * @returns { Operation[] }
   * @example /api/operation/amount?amount=5
   */
  async retrieveLastOperationsByAmount(req, res) {
    const amountRequested = req.query["amount"];

    if (!amountRequested) res.status(400).send("Missing amount");

    await Operation.findAll({
      order: [["createdAt", "DESC"]],
      limit: amountRequested,
    }).then((operations) => {
      res.json(operations);
    });
  }

  /**
   * Return an operation by operator's badge number
   * @param {*} req
   * @param {*} res
   * @returns { Operation[] }
   * @example /api/operation/operator?badge_number=123456
   */
  async retrieveByOperator(req, res) {
    const badgeNumber = req.query["badge_number"];

    if (!badgeNumber) res.status(400).send("Missing badge_number");

    await Operation.findOne({ where: { badge_number: badgeNumber } }).then((operation) => {
      res.json(operation);
    });
  }

  /**
   * Return an operation by recipe code
   * @param {*} req
   * @param {*} res
   * @returns { Operation[] }
   */
  retrieveByRecipe(req, res) {
    const recipeId = req.query["recipe_id"];

    if (!recipeId) res.status(400).send("Missing recipe_id");

    Operation.findAll({ where: { recipe: recipeId } }).then(
      (operations) => {
        res.json(operations);
      }
    );
  }

  /**
   * Return an operation by date interval
   * @param {*} req
   * @param {*} res
   * @returns { Operation[] }
   * @example /api/operation/date_interval?from=2021-01-01&to=2021-01-31
   */
  retrieveByDateInterval(req, res) {
    const from = req.query["from"];
    const to = req.query["to"];

    if (!from || !to) res.status(400).send("Missing date interval");

    Operation.findAll({
      where: {
        createdAt: {
          [Op.between]: [from, to],
        },
      },
      order: [["createdAt", "DESC"]],
    }).then((operations) => {
      res.json(operations);
    });
  }

  /**
   * Update an operation
   * @param {*} req
   * @param {*} res
   */
  async update(req, res) {
    const id = req.body["operation_id"];
    const operationToUpdate = req.body;

    if (!id) res.status(400).send("Missing operation_id");

    if (!operationToUpdate) res.status(400).send("Missing operation");

    await Operation.findOne({ where: { operation_id: id } }).then((operation) => {
      if (!operation) {
        res.status(404).send("Operation not found");
      } else {
        operation.update(operationToUpdate).then(() => {
          res.json(operationToUpdate);
        });
      }
    });
  }

  /**
   * Delete an operation
   * @param {*} req
   * @param {*} res
   */
  async delete(req, res) {
    const id = req.query["operation_id"];

    if (!id) res.status(400).send("Missing operation_id");

    await Operation.findOne({ where: { operation_id: id } }).then((operation) => {
      if (!operation) {
        res.status(404).send("Operation not found");
      } else {
        operation.destroy().then(() => {
          res.json(operation);
        });
      }
    });
  }
}

module.exports = { OperationController: OperationController };
