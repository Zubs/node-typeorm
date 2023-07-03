import Joi from "joi";
import { User } from "../models/User";
import { AppDataSource } from "../util/database";
import { Request, Response } from "express";

type UserRequestData = {
  name: string,
  email: string,
  password: string
};

const validateUserData = (req: Request): UserRequestData => {
  const userData = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
    passwordConfirmation: Joi.string().valid(Joi.ref('password')).required(),
  });

  const { error, value } = userData.validate(req.body);

  if (error) {
    if (error.message.includes('passwordConfirmation')) {
      error.message = 'Password confirmation does not match';
    }

    throw error;
  }

  return value;
};

export const registerNewUser = async (req: Request, res: Response) => {
  let userData: UserRequestData;

  try {
    userData = validateUserData(req);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message.replace(/"|'/g, ''),
    });
  }

  const user = new User();
  user.name = userData.name;
  user.email = userData.email;
  user.password = userData.password;

  try {
    await AppDataSource.manager.save(user);
  } catch (error) {
    return res.status(400).json({
      message: 'User already exists'
    });
  }

  return res.json({
    ...user
  });
};
