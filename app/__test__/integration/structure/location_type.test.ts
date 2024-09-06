import request from "supertest";
import { app } from "../../../index.app";
import { makeRandomString } from "../../../helpers/makeRandomString.helper";
import { createLocationType, databaseDeletionAfterTests, databaseInsertsForTests, generateAccessToken, generateRefreshToken } from "../helpers/test.helpers";


describe("Location type tests", () => {
  beforeEach(async () => {
    await databaseInsertsForTests();
  });

  afterEach(async () => {
    await databaseDeletionAfterTests();
  });

  it("fetches all existing location types", async () => {
    await createLocationType();
    await createLocationType();
    await createLocationType();
  
    const response = await request(app)
      .get("/api/location/type")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(200);
  
    expect(response.body.length).toEqual(3);
  });
  
  // --------------------
  
  it("creates a location type when given valid inputs", async () => {
    const response = await request(app)
      .post("/api/location/type")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "name": "R01",
        "description": "Emplacement multi picking",
        "length": 120,
        "width": 270,
        "height": 190
      })
      .expect(201);
  
    expect(response.body.name).toEqual("R01");
  });
  
  // --------------------
  
  it("returns an error when given invalid inputs for the creation", async () => {
    await request(app)
      .post("/api/location/type")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "name": 1, // <-- Sending a number instead of a string
        "description": "Emplacement multi picking",
        "length": 120,
        "width": 270,
        "height": 190
      })
    .expect(400);
  });
  
  // --------------------
  
  it("creates and updates a location when given valid inputs", async () =>  {
    const locationType = await createLocationType();
  
    const response = await request(app)
      .patch(`/api/location/type/${locationType.body.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "name": "R02"
      })
      .expect(200);
  
    expect(response.body.name).toEqual("R02");
  });
  
  // --------------------
  
  it("creates a location type, a location with the created location type and updates it", async () => {
    const locationType = await createLocationType();
  
    const location = await request(app)
      .post("/api/location")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "zone": makeRandomString(1),
        "alley": makeRandomString(3),
        "position": makeRandomString(4),
        "lvl": makeRandomString(1),
        "lvl_position": makeRandomString(2),
        "location_type_name": `${locationType.body.name}`
      })
      .expect(201);
  
      const updatedLocationType = await request(app)
        .patch(`/api/location/type/${locationType.body.id}`)
        .set("authorization", `${await generateAccessToken()}`)
        .set("x-refresh-token", `${await generateRefreshToken()}`)
        .send({
          "name": "R01"
        })
        .expect(200);
  
      const checkLocation = await request(app)
        .get(`/api/location/${location.body.id}`)
        .set("authorization", `${await generateAccessToken()}`)
        .set("x-refresh-token", `${await generateRefreshToken()}`)
        .send()
        .expect(200);
  
      expect(updatedLocationType.body.name).toEqual(checkLocation.body.location_type_name);
  })
  
  // --------------------
  
  it("returns a 400 status error when given invalid inputs for the update", async () => {
    const locationType = await createLocationType();
  
    await request(app)
      .patch(`/api/location/type/${locationType.body.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "name": "R02",
        "description": 342 // <-- Sending a number instead of a string
      })
      .expect(400);
  });
  
  // --------------------
  
  it("deletes a location type when given valid ID", async () => {
    const locationType = await createLocationType();
    
    await request(app)
      .delete(`/api/location/type/${locationType.body.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(200);
  
    await request(app)
      .get(`/api/location/type/${locationType.body.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(404);
  });
  
  // --------------------
  
  it("returns a 400 status error when trying to delete a currently used location type", async () => {
    const locationType = await createLocationType();
  
    await request(app)
      .post("/api/location")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "zone": makeRandomString(1),
        "alley": makeRandomString(3),
        "position": makeRandomString(4),
        "lvl": makeRandomString(1),
        "lvl_position": makeRandomString(2),
        "location_type_name": `${locationType.body.name}`
      })
      .expect(201);
  
    await request(app)
      .delete(`/api/location/type/${locationType.body.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(400);
  })
  
  // --------------------
  
  it("returns appropriate status error when given invalid IDs", async () => {
    const inexistingID = "999";
    const invalidID = "notAnID";
  
    await request(app)
      .get(`/api/location/type/${inexistingID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(404);
  
    await request(app)
      .get(`/api/location/type/${invalidID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(400);
  
    await request(app)
      .patch(`/api/location/type/${inexistingID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "name": makeRandomString(5) 
      })
      .expect(404);
  
    await request(app)
      .patch(`/api/location/type/${invalidID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "name": makeRandomString(5) 
      })
      .expect(400);
  
    await request(app)
      .delete(`/api/location/type/${inexistingID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`) 
      .send()
      .expect(404);
  
    await request(app)
      .delete(`/api/location/type/${invalidID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(400);
  });
  
  // --------------------
  
  it("returns an error when trying to create an already existing location type (name)", async () => {
    const locationType = await createLocationType();
  
    await request(app)
      .post("/api/location/type")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`) 
      .send({
        "name": `${locationType.body.name}`,
        "description": "Emplacement étagère",
        "length": 120,
        "width": 80,
        "height": 190
      })
      .expect(400);
  });
  
  // --------------------
})

