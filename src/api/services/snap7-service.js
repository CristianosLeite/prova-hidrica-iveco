const snap7 = require("node-snap7");
const Operation = require("../models/operation.model.js");
const s7client = new snap7.S7Client();

/**
 * Snap7Service
 * @description :: Server-side logic for managing Snap7
 */

class Snap7Service {
  constructor(io) {
    this.io = io;
  }

  /**
   * @description :: Create a new Snap7 client and connect to the PLC
   */

  /**
   * Connect to the PLC
   * @param ip
   */
  async plcConnect(ip) {
    return new Promise((resolve, reject) => {
      s7client.ConnectTo(ip, 0, 1, function (err) {
        if (err) {
          console.log(
            " >> Connection failed. Code #" +
              err +
              " - " +
              s7client.ErrorText(err)
          );
          return reject(err);
        }

        console.log(" >> Connected");
        resolve();
      });
    });
  }

  /**
   * @description :: Check if the client is connected to the PLC
   */
  isPlcConnected() {
    return s7client.Connected();
  }

  /**
   * @description :: Read a boolean value from the PLC
   * @param {number} dbNumber - The DB number
   * @param {number} byte - The byte number
   * @param {number} bit - The bit number
   * @returns {Promise} - The boolean value
   */
  readBooleanFromDb(dbNumber, byte, bit) {
    return new Promise((resolve, reject) => {
      s7client.DBRead(dbNumber, byte, 1, function (err, res) {
        if (err) {
          console.log(
            " >> DBRead failed. Code #" + err + " - " + s7client.ErrorText(err)
          );
          return reject(err);
        }
        const value = (res[0] >> bit) & 1;
        resolve({ value });
      });
    });
  }

  /**
   * Read a boolean value from the PLC
   * @param byte
   * @param bit
   * @returns
   */
  readBooleanFromMemory(byte, bit) {
    return new Promise((resolve, reject) => {
      s7client.MBRead(byte, 1, function (err, res) {
        if (err) {
          console.log(
            " >> MBRead failed. Code #" + err + " - " + s7client.ErrorText(err)
          );
          return reject(err);
        }
        const value = (res[0] >> bit) & 1;
        resolve({ value });
      });
    });
  }

  /**
   * Read a word value from the PLC
   * @param dbNumber
   * @param byte
   * @returns
   */
  readWordFromDb(dbNumber, byte) {
    return new Promise((resolve, reject) => {
      s7client.DBRead(dbNumber, byte, 2, function (err, res) {
        if (err) {
          console.log(
            " >> DBRead failed. Code #" + err + " - " + s7client.ErrorText(err)
          );
          return reject(err);
        }
        const value = res.readUInt16BE(0);
        resolve({ value });
      });
    });
  }

  /**
   * Read a word value from the PLC
   * @param byte
   * @returns
   */
  readWordFromMemory(byte) {
    return new Promise((resolve, reject) => {
      s7client.MBRead(byte, 2, function (err, res) {
        if (err) {
          console.log(
            " >> MBRead failed. Code #" + err + " - " + s7client.ErrorText(err)
          );
          return reject(err);
        }
        const value = res.readUInt16BE(0);
        resolve({ value });
      });
    });
  }

  /**
   * Read a string value from the PLC
   * @param dbNumber
   * @param start
   * @param length
   * @returns
   */
  readStringFromDb(dbNumber, start, length) {
    return new Promise((resolve, reject) => {
      s7client.DBRead(dbNumber, start, length + 2, function (err, res) {
        if (err) {
          console.log(
            " >> DBRead failed. Code #" + err + " - " + s7client.ErrorText(err)
          );
          return reject(err);
        }
        // Remove non-printable characters and trim whitespace
        const value = res
          .toString("utf8")
          .replace(/[^\x20-\x7E]/g, "")
          .trim();
        resolve({ value });
      });
    });
  }

  /**
   * Write a boolean value to the PLC
   * @param dbNumber
   * @param byte
   * @param bit
   * @param value
   * @returns
   */
  async writeBooleanToDb(dbNumber, start, bit, value) {
    const buf = Buffer.alloc(1);
    let byteValue = await new Promise((resolve, reject) => {
      s7client.DBRead(dbNumber, start, 1, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.readUInt8(0));
        }
      });
    }).catch((err) => {
      console.log("Error reading byte:", err);
      throw err;
    });

    if (value) {
      byteValue |= 1 << bit;
    } else {
      byteValue &= ~(1 << bit);
    }

    buf.writeUInt8(byteValue, 0);

    return new Promise((resolve, reject) => {
      s7client.WriteArea(
        s7client.S7AreaDB,
        dbNumber,
        start,
        1,
        s7client.S7WLByte,
        buf,
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    }).catch((err) => {
      console.log("Error writing byte:", err);
      throw err;
    });
  }

  /**
   * Write a integer value to the PLC
   * @param dbNumber
   * @param start
   * @param value
   * @returns
   */
  async writeIntegerToDb(dbNumber, start, value) {
    const buf = Buffer.alloc(2);
    buf.writeUInt16BE(value, 0);

    return new Promise((resolve, reject) => {
      s7client.WriteArea(
        s7client.S7AreaDB,
        dbNumber,
        start,
        2,
        s7client.S7WLWord,
        buf,
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    }).catch((err) => {
      console.log("Error writing integer:", err);
      throw err;
    });
  }

  /**
   * Trigger for creating a new operation on database
   */
  async listenAndProcess() {
    while (true) {
      const { value } = await readBoolean(26, 120, 0);
      if (value === 1) {
        const isSensorInPosition1 = (await this.readBooleanFromMemory(11, 7)).value;
        const isSensorInPosition2 = (await this.readBooleanFromMemory(12, 0)).value;
        const isSensorInPosition3 = (await this.readBooleanFromMemory(12, 1)).value;

        try {
          if (isSensorInPosition1 || isSensorInPosition2 || isSensorInPosition3) {
            await this.writeBooleanToDb(7, 1, 0, false);
          }
        } catch (error) {
          console.log("Error reading sensor values:", error);
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 second
    }
  }
}

module.exports = { Snap7Service };
