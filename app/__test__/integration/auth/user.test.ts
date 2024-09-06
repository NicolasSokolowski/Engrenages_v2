import request from "supertest";
import { createRole, createUser, databaseDeletionAfterTests, databaseInsertsForTests, generateAccessToken, generateOperatorAccessToken, generateOperatorRefreshToken, generateRefreshToken } from "../helpers/test.helpers";
import { app } from "../../../index.app";
import { makeRandomString } from "../../../helpers/makeRandomString.helper";


describe("User tests", () => {
  beforeEach(async () => {
    await databaseInsertsForTests();
  });

  afterEach(async () => {
    await databaseDeletionAfterTests();
  });

  it("fetches a single user when given valid ID", async () => {  
    const user = await createUser();

    console.log(user);
  
    const response = await request(app)
      .get(`/api/user/${user.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(200);
  
    expect(response.body.first_name).toEqual(user.first_name);
  });
  
  // --------------------
  
  
  it("creates a user when given valid inputs", async () => {  
    const roleName = await createRole();
  
    const user = await request(app)
      .post("/api/user")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "first_name": "Mickey",
        "last_name": "Mouse",
        "email": `${makeRandomString(5)}.${makeRandomString(7)}@${makeRandomString(4)}.com`,
        "password": makeRandomString(18),
        "role_name": `${roleName.name}`
      })
      .expect(201);
  
    const response = await request(app)
      .get(`/api/user/${user.body.user.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(200);
  
    expect(response.body.role_name).toEqual(roleName.name);
  });
  
  // --------------------
  
  it("returns a 400 error when trying to create a user with invalid input", async () => {  
    const role = await createRole();
  
    await request(app)
      .post("/api/user")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "first_name": makeRandomString(30), // <-- sending a 30 characters long first name instead of 20 max
        "last_name": "Duck",
        "email": `${makeRandomString(5)}.${makeRandomString(7)}@${makeRandomString(4)}.com`,
        "password": makeRandomString(18),
        "role_name": `${role.name}`
      })
      .expect(400);
  });
  
  // --------------------
  
  it("returns a 400 error when trying to create a user with already existing email", async () => {
    const user = await createUser();
  
    await request(app)
      .post("/api/user")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "first_name": "Minnie",
        "last_name": "Mouse",
        "email": `${user.email}`,
        "password": makeRandomString(18),
        "role_name": `${user.role_name}`
      })
      .expect(400);
  });
  
  // --------------------
  
  it("creates and updates a user (not the password) when given valid inputs", async () => {
    const user = await createUser();
  
    const response = await request(app)
      .patch(`/api/user/${user.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "first_name": "Donald",
        "last_name": "Duck"
      })
      .expect(200);
  
    expect(response.body.first_name).toEqual("Donald");
    expect(response.body.last_name).toEqual("Duck");
  });
  
  // --------------------
  
  it("returns a 400 error when trying to update a user (no password) with invalid inputs", async () => {
    const user = await createUser();
  
    await request(app)
      .patch(`/api/user/${user.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "first_name": "Donald",
        "last_name": makeRandomString(60) // <-- sending a 60 characters long lastname instead of 50 max
      })
      .expect(400);
  });
  
  // --------------------
  
  it("creates and deletes a user when given valid ID", async () => {
    const user = await createUser();
  
    await request(app)
      .delete(`/api/user/${user.id}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(200);
  
    await request(app)
      .get(`/api/user/${user.id}`)
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
      .get(`/api/user/${inexistingID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(404);
  
    await request(app)
      .get(`/api/user/${invalidID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(400);
  
    await request(app)
      .patch(`/api/user/${inexistingID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "first_name": makeRandomString(3) 
      })
      .expect(404);
  
    await request(app)
      .patch(`/api/user/${invalidID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "first_name": makeRandomString(3) 
      })
      .expect(400);
  
    await request(app)
      .delete(`/api/user/${inexistingID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(404);
  
    await request(app)
      .delete(`/api/user/${invalidID}`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(400);
  });
  
  // --------------------
  
  it("returns an error when trying to create a user with missing inputs", async () => {  
    await request(app)
      .post("/api/user")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "first_name": makeRandomString(5),
        "last_name": makeRandomString(10),
        "email": `${makeRandomString(5)}.${makeRandomString(7)}@${makeRandomString(4)}.com`,
        "password": makeRandomString(18)
        // role_name is missing
      })
      .expect(400);
  });
  
  // --------------------
  
  it("returns an error when trying to create a user with a non existing role", async () => {  
    await request(app)
      .post("/api/user")
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send({
        "first_name": makeRandomString(5),
        "last_name": makeRandomString(10),
        "email": `${makeRandomString(5)}.${makeRandomString(7)}@${makeRandomString(4)}.com`,
        "password": makeRandomString(18),
        "role_name": "Idontexist"
      })
      .expect(400);
  });
  
  // --------------------
  
  it("returns an error when trying to create a user with no authorization", async () => {  
    await request(app)
      .post("/api/user/role")
      .set("authorization", `${await generateOperatorAccessToken()}`)
      .set("x-refresh-token", `${await generateOperatorRefreshToken()}`)
      .send({
        "name": "seller"
      })
      .expect(403);
  });
  
  // --------------------
  
  it("returns an error when trying to update a user with no authorization", async () => {
    const role = await createRole();
  
    await request(app)
      .patch(`/api/user/role/${role.id}`)
      .set("authorization", `${await generateOperatorAccessToken()}`)
      .set("x-refresh-token", `${await generateOperatorRefreshToken()}`)
      .send({
        "name": "Terminator"
      })
      .expect(403);
  
  });
  
  // --------------------
  
  it("returns an error when trying to delete a user with no authorization", async () => {
    const role = await createRole();
  
    await request(app)
      .patch(`/api/user/role/${role.id}`)
      .set("authorization", `${await generateOperatorAccessToken()}`)
      .set("x-refresh-token", `${await generateOperatorRefreshToken()}`)
      .send({
        "name": "Terminator"
      })
      .expect(403);
  });
  
  // --------------------
  
  it("fetches all the existing users", async () => {  
    await createUser();
    await createUser();
    await createUser();
  
    const response = await request(app)
      .get(`/api/user`)
      .set("authorization", `${await generateAccessToken()}`)
      .set("x-refresh-token", `${await generateRefreshToken()}`)
      .send()
      .expect(200);
  
    expect(response.body.length).toEqual(5);
  });
  
  // --------------------
  
})


// TESTS --------------

