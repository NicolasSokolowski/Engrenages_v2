import request from "supertest";
import { createBlockageCode, databaseDeletionAfterTests, databaseInsertsForTests, generateAccessToken, generateRefreshToken } from "../helpers/test.helpers";
import { app } from "../../../index.app";
import { makeRandomString } from "../../../helpers/makeRandomString.helper";


describe("Product blockage test", () => {
  beforeEach(async () => {
    await databaseInsertsForTests();
  });

  afterEach(async () => {
    await databaseDeletionAfterTests();
  });

  it("fetches all the existing product blockage code", async () => {
    await createBlockageCode();
    await createBlockageCode();
    await createBlockageCode();
  
    const response = await request(app)
      .get("/api/product/blockage")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(200);
  
    expect(response.body.length).toEqual(3);
  });
  
  // --------------------
  
  it("fetches a single product blockage type if given valid ID", async () => {
    const blockageCode = await createBlockageCode();
  
    const response = await request(app)
      .get(`/api/product/blockage/${blockageCode.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(200);
  
    expect(response.body.name).toEqual(blockageCode.name);
  });
  
  // --------------------
  
  it("creates a product blockage type when given valid inputs", async () => {
    const response = await request(app)
      .post("/api/product/blockage")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "name": "RIA",
        "description": "Blockage test description"
      })
      .expect(201);
  
    expect(response.body.name).toEqual("RIA");
    expect(response.body.description).toEqual("Blockage test description");
  });
  
  // --------------------
  
  it("returns a 400 status error when trying to create a product blockage type with invalid inputs", async () => {
    await request(app)
      .post("/api/product/blockage")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "name": 6666, // <-- sending 4 characters ("name" is VARCHAR(3))
        "description": "Blockage test description"
      })
      .expect(400); 
  });
  
  // --------------------
  
  it("creates and updates a product blockage code when given valid inputs", async () => {
    const blockageCode = await createBlockageCode();
  
    const response = await request(app)
      .patch(`/api/product/blockage/${blockageCode.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "name": "FIR"
      })
      .expect(200);
  
    expect(response.body.name).toEqual("FIR");
  });
  
  // --------------------
  
  it("updates on cascade a product blockage type if a product was using the blockage type", async () => {
    const productBlockage = await createBlockageCode();
  
    const product = await request(app)
      .post("/api/product")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "title": makeRandomString(10),
        "description": "Test Description",
        "reference": makeRandomString(10),
        "ean": makeRandomString(13),
        "length": 12.23,
        "width": 10.12,
        "height": 8.50,
        "product_image_url": "test_link",
        "price": 23.70,
        "product_blockage_name": `${productBlockage.name}`
      })
      .expect(201);
  
    const updatedBlockage = await request(app)
      .patch(`/api/product/blockage/${productBlockage.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "name": "YYY"
      })
      .expect(200);
  
    const checkProduct = await request(app)
      .get(`/api/product/${product.body.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(200);
  
    expect(checkProduct.body.product_blockage_name).toEqual(updatedBlockage.body.name);
  })
  
  // --------------------
  
  it("returns a 400 error when trying to update a product blockage code with invalid inputs", async () => {
    const blockageCode = await createBlockageCode();
  
    await request(app)
      .patch(`/api/product/blockage/${blockageCode.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "description": makeRandomString(101) // <-- sending a 101 characters string instead of a max 100
      })
      .expect(400);
  });
  
  // --------------------
  
  it("creates and deletes a product when given valid ID", async () => {
    const blockageCode = await createBlockageCode();
  
    await request(app)
      .delete(`/api/product/blockage/${blockageCode.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(200);
  
    await request(app)
      .get(`/api/product/blockage/${blockageCode.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(404);
  });
  
  // --------------------
  
  it("returns appropriate error when given invalid IDs", async () => {
    const inexistingID = "999";
    const invalidID = "notAnID";
  
    await request(app)
      .get(`/api/product/blockage/${inexistingID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(404);
  
    await request(app)
      .get(`/api/product/blockage/${invalidID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(400);
  
    await request(app)
      .patch(`/api/product/blockage/${inexistingID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "name": makeRandomString(3) 
      })
      .expect(404);
  
    await request(app)
      .patch(`/api/product/blockage/${invalidID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "name": makeRandomString(3) 
      })
      .expect(400);
  
    await request(app)
      .delete(`/api/product/blockage/${inexistingID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(404);
  
    await request(app)
      .delete(`/api/product/blockage/${invalidID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(400);
  });
  
  // --------------------
  
  it("creates a product blockage code and creates a product with the created code", async () => {
    const blockageName = await request(app)
      .post("/api/product/blockage")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "name": "PNT",
        "description": "Pont"
      })
      .expect(201);
  
    const product = await request(app)
      .post("/api/product")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "title": makeRandomString(10),
        "description": "Test Description",
        "reference": makeRandomString(10),
        "ean": makeRandomString(13),
        "length": 12.23,
        "width": 10.12,
        "height": 8.50,
        "product_image_url": "test_link",
        "price": 23.70,
        "product_blockage_name": "PNT"
      })
      .expect(201);
  
    expect(product.body.product_blockage_name).toEqual(blockageName.body.name);
  });
  
  // --------------------
  
  it("returns an error when trying to delete a product blockage code used by a product", async () => {
    const blockageName = await createBlockageCode();

    await request(app)
      .post("/api/product")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "title": makeRandomString(10),
        "description": "Test Description",
        "reference": makeRandomString(10),
        "ean": makeRandomString(13),
        "length": 12.23,
        "width": 10.12,
        "height": 8.50,
        "product_image_url": "test_link",
        "price": 23.70,
        "product_blockage_name": `${blockageName.name}`     
      })
      .expect(201);
  
    await request(app)
      .delete(`/api/product/blockage/${blockageName.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(400);
  });
  
  // --------------------
  
})
