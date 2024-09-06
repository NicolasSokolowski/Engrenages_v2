import request from "supertest";
import { app } from "../../../index.app";
import { BadRequestError } from "../../../errors/BadRequestError.error";
import jwt from "jsonwebtoken";
import { makeRandomString } from "../../../helpers/makeRandomString.helper";
import { Pool } from "pg";
import { Password } from "../../../helpers/Password";

const poolConfig = {
  connectionString: 
    `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST || "localhost"}:${process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432}/${process.env.NODE_ENV === "test" ? process.env.POSTGRES_TEST_DATABASE : process.env.POSTGRES_DATABASE}`
};

const pool = new Pool(poolConfig);

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

export const generateOperatorAccessToken = async () => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new BadRequestError("Access token secret must be set");
  }
  const secret = process.env.ACCESS_TOKEN_SECRET;

  const userPayload = {
    id: 1,
    email: "operator@test.com",
    role: "password"
  };

  return jwt.sign(userPayload, secret);
}

export const generateOperatorRefreshToken = async () => {
  if(!process.env.REFRESH_TOKEN_SECRET) {
    throw new BadRequestError("Refresh token secret must be set");
  }
  const secret = process.env.REFRESH_TOKEN_SECRET;
  
  const userPayload = {
    id: 1,
    email: "operator@test.com",
    role: "password"
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
  const response = await request(app)
    .post("/api/user/role")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": makeRandomString(5)
    });

    return response.body;
};

export const createUser = async () => {
  const roleName = await createRole();

  const response = await request(app)
    .post("/api/user")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "first_name": makeRandomString(5),
      "last_name": makeRandomString(10),
      "email": `${makeRandomString(5)}.${makeRandomString(7)}@${makeRandomString(4)}.com`,
      "password": "password",
      "role_name": `${roleName.name}`
    });

    return response.body.user;
};

export const createBlockageCode = async () => {
  const response = await request(app)
    .post("/api/product/blockage")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": makeRandomString(3),
      "description": makeRandomString(50)
    });

  return response.body;
};

export const createProduct = async () => {
  const response = await request(app)
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

  return response.body;
};

export const databaseInsertsForTests = async () => {
  const operatorRoleCreationQuery = 
    `INSERT INTO "role" (name) 
    VALUES ('operator');`;

  const adminRoleCreationQuery = 
    `INSERT INTO "role" (name) 
    VALUES ('admin');`;

  const adminCreationQuery = async (first_name: string, last_name: string, email: string, password: string, role_name: string) => {
    const hashedPassword = await Password.toHash(password);
    return {
      text: `INSERT INTO "user" (first_name, last_name, email, password, role_name)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (email) DO NOTHING;`,
      values: [first_name, last_name, email, hashedPassword, role_name]
    };
  };

  const operatorCreationQuery = async (first_name: string, last_name: string, email: string, password: string, role_name: string) => {
    const hashedPassword = await Password.toHash(password);
    return {
      text: `INSERT INTO "user" (first_name, last_name, email, password, role_name)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (email) DO NOTHING;`,
      values: [first_name, last_name, email, hashedPassword, role_name]
    };
  }

  try {
    await pool.query(adminRoleCreationQuery);
    await pool.query(operatorRoleCreationQuery);
    
    const adminUserQuery = await adminCreationQuery('Admin', 'Admin', 'admin@test.com', 'password', 'admin');
    const operatorUserQuery = await operatorCreationQuery('Operator', 'Operator', 'operator@test.com', 'password', 'operator');
    await pool.query(adminUserQuery);
    await pool.query(operatorUserQuery);
  } catch (err) {
    console.error(err);
  }
};

export const databaseDeletionAfterTests = async () => {
  const deleteLocationTypes = `DELETE FROM "location_type"`;
  const deleteLocationBlockages = `DELETE FROM "location_blockage_type"`;
  const deleteLocations = `DELETE FROM "location"`;
  const deleteBlockages = `DELETE FROM "product_blockage_type"`;
  const deleteProducts = `DELETE FROM "product"`;
  const deleteUsers = `DELETE FROM "user"`;
  const deleteRoles = `DELETE FROM "role"`;

  try {
    await pool.query(deleteUsers);
    await pool.query(deleteLocations);
    await pool.query(deleteLocationBlockages);
    await pool.query(deleteLocationTypes);
    await pool.query(deleteProducts);
    await pool.query(deleteBlockages);
    await pool.query(deleteRoles);
  } catch (err) {
    console.error(err);
  }
}