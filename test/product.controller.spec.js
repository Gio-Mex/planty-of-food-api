import * as chai from "chai";
const expect = chai.expect;
import * as sinon from "sinon";
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import Product from "../models/product.model.js";

describe("Product Controller Tests", () => {
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
        productID: 1,
        name: "Test Product",
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
    findStub = sinon.stub(Product, "find");
    findOneStub = sinon.stub(Product, "findOne");
    createStub = sinon.stub(Product, "create").resolves({ productID: 1, ...mockReq.body });
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should create a new product if it does not already exist", async () => {
    findOneStub.returns(null);
    const countDocumentsStub = sinon.stub(Product, "countDocuments").resolves(0);

    await createProduct(mockReq, mockRes);

    expect(countDocumentsStub.calledOnce).to.be.true;
    expect(findOneStub.calledOnce).to.be.true;
    expect(createStub.calledOnce).to.be.true;
    expect(statusStub.calledWith(201)).to.be.true;
    expect(jsonStub.calledWith({ productID: 1, name: "Test Product" })).to.be.true;
  });

  it("should return all products when the collection is not empty", async () => {
    findStub.returns([{ name: "Product 1" }, { name: "Product 2" }]);

    await getAllProducts(mockReq, mockRes);

    expect(findStub.calledOnce).to.be.true;
    expect(statusStub.calledWith(200)).to.be.true;
    expect(jsonStub.calledWith([{ name: "Product 1" }, { name: "Product 2" }]))
      .to.be.true;
  });

  it("should return a product by ID", async () => {
    mockReq.params = { productID : 1 };
    findOneStub.returns({ productID: 1, name: "Test Product" });

    await getProduct(mockReq, mockRes);

    expect(findOneStub.calledOnceWith({ productID : 1 })).to.be.true;
    expect(statusStub.calledWith(200)).to.be.true;
    expect(jsonStub.calledWith({ productID: 1, name: "Test Product" })).to.be.true;
  });

  it("should update an existing product", async () => {
    const mockReq = {
      params: {
        productID: 1,
        name: "Test Product",
      },
      body: {
        productID: 1,
        name: "Updated Product",
      },
    };
    const findOneAndUpdateStub = sinon
      .stub(Product, "findOneAndUpdate")
      .resolves({productID: 1, name: "Updated Product" });

    await updateProduct(mockReq, mockRes);

    expect(
      findOneAndUpdateStub.calledOnceWith(
        { productID: 1 },
        { name: "Updated Product" },
        { new: true }
      )
    ).to.be.true;
    expect(mockRes.status.calledWith(200)).to.be.true;
    expect(mockRes.json.calledWith({productID: 1, name: "Updated Product" })).to.be.true;
  });

  it("should delete an existing product", async () => {
    const mockReq = {
      params: {
        productID: 1
      },
    };
    const findOneAndDeleteStub = sinon
      .stub(Product, "findOneAndDelete")
      .resolves({ productID : 1});

    await deleteProduct(mockReq, mockRes);

    expect(findOneAndDeleteStub.calledOnceWith({ productID : 1 })).to.be
      .true;
    expect(mockRes.status.calledWith(200)).to.be.true;
    expect(
      mockRes.json.calledWith({ message: "Product deleted successfully" })
    ).to.be.true;
  });

  it("should return status 400 if the product already exists", async () => {
    findOneStub.returns({ name: "Test Product" });

    await createProduct(mockReq, mockRes);

    expect(findOneStub.calledOnce).to.be.true;
    expect(createStub.called).to.be.false;
    expect(statusStub.calledWith(400)).to.be.true;
    expect(jsonStub.calledWith({ message: "Product already exists" })).to.be
      .true;
  });

  it("should return status 404 if the product does not exist", async () => {
    mockReq.params = { productID: 1 };
    findOneStub.returns(null);

    await getProduct(mockReq, mockRes);

    expect(findOneStub.calledOnceWith({ productID: 1 })).to.be.true;
    expect(statusStub.calledWith(404)).to.be.true;
    expect(jsonStub.calledWith({ message: "Product not found" })).to.be.true;
  });

  it("should return status 500 if an error occurs", async () => {
    findOneStub.throws(new Error("Database error"));

    await createProduct(mockReq, mockRes);

    expect(statusStub.calledWith(500)).to.be.true;
    expect(jsonStub.calledWith({ message: "Database error" })).to.be.true;
  });
});
