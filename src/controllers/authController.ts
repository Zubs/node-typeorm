import Joi from "joi";
import { User } from "../models/User";
import { AppDataSource } from "../util/database";
import { Request, Response } from "express";
import { genSalt, hash } from 'bcrypt';

type UserRequestData = {
  name: string,
  email: string,
  password: string
};

/**
 * Validate user request data and return a cleaned version
 * @param req
 * @returns UserRequestData
 */
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

  const salt = await genSalt();

  const user = new User();
  user.name = userData.name;
  user.email = userData.email;
  user.password = await hash(userData.password, salt);

  try {
    await AppDataSource.manager.save(user);
  } catch (error: any) {
    console.log(error);

    if (error.message.includes('Duplicate entry')) {
      return res.status(400).json({
        message: 'User already exists'
      });
    } else {
      return res.status(400).json({
        message: 'Error creating user'
      });
    }
  }

  return res.json({
    ...user
  });
};
