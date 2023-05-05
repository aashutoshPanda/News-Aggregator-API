process.env.NODE_ENV = "TEST";

import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../index.js";
import User from "../../src/models/user.js";
import { deleteAllUsers, createNewUser } from "../../src/services/user.js";

chai.use(chaiHttp);
const expect = chai.expect;

describe("verifies register flow", () => {
  before(async function () {
    // runs once before the first test in this block
    // delete all users and make just one user with the following details

    await deleteAllUsers();
    await createNewUser({
      fullName: "Ashutosh Panda",
      email: "iamashutoshpanda@gmail.com",
      role: "ADMIN",
      password: "password",
    });
  });

  it("successful register", (done) => {
    const registerBody = {
      fullName: "Ashutosh Panda",
      email: "newemailiamashutoshpanda@gmail.com",
      role: "ADMIN",
      password: "password",
    };
    chai
      .request(app)
      .post("/auth/register/")
      .send(registerBody)
      .end((err, res) => {
        expect(res.status).equal(200);
        expect(res.body.message).equal("User Registered successfully");
        done();
      });
  });

  it("Email already exists", (done) => {
    const registerBody = {
      fullName: "Ashutosh Panda",
      email: "iamashutoshpanda@gmail.com",
      role: "ADMIN",
      password: "password",
    };
    chai
      .request(app)
      .post("/auth/register/")
      .send(registerBody)
      .end((err, res) => {
        expect(res.status).equal(400);
        expect(res.body.message).equal("email_1 dup must be unique.");
        done();
      });
  });
});
