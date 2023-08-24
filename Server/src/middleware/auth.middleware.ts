import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import fetch from "node-fetch";
let pems = {};
export class AuthMiddleware {
  private poolRegion: string = process.env.POOL_REGION;
  private UserPoolId = process.env.USER_POOL_ID;
  constructor() {
    this.setup();
  }
  verfiyToken(req: any, res: Response, next: Function): void {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(" ")[1];
    if (!token) res.status(401).end();
    let decodeJwt: any = jwt.decode(token, { complete: true });
    if (!decodeJwt) res.status(401).end();
    let kid = decodeJwt.header.kid;
    let pem = pems[kid];
    if (!pem) {
      res.status(401).end();
    }
    jwt.verify(token, pem, (err, payload): any => {
      if (err) {
        console.log(err);
        res.status(401).end();
      }
      console.log(payload, "payload");
      req.jwtData = payload;
      next();
    });
  }
  private async setup() {
    const url = `https://cognito-idp.${this.poolRegion}.amazonaws.com/${this.UserPoolId}/.well-known/jwks.json`;
    try {
      const resp: any = await fetch(url);
      if (resp.status !== 200) {
        throw "request failed";
      }
      const data = await resp.json();
      const { keys } = data;
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        const key_id = key.kid;
        const modulus = key.n;
        const exponent = key.e;
        const key_type = key.kty;
        const jwk = { kty: key_type, n: modulus, e: exponent };
        const pem = jwkToPem(jwk);
        pems[key_id] = pem;
      }
      console.log("got all pems");
    } catch (error) {
      console.log("error in jwks", error);
    }
  }
}
