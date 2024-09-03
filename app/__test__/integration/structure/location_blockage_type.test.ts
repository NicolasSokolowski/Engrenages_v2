import request from "supertest";
import { app } from "../../../index.app";
import { makeRandomString } from "../../../helpers/makeRandomString.helper";
import { createLocationBlockageType, createLocationType, generateAccessToken, generateRefreshToken } from "../helpers/test.helpers";


// TESTS --------------

it("fetches all existing location blockage types", async () => {
  await createLocationBlockageType();
  await createLocationBlockageType();
  await createLocationBlockageType();

  const response = await request(app)
    .get("/api/location/blockage")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()    
    .expect(200);

  expect(response.body.length).toEqual(3);
});

// --------------------

it("creates a location blockage type when given valid inputs", async () => {
  const response = await request(app)
    .post("/api/location/blockage")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": "BLO",
      "description": "Emplacement bloqué"
    })
    .expect(201);

  expect(response.body.name).toEqual("BLO");
});

// --------------------

it("returns an error when given invalid inputs for the creation", async () => {
  await request(app)
    .post("/api/location/blockage")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": 123, // <-- Sending a number instead of a string
      "description": "Emplacement bloqué"
    })
    .expect(400);  
});

// --------------------

it("creates and updates a location blockage type when given valid inputs", async () => {
  const blockage = await createLocationBlockageType();

  const response = await request(app)
    .patch(`/api/location/blockage/${blockage.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)    
    .send({
      "name": "DMG"
    })
    .expect(200);

  expect(response.body.name).toEqual("DMG");
});

// --------------------

it("returns an error when given invalid inputs for the update", async () => {
  const blockage = await createLocationBlockageType();

  await request(app)
    .patch(`/api/location/blockage/${blockage.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)    
    .send({
      "name": 123 // <-- Sending a number instead of a string
    })
    .expect(400);  
});

// --------------------

it("returns appropriate status error when given invalid IDs", async () => {
  const inexistingID = "999";
  const invalidID = "notAnID";

  await request(app)
    .get(`/api/location/blockage/${inexistingID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(404);

  await request(app)
    .get(`/api/location/blockage/${invalidID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(400);

  await request(app)
    .patch(`/api/location/blockage/${inexistingID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": makeRandomString(3) 
    })
    .expect(404);

  await request(app)
    .patch(`/api/location/blockage/${invalidID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": makeRandomString(3) 
    })
    .expect(400);

  await request(app)
    .delete(`/api/location/blockage/${inexistingID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`) 
    .send()
    .expect(404);

  await request(app)
    .delete(`/api/location/blockage/${invalidID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(400);
});

// --------------------

it("returns an error when trying to create an already existing blockage type (name)", async () => {
  const blockage = await createLocationBlockageType();

  await request(app)
    .post("/api/location/blockage")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": `${blockage.body.name}`,
      "description": `${blockage.body.description}`
    })
    .expect(400);
});

// --------------------

it("creates a location blockage, a location with the created blockage type and updates the location blockage", async () => {
  const locationType = await createLocationType();

  const locationBlockageType = await createLocationBlockageType();

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
      "location_type_name": `${locationType.body.name}`,
      "location_blockage_name": `${locationBlockageType.body.name}`
    });

  const updatedLocationBlockage = await request(app)
    .patch(`/api/location/blockage/${locationBlockageType.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": "TST"
    })
    .expect(200);

  const checkLocation = await request(app)
    .get(`/api/location/${location.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(200);

  expect(updatedLocationBlockage.body.name).toEqual(checkLocation.body.location_blockage_name);
});

// --------------------

it("deletes a location blockage type when given valid ID", async () => {
  const locationBlockageType = await createLocationBlockageType();

  await request(app)
    .delete(`/api/location/blockage/${locationBlockageType.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(200);

  await request(app)
    .get(`/api/location/blockage/${locationBlockageType.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(404);
});

// --------------------

it("returns a 400 error when trying to delete a location blockage type currently used by a location", async () => {
  const locationType = await createLocationType();
  const locationBlockageType = await createLocationBlockageType();

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
      "location_type_name": `${locationType.body.name}`,
      "location_blockage_type": `${locationBlockageType.body.name}`
    });

  await request(app)
    .delete(`/api/location/blockage/${locationBlockageType.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(400);
});

// --------------------