import { Request, Response } from "express";
import { CoreController } from "../CoreController";
import { BadRequestError } from "../../errors/BadRequestError.error";
import { NotFoundError } from "../../errors/NotFoundError.error";
import { Password } from "../../helpers/Password";
import { generateToken } from "../../helpers/generateToken";
import { UserControllerReq } from "../interfaces/auth/UserControllerReq";
import { UserDatamapperReq } from "../../datamappers/index.datamappers";


export class AuthController extends CoreController<UserControllerReq, UserDatamapperReq> {
  constructor(datamapper: UserControllerReq["datamapper"]) {
    super(datamapper);

    this.datamapper = datamapper;
  }

  signin = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Please provide an email and a password");
    }

    const user = await this.datamapper.findBySpecificField("email", email);

    if (!user) {
      throw new NotFoundError();
    }

    const checkPassword = await Password.compare(user.password, password);

    if (!checkPassword) {
      throw new BadRequestError("Incorrect password");
    }

    const userPayload = {
      id: user.id,
      email: user.email,
      role: user.role_name 
    };

    const userJwt = generateToken(userPayload);

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).send({ user: userWithoutPassword, tokens: userJwt })
  }
}