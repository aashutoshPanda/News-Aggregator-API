import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../index.js";
import { createToken, createNewUser, deleteAllUsers } from "../../src/services/user.js";
import { addOrUpdateNewsInDB } from "../../src/services/news.js";

chai.use(chaiHttp);

const expect = chai.expect;

describe("Tests for news", () => {
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

    const news = await addOrUpdateNewsInDB({
      author: "Griffin Wynne",
      title: "Vets Say These Products Might Help Your Anxious Dog",
      url: "https://www.huffpost.com/entry/products-for-anxious-dogs-vets_l_64468410e4b03c1b88c8445b",
      publishedAt: "2023-04-28T13:45:16Z",
    });
    user.read.push(news._id);
    await user.save();
    token = createToken(user.id);
  });

  // Test for a route that requires authorization
  describe("GET /news/read", () => {
    it("check whether we get the read news items or not", (done) => {
      chai
        .request(app)
        .get("/news/read/")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.deep.members([
            {
              newsId: "afdbdc5a68ab457989b67336b4afce44",
              title: "Vets Say These Products Might Help Your Anxious Dog",
              url: "https://www.huffpost.com/entry/products-for-anxious-dogs-vets_l_64468410e4b03c1b88c8445b",
              publishedAt: "2023-04-28T13:45:16.000Z",
            },
          ]);
          done();
        });
    });
  });
});
