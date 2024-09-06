import request from "supertest";
import { app } from "../../../index.app";
import { makeRandomString } from "../../../helpers/makeRandomString.helper";
import { createLocation, createLocationType, databaseDeletionAfterTests, databaseInsertsForTests, generateAccessToken, generateRefreshToken } from "../helpers/test.helpers";


describe("Location tests", () => {
  beforeEach(async () => {
    await databaseInsertsForTests();
  });

  afterEach(async () => {
    await databaseDeletionAfterTests();
  });

  it("fetches all existing location", async () => {
    await createLocation();
    await createLocation();
    await createLocation();
  
    const response = await request(app)
      .get("/api/location")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(200);
  
    expect(response.body.length).toEqual(3);
  });
  
  // --------------------
  
  it("creates a location when given valid inputs", async () => {
    const locationType = await createLocationType();
  
    const response = await request(app)
      .post("/api/location")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "zone": "B",
        "alley": "201",
        "position": "1111",
        "lvl": "C",
        "lvl_position": "02",
        "location_type_name": `${locationType.body.name}`
      })
      .expect(201);
  
    expect(response.body.zone).toEqual("B");
  });
  
  // --------------------
  
  it("returns an error when given invalid inputs for the creation", async () => {
    const locationType = await createLocationType();
  
    await request(app)
      .post("/api/location")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "zone": "B",
        "alley": "201",
        "position": 1111, // <-- Sending a number instead of a string
        "lvl": "C",
        "lvl_position": "02",
        "location_type_name": `${locationType.body.location_type_name}`
      })
      .expect(400);
  });
  
  // --------------------
  
  it("creates and updates a location when given valid inputs", async () => {
    const location = await createLocation();
  
    const response = await request(app)
      .patch(`/api/location/${location.body.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "zone": "C"
      })
      .expect(200);
  
    expect(response.body.zone).toEqual("C");
  });
  
  // --------------------
  
  it("returns an error when given invalid inputs for the update", async () => {
    const location = await createLocation();
  
    await request(app)
      .patch(`/api/location/${location.body.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "alley": 123 // <-- Sending a number instead of a string
      })
      .expect(400);
  });
  
  // --------------------
  
  it("deletes a location when given valid inputs", async () => {
    const location = await createLocation();
  
    await request(app)
      .delete(`/api/location/${location.body.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(200);
  
    await request(app)
      .get(`/api/location/${location.body.id}`)
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
      .get(`/api/location/${inexistingID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(404);
  
    await request(app)
      .get(`/api/location/${invalidID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(400);
  
    await request(app)
      .patch(`/api/location/${inexistingID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "zone": makeRandomString(1) 
      })
      .expect(404);
  
    await request(app)
      .patch(`/api/location/${invalidID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "alley": makeRandomString(3) 
      })
      .expect(400);
  
    await request(app)
      .delete(`/api/location/${inexistingID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`) 
      .send()
      .expect(404);
  
    await request(app)
      .delete(`/api/location/${invalidID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(400);
  });
  
  // --------------------
  
  it("returns an error when trying to create and already existing location", async () => {
    const location = await createLocation();
  
    await request(app)
      .post("/api/location")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "zone": `${location.body.zone}`,
        "alley": `${location.body.alley}`,
        "position": `${location.body.position}`,
        "lvl": `${location.body.lvl}`,
        "lvl_position": `${location.body.lvl}`,
        "location_type_name": `${location.body.location_type_name}`
      })
      .expect(400);
  });
  
  // --------------------
  
  it("it updates the location field whenever one of the following field is updated: zone, alley, position, lvl, lvl_position", async () => {
    const locationType = await createLocationType();
  
    const location = await request(app)
      .post("/api/location")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "zone": "X",
        "alley": "XXX",
        "position": "XXXX",
        "lvl": "X",
        "lvl_position": "XX",
        "location_type_name": `${locationType.body.name}`
      })
      .expect(201);
  
    expect(location.body.location).toEqual("X-XXX-XXXX-X-XX");
    
    const updateOne = await request(app)
      .patch(`/api/location/${location.body.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "zone": "Z",
        "alley": "ZZZ",
        "position": "ZZZZ",
        "lvl": "Z",
        "lvl_position": "ZZ"
      })
      .expect(200);
  
    expect(updateOne.body.location).toEqual("Z-ZZZ-ZZZZ-Z-ZZ");
  
    const updateTwo = await request(app)
      .patch(`/api/location/${location.body.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "zone": "T",
        "lvl": "T",
      })
      .expect(200);
  
    expect(updateTwo.body.location).toEqual("T-ZZZ-ZZZZ-T-ZZ");
    
  });
  
  // --------------------
  
  test.todo("it returns an error when trying to delete a location occupied by a product");
  
  // --------------------
})

