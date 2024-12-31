const { Router } = require("express");
const Operation = require("../models/operation.model.js");
const { Op } = require("sequelize");

/**
 * Controller para operações
 */
class OperationController {
  constructor() {
    this.router = Router(); // Cria um objeto de roteamento
    this.router.post("/create", this.create.bind(this));
    this.router.get("/all", this.all.bind(this));
    this.router.get("/one", this.retrieveById.bind(this));
    this.router.get("/partnumber", this.retrieveByPartnumber.bind(this));
    this.router.get("/reg_num", this.retrieveByRegNum.bind(this));
    this.router.get("/status", this.retrieveByStatus.bind(this));
    this.router.get("/recipe", this.retrieveByRecipe.bind(this));
    this.router.get("/date_interval", this.retrieveByDateInterval.bind(this));
    this.router.put("/update", this.update.bind(this));
    this.router.delete("/delete", this.delete.bind(this));
  }

  /**
   * Retorna o roteador
   * @returns { Router }
   */
  getRouter() {
    return this.router;
  }

  /**
   * Salva a operação no banco de dados
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
   * Devolve todas as operações cadastradas no banco de dados
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

  /**
   * Retorna a operação pelo id
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
   * Retorna a operação pelo desenho do motor
   * @param {*} req
   * @param {*} res
   * @returns { Operation[] }
   * @example /api/operation/partnumber?partnumber=123456
   */
  async retrieveByPartnumber(req, res) {
    const partnumber = req.query["partnumber"];

    if (!partnumber) res.status(400).send("Missing partnumber");

    await Operation.findOne({ where: { partnumber: partnumber } }).then(
      (operation) => {
        res.json(operation);
      }
    );
  }

  /**
   * Retorna a operação pelo número de matrícula
   * @param {*} req 
   * @param {*} res
   * @returns { Operation[] }
   * @example /api/operation/reg_num?reg_num=123456
   */
  async retrieveByRegNum(req, res) {
    const regNum = req.query["reg_num"];

    if (!regNum) res.status(400).send("Missing reg_num");

    await Operation.findOne({ where: { reg_num: regNum } }).then((operation) => {
      res.json(operation);
    });
  }

  /**
   * Retorna a operação pelo status
   * @param {*} req 
   * @param {*} res
   * @returns { Operation[] }
   * @example /api/operation/status_ok?status_ok=true
   */
  async retrieveByStatus(req, res) {
    const status = req.query["status_ok"];

    if (!status) res.status(400).send("Missing status_ok");

    await Operation.findAll({ where: { status_ok: status } }).then((operations) => {
      res.json(operations);
    });
  }

  /**
   * Retorna a operação pelo código da receita
   * @param {*} req 
   * @param {*} res
   * @returns { Operation[] }
   */
  retrieveByRecipe(req, res) {
    const recipeCode = req.query["recipe"];

    if (!recipeCode) res.status(400).send("Missing recipe");

    Operation.findAll({ where: { recipe: recipeCode } }).then(
      (operations) => {
        res.json(operations);
      }
    );
  }

  /**
   * Retorna a operação por intervalo de datas
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
   * Atualiza uma operação
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
   * Deleta uma operação
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
