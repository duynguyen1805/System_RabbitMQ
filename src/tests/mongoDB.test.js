"use strict";

const mongoose = require("mongoose");

const connectString = "mongodb://localhost:27017/ecommerce";

const TestSchema = new mongoose.Schema({
  name: String,
});

const TestMongoDB = mongoose.model("TestMongoDB", TestSchema);

describe("Mongoose Connection", () => {
  let connection;

  beforeAll(async () => {
    connection = await mongoose.connect(connectString);
  });

  afterAll(async () => {
    // await mongoose.connection.close();
    await connection.disconnect();
  });

  // check status mongoose
  it("Should connect to successful MongoDB", async () => {
    expect(mongoose.connection.readyState).toBe(1); // 1 is success
  });

  it("Should create a new document", async () => {
    const result = await TestMongoDB.create({ name: "Test" });
    expect(result.isNew).toBe(false); // đã tạo thành công thì isNew trả về false
  });

  it("Find a document to the database", async () => {
    const result = await TestMongoDB.findOne({ name: "Test" });
    expect(result).toBeDefined();
    expect(result.name).toBe("Test");
  });
});
