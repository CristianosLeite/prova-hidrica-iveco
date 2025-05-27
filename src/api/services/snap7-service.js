const snap7 = require("node-snap7");

/**
 * Snap7Service
 * @description :: Server-side logic for managing Snap7
 */
class Snap7Service {
  constructor(io, client = new snap7.S7Client()) {
    this.io = io;
    this.client = client;
  }

  /**
   * @description :: Create a new Snap7 client and connect to the PLC
   */

  /**
   * Connect to the PLC
   * @param ip
   */
  async plcConnect(ip, retries = 3, delay = 5000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await new Promise((resolve, reject) => {
          this.client.ConnectTo(ip, 0, 1, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        console.log(" >> Connected to PLC");
        return;
      } catch (err) {
        console.error(`Connection attempt ${attempt} failed:`, err);
        if (attempt < retries)
          await new Promise((res) => setTimeout(res, delay));
      }
    }
    throw new Error("Failed to connect to PLC after multiple attempts");
  }

  /**
   * @description :: Check if the client is connected to the PLC
   */
  async isPlcConnected() {
    try {
      // Attempt to read a known value from the PLC
      const result = await this.readBooleanFromDb(7, 4, 4); // DB7, byte 4, bit 4
      return result.value !== undefined; // If we can read the value, the PLC is connected
    } catch (error) {
      console.error("Error checking PLC connection:", error);
      return false; // If an error occurs, assume the PLC is offline
    }
  }

  /**
   * Monitor the PLC connection status and attempt reconnection if disconnected
   */
  startConnectionMonitor(interval = 5000) {
    setInterval(async () => {
      try {
        if (!(await this.isPlcConnected())) {
          console.warn("PLC connection lost. Attempting to reconnect...");
          await this.plcConnect("192.168.0.1");
          console.log("Reconnected to PLC successfully.");
          return;
        }
      } catch (error) {
        console.error("Error during PLC reconnection attempt:", error);
        return;
      }
    }, interval);
    console.log("PLC connection is active.");
  }

  /**
   * @description :: Read a boolean value from the PLC
   * @param {number} dbNumber - The DB number
   * @param {number} byte - The byte number
   * @param {number} bit - The bit number
   * @returns {Promise} - The boolean value
   */
  async readBooleanFromDb(dbNumber, byte, bit) {
    try {
      return new Promise((resolve, reject) => {
        this.client.DBRead(dbNumber, byte, 1, function (err, res) {
          // Alterado para arrow function
          if (err) {
            console.log(
              " >> DBRead failed. Code #" +
                err +
                " - " +
                this.client.ErrorText(err)
            );
            return reject(err);
          }
          const value = (res[0] >> bit) & 1;
          resolve({ value });
        });
      });
    } catch (error) {
      console.error("Error in readBooleanFromDb:", error);
      throw error; // Rejects to let the caller handle the error.
    }
  }

  /**
   * Read a word value from the PLC
   * @param dbNumber
   * @param byte
   * @returns
   */
  async readWordFromDb(dbNumber, byte) {
    if (!(await this.isPlcConnected())) {
      throw new Error("PLC client is not connected");
    }
    return new Promise((resolve, reject) => {
      this.client.DBRead(dbNumber, byte, 2, function (err, res) {
        if (err) {
          console.log(
            " >> DBRead failed. Code #" +
              err +
              " - " +
              this.client.ErrorText(err)
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
  async readWordFromMemory(byte) {
    if (!(await this.isPlcConnected())) {
      throw new Error("PLC client is not connected");
    }
    return new Promise((resolve, reject) => {
      this.client.MBRead(byte, 2, function (err, res) {
        if (err) {
          console.log(
            " >> MBRead failed. Code #" +
              err +
              " - " +
              this.client.ErrorText(err)
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
  async readStringFromDb(dbNumber, start, length) {
    if (!(await this.isPlcConnected())) {
      throw new Error("PLC client is not connected");
    }
    return new Promise((resolve, reject) => {
      this.client.DBRead(dbNumber, start, length + 2, function (err, res) {
        if (err) {
          console.log(
            " >> DBRead failed. Code #" +
              err +
              " - " +
              this.client.ErrorText(err)
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
    if (!(await this.isPlcConnected())) {
      throw new Error("PLC client is not connected");
    }
    try {
      const buf = Buffer.alloc(1);
      let byteValue = await new Promise((resolve, reject) => {
        this.client.DBRead(dbNumber, start, 1, (err, res) => {
          if (err) reject(err);
          else resolve(res.readUInt8(0));
        });
      });

      byteValue = value ? byteValue |= 1 << bit : byteValue &= ~(1 << bit);
      buf.writeUInt8(byteValue, 0);

      await new Promise((resolve, reject) => {
        this.client.WriteArea(
          this.client.S7AreaDB,
          dbNumber,
          start,
          1,
          this.client.S7WLByte,
          buf,
          (err) => (err ? reject(err) : resolve())
        );
      });
    } catch (err) {
      console.error("Error in writeBooleanToDb:", err);
      throw err; // Rejects to let the caller handle the error.
    }
  }

  /**
   * Write a integer value to the PLC
   * @param dbNumber
   * @param start
   * @param value
   * @returns
   */
  async writeIntegerToDb(dbNumber, start, value) {
    if (!(await this.isPlcConnected())) {
      throw new Error("PLC client is not connected");
    }
    if (
      typeof dbNumber !== "number" ||
      typeof start !== "number" ||
      typeof value !== "number"
    ) {
      throw new Error(
        "Invalid parameters: dbNumber, start, and value must be numbers"
      );
    }

    const buf = Buffer.alloc(2);
    buf.writeUInt16BE(value, 0);

    try {
      await new Promise((resolve, reject) => {
        this.client.WriteArea(
          this.client.S7AreaDB,
          dbNumber,
          start,
          2,
          this.client.S7WLWord,
          buf,
          (err) => (err ? reject(err) : resolve())
        );
      });
    } catch (err) {
      console.error("Error in writeIntegerToDb:", err);
      throw err;
    }
  }
}

module.exports = { Snap7Service };
