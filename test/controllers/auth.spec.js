import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../index.js";
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

  it("incomplete details provided for register", (done) => {
    const registerBody = {
      fullName: "Ashutosh Panda",
      role: "ADMIN",
      password: "password",
    };
    chai
      .request(app)
      .post("/auth/register/")
      .send(registerBody)
      .end((err, res) => {
        expect(res.status).equal(400);
        expect(res.body.message).equal("fullName, email, role & password are required");
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

describe("verifies login flow", () => {
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

  it("successful login", (done) => {
    const loginBody = {
      email: "iamashutoshpanda@gmail.com",
      password: "password",
    };
    chai
      .request(app)
      .post("/auth/login/")
      .send(loginBody)
      .end((err, res) => {
        expect(res.status).equal(200);
        expect(res.body.message).equal("Login successful");

        done();
      });
  });

  it("incorrect password", (done) => {
    const loginBody = {
      email: "iamashutoshpanda@gmail.com",
      password: "INCORRECT_password",
    };
    chai
      .request(app)
      .post("/auth/login/")
      .send(loginBody)
      .end((err, res) => {
        expect(res.status).equal(401);
        expect(res.body.message).equal("Incorrect Password!");
        done();
      });
  });
  it("User not found", (done) => {
    const loginBody = {
      email: "doesnotexist@gmail.com",
      password: "password",
    };
    chai
      .request(app)
      .post("/auth/login/")
      .send(loginBody)
      .end((err, res) => {
        expect(res.status).equal(404);
        expect(res.body.message).equal("User not found.");
        done();
      });
  });

  it("Insufficient values provided", (done) => {
    const loginBody = {
      email: "doesnotexist@gmail.com",
      password: "password",
    };
    chai
      .request(app)
      .post("/auth/login/")
      .send(loginBody)
      .end((err, res) => {
        expect(res.status).equal(404);
        expect(res.body.message).equal("User not found.");
        done();
      });
  });
});
