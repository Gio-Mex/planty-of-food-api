import * as chai from "chai";
const expect = chai.expect;
import * as sinon from "sinon";
import {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/order.controller.js";
import Order from "../models/order.model.js";

describe("Order Controller Tests", () => {
  let mockReq;
  let mockRes;
  let statusStub;
  let jsonStub;

  beforeEach(() => {
    mockReq = {
      body: {
        products: ["Test Product 1", "Test Product 2"],
        users: [
          {
            name: "Test User 1",
            surname: "Test Surname 1",
            email: "username1@test.com",
          },
          {
            name: "Test User 2",
            surname: "Test Surname 2",
            email: "username2@test.com",
          },
        ],
        date: "15-03-2023",
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
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should create a new order if it does not already exist", async () => {
    const countDocumentsStub = sinon.stub(Order, "countDocuments").resolves(0);
    const createStub = sinon
      .stub(Order, "create")
      .resolves({ orderID: 1, ...mockReq.body });

    await createOrder(mockReq, mockRes);

    expect(countDocumentsStub.calledOnce).to.be.true;
    expect(createStub.calledOnceWith(mockReq.body)).to.be.true;
    expect(mockRes.status.calledWith(201)).to.be.true;
    expect(mockRes.json.calledWith({ orderID: 1, ...mockReq.body })).to.be.true;
  });

  it("should return all orders when the collection is not empty", async () => {
    const findStub = sinon
      .stub(Order, "find")
      .resolves([
        { orderID: "12345", product: "Test Product", date: "2023-01-01" },
      ]);

    await getAllOrders(mockReq, mockRes);

    expect(findStub.calledOnce).to.be.true;
    expect(statusStub.calledWith(200)).to.be.true;
    expect(
      jsonStub.calledWith([
        { orderID: "12345", product: "Test Product", date: "2023-01-01" },
      ])
    ).to.be.true;
  });

  it("should get order by orderID, product or date", async () => {
    mockReq.params = {
      orderID: "12345",
      products: "Test Product",
      date: "2023-01-01",
    };

    const mockRes = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const findStub = sinon
      .stub(Order, "find")
      .resolves([
        {
          orderID: "12345",
          products: "Test Product",
          users: "username1@test.com",
          date: "2023-01-01",
        },
      ]);

    await getOrder(mockReq, mockRes);

    expect(mockRes.status.calledWith(200)).to.be.true;
    expect(
      mockRes.json.calledWith([
        {
          orderID: "12345",
          products: "Test Product",
          users: "username1@test.com",
          date: "2023-01-01",
        },
      ])
    ).to.be.true;
  });

  it("should update an order by ID", async () => {
    const mockReq = {
      params: {
        orderID: "12345",
      },
      body: {
        products: "Updated Product",
        users: "updated@test.com",
        date: "2023-01-15",
      },
    };

    const findOneAndUpdateStub = sinon
      .stub(Order, "findOneAndUpdate")
      .resolves({
        orderID: "678910",
        products: "Updated Product",
        users: "updated@test.com",
        date: "2023-01-15",
      });

    await updateOrder(mockReq, mockRes);

    expect(findOneAndUpdateStub.calledOnce).to.be.true;
    expect(statusStub.calledWith(200)).to.be.true;
    expect(
      jsonStub.calledWith({
        orderID: "678910",
        products: "Updated Product",
        users: "updated@test.com",
        date: "2023-01-15",
      })
    ).to.be.true;
  });

  it("should delete an order", async () => {
    const mockReq = {
      params: {
        orderID: "12345",
      },
    };
    const findOneAndDeleteStub = sinon
      .stub(Order, "findOneAndDelete")
      .resolves({ orderID: "12345" });

    await deleteOrder(mockReq, mockRes);

    expect(findOneAndDeleteStub.calledOnceWith({ orderID: "12345" })).to.be
      .true;
    expect(statusStub.calledWith(200)).to.be.true;
    expect(jsonStub.calledWith({ message: `Order 12345 deleted successfully` }))
      .to.be.true;
  });

  it("should return a 404 status code if the order ID is not found", async () => {
    mockReq.params = { orderID: "12345" };
    const findStub = sinon.stub(Order, "find").resolves([]);

    await getOrder(mockReq, mockRes);

    expect(statusStub.calledWith(404)).to.be.true;
    expect(jsonStub.calledWith({ message: "Order not found" })).to.be.true;
  });

  it("should return a 500 status code if an error occurs", async () => {
    mockReq.params = { orderID: "12345" };
    const findStub = sinon
      .stub(Order, "find")
      .throws(new Error("Database error"));

    await getOrder(mockReq, mockRes);

    expect(statusStub.calledWith(500)).to.be.true;
    expect(jsonStub.calledWith({ message: "Database error" })).to.be.true;
  });
});
