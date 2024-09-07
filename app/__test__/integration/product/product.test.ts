import request from "supertest";
import { createBlockageCode, createProduct, databaseDeletionAfterTests, databaseInsertsForTests, generateAccessToken, generateRefreshToken } from "../helpers/test.helpers";
import { app } from "../../../index.app";
import { makeRandomString } from "../../../helpers/makeRandomString.helper";


describe("Product tests", () => {
  beforeEach(async () => {
    await databaseInsertsForTests();
  });

  afterEach(async () => {
    await databaseDeletionAfterTests();
  });

  it("fetches all the existing products", async () => {
    await createProduct();
    await createProduct();
    await createProduct();
  
    const response = await request(app)
      .get("/api/product")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(200);
  
    expect(response.body.length).toEqual(3);
  });
  
  // --------------------
  
  it("fetches a single product when given valid ID", async () => {
    const product = await createProduct();
  
    const response = await request(app)
      .get(`/api/product/${product.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(200);
  
    expect(product.id).toEqual(response.body.id);
  });
  
  // --------------------
  
  it("creates a product when given valid inputs", async () => {
    const response = await request(app)
      .post("/api/product")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "title": "TEST Product",
        "description": "Test Description",
        "reference": makeRandomString(10),
        "ean": "1235239233223",
        "length": 12.23,
        "width": 10.12,
        "height": 8.50,
        "product_image_url": "test_link",
        "price": 23.70
      })
      .expect(201);
  
    expect(response.body.title).toEqual("TEST Product");
  });
  
  // --------------------
  
  it("returns a 400 status error when trying to create a product if given invalid input", async () => {
    await request(app)
      .post("/api/product")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "title": 13, // <-- sending a number instead of a string
        "description": "Test Description",
        "reference": makeRandomString(10),
        "ean": "1235239233223",
        "length": 12.23,
        "width": 10.12,
        "height": 8.50,
        "product_image_url": "test_link",
        "price": 23.70
      })
      .expect(400);
  });
  
  // --------------------
  
  it("creates and updates a product", async () => {
    const product = await createProduct();
  
    const response = await request(app)
      .patch(`/api/product/${product.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "title": "product's title"
      })
      .expect(200);
  
    expect(response.body.title).toEqual("product's title");
  });
  
  // --------------------
  
  it("returns a 400 status error when trying to update a product with invalid inputs", async () => {
    const product = await createProduct();
  
    await request(app)
      .patch(`/api/product/${product.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "title": 123 // <-- sending a number instead of a string
      })
      .expect(400);
  });
  
  // --------------------
  
  it("creates and delete a product", async () => {
    const product = await createProduct();
  
    await request(app)
      .delete(`/api/product/${product.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(200);
  
    await request(app)
      .get(`/api/product/${product.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(404);
  });
  
  // --------------------
  
  it("returns appropriate status error when given invalid IDs", async () => {
    const inexistingID = "999";
    const invalidID = "notAnID";
  
    await request(app)
      .get(`/api/product/${inexistingID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(404);
  
    await request(app)
      .get(`/api/product/${invalidID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(400);
  
    await request(app)
      .patch(`/api/product/${inexistingID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "title": makeRandomString(10) 
      })
      .expect(404);
  
    await request(app)
      .patch(`/api/product/${invalidID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "title": makeRandomString(10) 
      })
      .expect(400);
  
    await request(app)
      .delete(`/api/product/${inexistingID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`) 
      .send()
      .expect(404);
  
    await request(app)
      .delete(`/api/product/${invalidID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(400);
  });
  
  // --------------------
  
  it("returns a 404 status error when using an invalid URL", async () => {
    await request(app)
      .get("/api/unknownURL") // <-- using an inexisting URL
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(404);
  });
  
  // --------------------
  
  it("returns an error when specifying an unexisting product blockage name", async () => {
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
        "product_blockage_name": "XXX"
      })
      .expect(400);
  });
  
  // --------------------
  
  it("creates a product and updates it with an existing blockage name", async () => {
    const productBlockage = await createBlockageCode();

    const product = await request(app)
      .post("/api/product")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "title": makeRandomString(10),
        "description": makeRandomString(55),
        "reference": makeRandomString(10),
        "ean": makeRandomString(13),
        "length": 22.22,
        "width": 11.11,
        "height": 33.33,
        "product_image_url": makeRandomString(155),
        "price": 44.44,
        "product_blockage_name": `${productBlockage.name}`
      })
      .expect(201);

    console.log(productBlockage);
  
    const responseOne = await request(app)
      .patch(`/api/product/blockage/${productBlockage.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "name": "ZZZ"
      })
      .expect(200);

      console.log("2");

    const responseTwo = await request(app)
      .get(`/api/product/${product.body.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(200);

    expect(responseOne.body.name).toEqual(responseTwo.body.product_blockage_name);
  });
  
  // --------------------
})
