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
   * @param retries
   * @param delay
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
    this.io.emit("shutdown");
    throw new Error("Failed to connect to PLC after multiple attempts");
  }

  /**
   * @description :: Check if the client is connected to the PLC
   */
  async isPlcConnected() {
    // Se está em modo mock, considere conectado
    if (this.connected && this.mockTimer) {
      return true;
    }

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
          this.io.emit("mainPlcConnectionChanged", "RECONNECTED");
          return;
        }
      } catch (error) {
        console.error("Error during PLC reconnection attempt:", error);
        this.io.emit("mainPlcConnectionChanged", "DISCONNECTED");
        return;
      }
    }, interval);
    console.log("PLC connection is active.");
    this.io.emit("mainPlcConnectionChanged", "CONNECTED");
  }

  /**
   * @description :: Read a boolean value from the PLC
   * @param {number} dbNumber - The DB number
   * @param {number} byte - The byte number
   * @param {number} bit - The bit number
   * @returns {Promise} - The boolean value
   */
  async readBooleanFromDb(dbNumber, byte, bit) {
    if (this.isPlcMock()) {
      return this.useMockData("readBoolean", dbNumber, byte, bit);
    }

    try {
      return new Promise((resolve, reject) => {
        this.client.DBRead(dbNumber, byte, 1, (err, res) => {
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
    if (this.isPlcMock()) {
      return this.useMockData("readWord", dbNumber, byte);
    }

    if (!(await this.isPlcConnected())) {
      throw new Error("PLC client is not connected");
    }

    const self = this;
    return new Promise((resolve, reject) => {
      this.client.DBRead(dbNumber, byte, 2, (err, res) => {
        if (err) {
          console.log(
            " >> DBRead failed. Code #" +
              err +
              " - " +
              self.client.ErrorText(err)
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
    if (this.isPlcMock()) {
      return this.useMockData("readWord", 7, byte);
    }

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
   * Write a boolean value to the PLC
   * @param dbNumber
   * @param byte
   * @param bit
   * @param value
   * @returns
   */
  async writeBooleanToDb(dbNumber, start, bit, value) {
    if (this.isPlcMock()) {
      return this.useMockData("writeBoolean", dbNumber, start, bit, value);
    }

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

      byteValue = value ? (byteValue |= 1 << bit) : (byteValue &= ~(1 << bit));
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
    if (this.isPlcMock()) {
      return this.useMockData("writeWord", dbNumber, start, null, value);
    }

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

  // Mock connection for development purposes
  mockConnection() {
    console.log("Using mock PLC connection");
    this.connected = true;

    // Initialize the mockData object before using it
    this.mockData = {
      db7: {
        bytes: new Array(100).fill(0), // Simulate 100 bytes of data
        getBit: (byte, bit) => (this.mockData.db7.bytes[byte] >> bit) & 1,
        setBit: (byte, bit, value) => {
          if (value) {
            this.mockData.db7.bytes[byte] |= 1 << bit;
          } else {
            this.mockData.db7.bytes[byte] &= ~(1 << bit);
          }
        },
        setWord: (byte, value) => {
          this.mockData.db7.bytes[byte] = value & 0xff;
          this.mockData.db7.bytes[byte + 1] = (value >> 8) & 0xff;
        },
        getWord: (byte) => {
          return (
            (this.mockData.db7.bytes[byte + 1] << 8) |
            this.mockData.db7.bytes[byte]
          );
        },
      },
    };

    // Configure client mock methods
    this.client.DBRead = (dbNumber, byte, size, callback) => {
      if (dbNumber === 7) {
        const buffer = Buffer.from(
          this.mockData.db7.bytes.slice(byte, byte + size)
        );
        callback(null, buffer);
      } else {
        callback("DB not supported in mock mode", null);
      }
    };

    // Configure client mock methods for WriteArea
    this.client.WriteArea = (
      area,
      dbNumber,
      start,
      size,
      wordLen,
      buffer,
      callback
    ) => {
      // Simulate writing to DB7
      callback(null);
    };

    // Simulate PLC data with periodic updates
    this.mockTimer = setInterval(() => {
      // Emit mock data through socket.io
      this.io.emit("plcStatus", {
        connected: true,
        status: "MOCK_CONNECTED",
        mockData: {
          timestamp: new Date().toISOString(),
          db7: {
            sprinklerHeight: this.mockData.db7.getWord(2),
            platformActive: this.mockData.db7.getBit(4, 1),
            autoEnabled: this.mockData.db7.getBit(0, 0),
          },
        },
      });
    }, 2000);

    return true;
  }

  isPlcMock() {
    return this.mockTimer !== undefined && this.connected === true;
  }

  useMockData(operation, dbNumber, start, bit, value) {
    switch (operation) {
      case "readBoolean":
        return this.mockData.db7.getBit(start, bit);
      case "readWord":
        return this.mockData.db7.getWord(start);
      case "writeBoolean":
        this.mockData.db7.setBit(start, bit, value);
        console.log(`MOCK: Set DB${dbNumber}.DBX${start}.${bit} = ${value}`);
        return;
      case "writeWord":
        this.mockData.db7.setWord(start, value);
        console.log(`MOCK: Set DB${dbNumber}.DBW${start} = ${value}`);
        return;
      default:
        throw new Error("Invalid method for mock data");
    }
  }

  stopMockConnection() {
    if (this.mockTimer) {
      clearInterval(this.mockTimer);
      this.mockTimer = null;
    }
  }
}

module.exports = { Snap7Service };
