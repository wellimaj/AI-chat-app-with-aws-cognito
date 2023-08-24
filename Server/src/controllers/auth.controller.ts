import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { CognitoService } from "../services/cognito.service";
export class AuthController {
  public path = "/auth";
  public router = express.Router();
  constructor() {
    this.initRoutes();
  }
  private initRoutes() {
    this.router.post("/register", this.validateBody("register"), this.register);
    this.router.post("/login", this.validateBody("login"), this.login);
    this.router.post("/verify", this.validateBody("verify"), this.verify);
  }
  register(req: Request, res: Response) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(422).json({ error: result.array() });
    }
    console.log("success");
    const { username, password, email } = req.body;
    const cognito = new CognitoService();
    let success = cognito
      .register(username, password, [{ Name: "email", Value: email }])
      .then((success) => {
        if (success) {
          res.status(200).end();
        } else {
          res.status(500).end();
        }
      });
  }
  login(req: Request, res: Response) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(422).json({ error: result.array() });
    }
    const { username, password } = req.body;
    const cognito = new CognitoService();
    cognito.login(username, password).then((success) => {
      if (success) {
      return res
        .status(200)
        .json({ AccessToken: success.AuthenticationResult.AccessToken });
      } else {
       return res.status(401).send({ error: "wrong username or password" });
      }
    });
    console.log("success");
    // return res.status(200).end();
  }
  verify(req: Request, res: Response) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(422).json({ error: result.array() });
    }
    const { username, code } = req.body;
    const cognito = new CognitoService();
    cognito.verify(username, code).then((success) => {
      if (success) {
       return res.status(200).end();  
      } else {
        return res.status(401).end(); 
      }
    });
    console.log("success");
    return res.status(200).end();
  }
  private validateBody(type: string) {
    switch (type) {
      case "register":
        return [
          body("email").notEmpty().normalizeEmail().isEmail(),
          body("password").isString().isLength({ min: 8 }),
        ];
      case "login":
        return [
          body("username").notEmpty(),
          body("password").isString().isLength({ min: 8 }),
        ];
      case "verify":
        return [
          body("username").notEmpty(),
          body("code").isString().isLength({ min: 6, max: 6 }),
        ];
    }
  }
}
