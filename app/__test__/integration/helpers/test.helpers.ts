import request from "supertest";
import { app } from "../../../index.app";
import { BadRequestError } from "../../../errors/BadRequestError.error";
import jwt from "jsonwebtoken";
import { makeRandomString } from "../../../helpers/makeRandomString.helper";

export const generateAccessToken = async () => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new BadRequestError("Access token secret must be set");
  }
  const secret = process.env.ACCESS_TOKEN_SECRET;

  const userPayload = {
    id: 1,
    email: "admin@test.com",
    role: "admin"
  };

  return jwt.sign(userPayload, secret);
}

export const generateRefreshToken = async () => {
  if(!process.env.REFRESH_TOKEN_SECRET) {
    throw new BadRequestError("Refresh token secret must be set");
  }
  const secret = process.env.REFRESH_TOKEN_SECRET;
  
  const userPayload = {
    id: 1,
    email: "admin@test.com",
    role: "admin"
  };

  return jwt.sign(userPayload, secret);
};

export const expiredAccessToken = async () => {
  if(!process.env.ACCESS_TOKEN_SECRET) {
    throw new BadRequestError("Access token secret must be set");
  }
  const secret = process.env.ACCESS_TOKEN_SECRET;
  
  const response = await request(app)
  .post("/api/auth/signin")
  .send({
    "email": "admin@test.com",
    "password": "password"
  })
  .expect(200);

  const userPayload = {
    id: `${response.body.user.id}`,
    email: `${response.body.user.email}`,
    role: `${response.body.user.role}`,
    exp: Math.floor(Date.now() / 1000) - (60 * 60)
  };

  return jwt.sign(userPayload, secret);
}

export const expiredRefreshToken = async () => {
  if(!process.env.REFRESH_TOKEN_SECRET) {
    throw new BadRequestError("Refresh token secret must be set");
  }
  const secret = process.env.REFRESH_TOKEN_SECRET;
  
  const response = await request(app)
  .post("/api/auth/signin")
  .send({
    "email": "admin@test.com",
    "password": "password"
  })
  .expect(200);

  const userPayload = {
    id: `${response.body.user.id}`,
    email: `${response.body.user.email}`,
    role: `${response.body.user.role}`,
    exp: Math.floor(Date.now() / 1000) - (60 * 60)
  };

  return jwt.sign(userPayload, secret);
}

export const createLocationType = async () => {
  return request(app)
    .post("/api/location/type")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": makeRandomString(5),
      "description": makeRandomString(50),
      "length": 120,
      "width": 80,
      "height": 190
    });  
};

export const createLocationBlockageType = async () => {
  return request(app)
    .post("/api/location/blockage")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": makeRandomString(3),
      "description": makeRandomString(50)
    });
};

export const createLocation = async () => {
  const locationType = await createLocationType();

  return request(app)
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
    });
};

export const loggedAdmin = async () => {
  const response = await request(app)
    .post("/api/auth/signin")
    .send({
    "email": "admin@test.com",
    "password": "password"
    });
  
  return response;
}

export const loggedOperator = async () => {
  const response = await request(app)
    .post("/api/auth/signin")
    .send({
    "email": "operator@test.com",
    "password": "password"
    });
  
  return response;
}

export const createRole = async () => {
  const admin = await loggedAdmin();

  return request(app)
    .post("/api/user/role")
    .set("authorization", `${admin.body.tokens.accessToken}`)
    .set("x-refresh-token", `${admin.body.tokens.refreshToken}`)
    .send({
      "name": makeRandomString(5)
    });
};

export const createUser = async () => {
  const admin = await loggedAdmin();

  const roleName = await createRole();

  return request(app)
    .post("/api/user")
    .set("authorization", `${admin.body.tokens.accessToken}`)
    .set("x-refresh-token", `${admin.body.tokens.refreshToken}`)
    .send({
      "first_name": makeRandomString(5),
      "last_name": makeRandomString(10),
      "email": `${makeRandomString(5)}.${makeRandomString(7)}@${makeRandomString(4)}.com`,
      "password": "password",
      "role_name": `${roleName.body.name}`
    });
};

export const createBlockageCode = async () => {

  return request(app)
    .post("/api/product/blockage")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": makeRandomString(3),
      "description": makeRandomString(50)
    });
};

export const createProduct = async () => {
  return request(app)
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
      "price": 23.70
    });
};