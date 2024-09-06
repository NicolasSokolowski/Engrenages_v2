import request from "supertest";
import { app } from "../../../index.app";
import { createRole, databaseDeletionAfterTests, databaseInsertsForTests, generateAccessToken, generateOperatorAccessToken, generateOperatorRefreshToken, generateRefreshToken } from "../helpers/test.helpers";
import { makeRandomString } from "../../../helpers/makeRandomString.helper";


describe("Role tests", () => {
  beforeEach(async () => {
    await databaseInsertsForTests();
  });

  afterEach(async () => {
    await databaseDeletionAfterTests();
  })

  it("fetches all existing roles", async () => { 
    await createRole();
    await createRole();
    await createRole();
  
  const response = await request(app)
    .get("/api/user/role")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(200);
  
    expect(response.body.length).toEqual(5); // <-- 2 are inserted in the beforeAll
  });
  
  // --------------------
  
  it("fetches a single existing role when given valid ID", async () => {
    const user = await createRole();
  
    const response = await request(app)
      .get(`/api/user/role/${user.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(200);
    
    expect(response.body.id).toEqual(user.id);
  });
  
  // --------------------
  
  it("creates a role when given valid inputs", async () => {
    await request(app)
      .post("/api/user/role")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "name": "director"
      })
      .expect(201);
  });
  
  // --------------------
  
  it("returns a 400 error when trying to create a role with invalid input", async () => {
    await request(app)
      .post("/api/user/role")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "name": makeRandomString(11) // <-- sending a 11 characters long instead of 10 max
      })
      .expect(400);
  });
  
  // --------------------
  
  it("returns a 400 error when trying to create a role with missing name", async () => {  
    await request(app)
      .post("/api/user/role")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        // sending an empty body
      })
      .expect(400);
  });
  
  // --------------------
  
  it("returns a 400 when trying to create an already existing role", async () => {  
    const role = await createRole();
  
    await request(app)
      .post("/api/user/role")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "name": `${role.name}`
      })
      .expect(400);
  
  });
  
  // --------------------
  
  it("creates and updates a role when given valid inputs", async () => {  
    const role = await createRole();
  
    const response = await request(app)
      .patch(`/api/user/role/${role.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "name": "key-user"
      })
      .expect(200);
  
    expect(response.body.name).toEqual("key-user");
  });
  
  // --------------------
  
  it("returns a 400 error when trying to update a role with invalid input", async () => {  
    const role = await createRole();
  
    await request(app)
      .patch(`/api/user/role/${role.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "name": makeRandomString(11) // <-- sending a 11 characters long name instead of 10 max
      })
      .expect(400);
  });
  
  // --------------------
  
  it("creates and deletes a role when given valid ID", async () => {  
    const role = await createRole();
  
    await request(app)
      .delete(`/api/user/role/${role.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(200);
  
    await request(app)
      .get(`/api/user/role/${role.id}`)
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
      .get(`/api/user/role/${inexistingID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(404);
  
    await request(app)
      .get(`/api/user/role/${invalidID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(400);
  
    await request(app)
      .patch(`/api/user/role/${inexistingID}`) 
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "name": makeRandomString(3) 
      })
      .expect(404);
  
    await request(app)
      .patch(`/api/user/role/${invalidID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "name": makeRandomString(3) 
      })
      .expect(400);
  
    await request(app)
      .delete(`/api/user/role/${inexistingID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(404);
  
    await request(app)
      .delete(`/api/user/role/${invalidID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(400);
  });
  
  // --------------------
  
  it("creates a role and creates a user with the created role", async () => {  
    const role = await createRole();

    console.log(role.name);
  
    const user = await request(app)
      .post("/api/user")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "first_name": makeRandomString(5),
        "last_name": makeRandomString(10),
        "email": "test@gmail.com",
        "password": makeRandomString(18),
        "role_name": `${role.name}`
      })
      .expect(201);
  
    const response = await request(app)
      .get(`/api/user/${user.body.user.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(200);
  
    expect(response.body.role_name).toEqual(role.name);
  });
  
  // --------------------
  
  it("returns an error when trying to delete a role affected to a user", async () => {  
    const role = await createRole();
  
    await request(app)
      .post("/api/user")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "first_name": makeRandomString(5),
        "last_name": makeRandomString(10),
        "email": `${makeRandomString(5)}.${makeRandomString(7)}@${makeRandomString(4)}.com`,
        "password": makeRandomString(18),
        "role_name": `${role.name}`
      })
      .expect(201);
    
    await request(app)
      .delete(`/api/user/role/${role.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(400);
  });
  
  // --------------------
  
  it("returns a 403 error when trying to create a role with no authorization", async () => {  
    await request(app)
      .post("/api/user/role")
      .set("authorization", `${await generateOperatorAccessToken()}`)
      .set("x-refresh-token", `${await generateOperatorRefreshToken()}`)
      .send({
        "name": "preparator"
      })
      .expect(403);
  });
  
  // --------------------
  
  it("returns an error when trying to update a role with no authorization", async () => {  
    const roleToUpdate = await createRole();
  
    await request(app)
      .patch(`/api/user/role/${roleToUpdate.id}`)
      .set("authorization", `${await generateOperatorAccessToken()}`)
      .set("x-refresh-token", `${await generateOperatorRefreshToken()}`)
      .send({
        "name": "buyer"
      })
      .expect(403);
  
  });
  
  // --------------------
  
  it("returns an error when trying to delete a role with no authorization", async () => {
    const roleToUpdate = await createRole();
  
    await request(app)
      .delete(`/api/user/role/${roleToUpdate.id}`)
      .set("authorization", `${await generateOperatorAccessToken()}`)
      .set("x-refresh-token", `${await generateOperatorRefreshToken()}`)
      .send({
        "name": "buyer"
      })
      .expect(403);  
  });
  
  // --------------------

  
})