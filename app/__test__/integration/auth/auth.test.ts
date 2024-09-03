import "dotenv/config";
import request from "supertest";
import { app } from "../../../index.app";
import { expiredAccessToken, expiredRefreshToken } from "../helpers/test.helpers";
import { makeRandomString } from "../../../helpers/makeRandomString.helper";

// TESTS --------------

it("sign in a user when given valid inputs", async () => {
  const response = await request(app)
    .post("/api/auth/signin")
    .send({
      "email": "admin@test.com",
      "password": "password"
    })
    .expect(200);

  expect(response.body.user.first_name).toEqual("Admin");
});

// --------------------

it("returns an error when trying to sign in with missing email and/or password", async () => {
  await request(app)
    .post("/api/auth/signin")
    .send({
      "email": "admin@test.com",
    })
    .expect(400);

  await request(app)
    .post("/api/auth/signin")
    .send({
      "password": "password",
    })
    .expect(400);
});

// --------------------

it("trying to access a route with missing token(s)", async () => {
  const loggedUser = await request(app)
    .post("/api/auth/signin")
    .send({
      "email": "admin@test.com",
      "password": "password"
    })
    .expect(200);

  await request(app)
    .post("/api/user")
    .send()
    .expect(401);

  await request(app)
    .post("/api/user")
    .set("authorization", `Bearer ${loggedUser.body.tokens.accessToken}`)
    .send()
    .expect(401);

  await request(app)
    .post("/api/user")
    .set("x-refresh-token", `${loggedUser.body.tokens.refreshToken}`)
    .send()
    .expect(401);
});

// --------------------

it("Access a route with expired access token and valid refresh token", async () => {
  const loggedUser = await request(app)
    .post("/api/auth/signin")
    .send({
      "email": "admin@test.com",
      "password": "password"
    })
    .expect(200);

  const accessToken = await expiredAccessToken();

  await request(app)
    .post("/api/user/role")
    .set("authorization", `Bearer ${accessToken}`)
    .set("x-refresh-token", `${loggedUser.body.tokens.refreshToken}`)
    .send({
      "name": "key-user"
    })
    .expect(201);
});

// --------------------

it("Access a route with valid access token and expired refresh token", async () => {
  const loggedUser = await request(app)
    .post("/api/auth/signin")
    .send({
      "email": "admin@test.com",
      "password": "password"
    })
    .expect(200);

  const refreshToken = await expiredRefreshToken();

  await request(app)
    .post("/api/user/role")
    .set("authorization", `Bearer ${loggedUser.body.tokens.accessToken}`)
    .set("x-refresh-token", `${refreshToken}`)
    .send({
      "name": "key-user"
    })
    .expect(201);
});

// --------------------

it("returns a 401 error trying to access a route with expired access token and expired refresh token", async () => {
  const accessToken = await expiredAccessToken();
  const refreshToken = await expiredRefreshToken();

  await request(app)
    .post("/api/user/role")
    .set("authorization", `Bearer ${accessToken}`)
    .set("x-refresh-token", `${refreshToken}`)
    .send({
      "name": "key-user"
    })
    .expect(401);
});

// --------------------

it("returns a 403 error when trying to access a route with not enough permissions", async () => {
  const operatorUser = await request(app)
    .post("/api/auth/signin")
    .send({
      "email": "operator@test.com",
      "password": "password"
    })
    .expect(200);

  await request(app)
    .post("/api/user")
    .set("authorization", `Bearer ${operatorUser.body.tokens.accessToken}`)
    .set("x-refresh-token", `${operatorUser.body.tokens.refreshToken}`)
    .send({
      "first_name": makeRandomString(5),
      "last_name": makeRandomString(10),
      "email": `${makeRandomString(5)}.${makeRandomString(7)}@${makeRandomString(4)}.com`,
      "password": "password",
      "role_name": "operator"
    })
    .expect(403);

});