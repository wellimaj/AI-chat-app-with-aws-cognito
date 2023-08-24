import AWS from "aws-sdk";
import crpyto from "crypto";
export class CognitoService {
  private config = {
    region: process.env.POOL_REGION,
  };
  private secretHash: string = process.env.SECRETHASH;
  private clientId: string = process.env.CLIENTID;
  private cognitoIdentity: any;
  constructor() {
    this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider(this.config);
  }
  public async register(
    username: string,
    password: string,
    userAttr: Array<any>
  ): Promise<boolean> {
    const params = {
      ClientId: this.clientId,
      Username: username,
      Password: password,
      SecretHash: this.generateHash(username),
      UserAttributes: userAttr,
      ClientMetadata: {
        SECRET_HASH: this.generateHash(username),
      },
    };
    try {
      const data = await this.cognitoIdentity.signUp(params).promise();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  private generateHash(username: string): string {
    return crpyto
      .createHmac("SHA256", this.secretHash)
      .update(username + this.clientId)
      .digest("base64");
  }
  public async verify(username: string, code: string): Promise<boolean> {
    const params = {
      Username: username,
      ConfirmationCode: code,
      SecretHash: this.generateHash(username),
      ClientId: this.clientId,
    };
    try {
      const data = await this.cognitoIdentity.confirmSignUp(params).promise();
      console.log(data);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  public async login(username: string, password: string): Promise<any> {
    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: this.generateHash(username),
      },
    };
    try {
      const data = await this.cognitoIdentity.initiateAuth(params).promise();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
