import * as chai from "chai";
const expect = chai.expect;
import * as sinon from "sinon";
import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import User from "../models/user.model.js";

describe("User Controller Tests", () => {
  let mockReq;
  let mockRes;
  let statusStub;
  let jsonStub;
  let findStub;
  let findOneStub;
  let createStub;

  beforeEach(() => {
    mockReq = {
      body: {
        name: "Test Name",
        surname: "Test Surname",
        email: "username@test.com",
      },
    };
    statusStub = sinon.stub();
    jsonStub = sinon.stub();
    mockRes = {
      status: statusStub,
      json: jsonStub,
    };
    statusStub.returns(mockRes);
    jsonStub.returns(mockRes);
    findStub = sinon.stub(User, "find");
    findOneStub = sinon.stub(User, "findOne");
    createStub = sinon.stub(User, "create");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should create a new user if it does not already exist", async () => {
    findOneStub.returns(null);
    createStub.returns(mockReq.body);

    await createUser(mockReq, mockRes);

    expect(findOneStub.calledOnce).to.be.true;
    expect(createStub.calledOnce).to.be.true;
    expect(statusStub.calledWith(201)).to.be.true;
    expect(
      jsonStub.calledWith({
        name: "Test Name",
        surname: "Test Surname",
        email: "username@test.com",
      })
    ).to.be.true;
  });

  it("should return all users when the collection is not empty", async () => {
    findStub.returns([{ name: "User 1" }, { name: "User 2" }]);

    await getAllUsers(mockReq, mockRes);

    expect(findStub.calledOnce).to.be.true;
    expect(statusStub.calledWith(200)).to.be.true;
    expect(jsonStub.calledWith([{ name: "User 1" }, { name: "User 2" }])).to.be
      .true;
  });

  it("should return a user by email", async () => {
    mockReq.params = { email: "username@test.com" };
    findOneStub.returns({
      name: "Test User",
      surname: "Test Surname",
      email: "username@test.com",
    });

    await getUser(mockReq, mockRes);

    expect(findOneStub.calledOnceWith({ email: "username@test.com" })).to.be
      .true;
    expect(statusStub.calledWith(200)).to.be.true;
    expect(
      jsonStub.calledWith({
        name: "Test User",
        surname: "Test Surname",
        email: "username@test.com",
      })
    ).to.be.true;
  });

  it("should update an existing user", async () => {
    const mockReq = {
      params: {
        email: "username@test.com",
      },
      body: {
        email: "updatedusername@test.com", //valid email required
      },
    };
    const findOneAndUpdateStub = sinon
      .stub(User, "findOneAndUpdate")
      .resolves({ email: "updatedusername@test.com" });

    await updateUser(mockReq, mockRes);

    expect(
      findOneAndUpdateStub.calledOnceWith(
        { email: "username@test.com" },
        { email: "updatedusername@test.com" },
        { new: false }
      )
    ).to.be.true;
    expect(mockRes.status.calledWith(200)).to.be.true;
    expect(mockRes.json.calledWith({ email: "updatedusername@test.com" })).to.be
      .true;
  });

  it("should delete an existing user", async () => {
    const mockReq = {
      params: {
        email: "username@test.com",
      },
    };
    const findOneAndDeleteStub = sinon
      .stub(User, "findOneAndDelete")
      .resolves({ email: "username@test.com" });

    await deleteUser(mockReq, mockRes);

    expect(findOneAndDeleteStub.calledOnceWith({ email: "username@test.com" }))
      .to.be.true;
    expect(mockRes.status.calledWith(200)).to.be.true;
    expect(
      mockRes.json.calledWith({
        message: `${mockReq.name} ${mockReq.surname} deleted successfully`,
      })
    ).to.be.true;
  });

  it("should return status 400 if the user already exists", async () => {
    findOneStub.returns({ email: "username@test.com" });

    await createUser(mockReq, mockRes);

    expect(findOneStub.calledOnce).to.be.true;
    expect(createStub.called).to.be.false;
    expect(statusStub.calledWith(400)).to.be.true;
    expect(jsonStub.calledWith({ message: "User already exists" })).to.be.true;
  });

  it("should return status 400 if the email is invalid", async () => {
    mockReq.body = {
      email: "invalidemail",
    };
    findOneStub.returns(null);

    await createUser(mockReq, mockRes);

    expect(findOneStub.calledOnce).to.be.true;
    expect(createStub.called).to.be.false;
    expect(statusStub.calledWith(400)).to.be.true;
    expect(jsonStub.calledWith({ message: "Invalid email" })).to.be.true;
  });

  it("should return status 404 if the user does not exist", async () => {
    mockReq.params = { email: "username@test.com" };
    findOneStub.returns(null);

    await getUser(mockReq, mockRes);

    expect(findOneStub.calledOnceWith({ email: "username@test.com" })).to.be
      .true;
    expect(statusStub.calledWith(404)).to.be.true;
    expect(jsonStub.calledWith({ message: "User not found" })).to.be.true;
  });

  it("should return status 500 if an error occurs", async () => {
    findOneStub.throws(new Error("Database error"));

    await createUser(mockReq, mockRes);

    expect(statusStub.calledWith(500)).to.be.true;
    expect(jsonStub.calledWith({ message: "Database error" })).to.be.true;
  });
});
