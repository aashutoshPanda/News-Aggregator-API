import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../index.js";
import { createToken, createNewUser, deleteAllUsers } from "../../src/services/user.js";
// await connectDB();
chai.use(chaiHttp);

const expect = chai.expect;

describe("Tests for preferences", () => {
  let user;
  let token;

  beforeEach(async function () {
    await deleteAllUsers();
    user = await createNewUser({
      fullName: "Ashutosh Panda",
      email: "iamashutoshpanda@gmail.com",
      role: "ADMIN",
      password: "password",
    });
    user.preferences = ["technology"];
    await user.save();
    token = createToken(user.id);
  });

  // Test for a route that requires authorization
  describe("GET /preferences", () => {
    it("get the set preferences of the dummy user", (done) => {
      chai
        .request(app)
        .get("/preferences")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.same.members(["technology"]);
          done();
        });
    });
  });

  // Test for a route that requires authorization
  describe("PUT /preferences", () => {
    it("add new preference for the user", (done) => {
      const newPreferenceBody = ["technology", "entertainment"];
      chai
        .request(app)
        .put("/preferences")
        .send(newPreferenceBody)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.same.members(newPreferenceBody);
          done();
        });
    });
  });
});
