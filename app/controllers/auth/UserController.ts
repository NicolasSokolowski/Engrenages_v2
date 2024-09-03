import { Request, Response } from "express";
import { UserDatamapperReq } from "../../datamappers/index.datamappers";
import { CoreController } from "../CoreController";
import { UserControllerReq } from "../interfaces/auth/UserControllerReq";
import { Password } from "../../helpers/Password";
import { BadRequestError } from "../../errors/BadRequestError.error";
import { DatabaseConnectionError } from "../../errors/DatabaseConnectionError.error";
import { generateToken } from "../../helpers/generateToken";
import { NotFoundError } from "../../errors/NotFoundError.error";


export class UserController extends CoreController<UserControllerReq, UserDatamapperReq> {
  constructor(datamapper: UserControllerReq["datamapper"]) {
    super(datamapper);

    this.datamapper = datamapper;
  }

  createUser = async (req: Request, res: Response): Promise<void> => {
    const { first_name, last_name, email, password, role_name }: UserDatamapperReq["data"] = req.body;

    const hashedPassword = await Password.toHash(password);

    if (!hashedPassword) {
      throw new BadRequestError("The password could not be hashed");
    }

    const newUserData = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role_name
    }

    const newUser = await this.datamapper.insert(newUserData);

    if (!newUser) {
      throw new DatabaseConnectionError();
    }

    const userJwt = generateToken(newUser);

    res.status(201).send({ user: newUser, tokens: userJwt});
  }

  update = async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id);

    if (!id) {
      throw new BadRequestError("This id doesn't exist");
    }

    let { first_name, last_name, email, role_name }: Partial<UserDatamapperReq["data"]> = req.body;

    const userToUpdate = await this.datamapper.findByPk(id);

    if (!userToUpdate) {
      throw new NotFoundError();
    }

    first_name ? first_name : first_name = userToUpdate.first_name;
    last_name ? last_name : last_name = userToUpdate.last_name;
    email ? email : email = userToUpdate.email;
    role_name ? role_name : role_name = userToUpdate.role_name;

    const newUserData = { 
      ...userToUpdate, 
      first_name,
      last_name,
      email,
      role_name
    };

    const updatedUser = await this.datamapper.update(newUserData);

    if (!updatedUser) {
      throw new DatabaseConnectionError();
    }

    res.status(200).send(updatedUser);
  }

  updatePassword = async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id);

    if (!id) {
      throw new BadRequestError("This id doesn't exist");
    }
    const userToUpdate = await this.datamapper.findByPk(id);

    if (!userToUpdate) {
      throw new NotFoundError();
    }

    const userID: number = userToUpdate.id;

    let { currentPassword, newPassword } = req.body;

    const passwordCheck = await Password.compare(userToUpdate.password, currentPassword);

    if (!passwordCheck) {
      throw new BadRequestError("Current password is incorrect");
    }

    const newHashedPassword = await Password.toHash(newPassword);

    const newUserData = {
      id: userID,
      password: newHashedPassword
    }

    const updatedUser = await this.datamapper.update(newUserData);

    if (!updatedUser) {
      throw new DatabaseConnectionError();
    }

    res.status(200).send(updatedUser);
  }
}