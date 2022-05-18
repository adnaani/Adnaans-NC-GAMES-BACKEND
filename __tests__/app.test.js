const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("API: /api/categories", () => {
  describe("GET: /api/categories", () => {
    test("200: responds with array of categories objects containing the properties of, describe and slug  ", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body: { categories } }) => {
          expect(categories).toHaveLength(4);
          expect(categories).toBeInstanceOf(Array);
          categories.forEach((category) => {
            expect(category).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("GET - errors: /api/categories", () => {
    test("404: responds with error message page not found", () => {
      return request(app)
        .get("/api/invalid_categories")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("invalid endpoint");
        });
    });
  });
});

describe("API: /api/reviews", () => {
  describe("GET: /api/reviews", () => {
    test("200: responds with array of reviews objects", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toHaveLength(13);
          expect(reviews).toBeInstanceOf(Array);
          reviews.forEach((review) => {
            expect(review).toEqual(
              expect.objectContaining({
                review_id: expect.any(Number),
                title: expect.any(String),
                designer: expect.any(String),
                owner: expect.any(String),
                review_img_url: expect.any(String),
                category: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(String),
              })
            );
          });
        });
    });
    test("200: responds with array of reviews objects sorted in ascending order by the date", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("created_at");
        });
    });
  });

  describe("GET: /api/reviews/:review_id", () => {
    test("200: responds with a review object containing the keys: review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at,", () => {
      const review_id = 1;
      const time = new Date(1610964020514).toISOString();

      return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeInstanceOf(Object);
          expect(reviews).toEqual(
            expect.objectContaining({
              review_id: 1,
              title: "Agricola",
              designer: "Uwe Rosenberg",
              owner: "mallionaire",
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              review_body: "Farmyard fun!",
              category: "euro game",
              created_at: time,
              votes: 1,
            })
          );
        });
    });
  });
  describe("GET - Comment Count: /api/reviews/:review_id", () => {
    test("200: responds with a review object containing an additional key of comment count with the value of 0 when the comment does not exist", () => {
      const review_id = 9;
      const time = new Date(1610964101251).toISOString();

      return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeInstanceOf(Object);
          expect(reviews).toEqual(
            expect.objectContaining({
              review_id: 9,
              title: "A truly Quacking Game; Quacks of Quedlinburg",
              category: "social deduction",
              designer: "Wolfgang Warsch",
              owner: "mallionaire",
              review_body:
                "Ever wish you could try your hand at mixing potions? Quacks of Quedlinburg will have you mixing up a homebrew like no other. Each player buys different ingredients (chips) that are drawn at random to reach the most points, but watch out, you'd better not let your cauldrom explode.",
              review_img_url:
                "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
              created_at: time,
              votes: 10,
              comment_count: "0",
            })
          );
        });
    });
    test("200: responds with a review object containing an additional key of comment count when the comment is more than 0", () => {
      const review_id = 2;
      const time = new Date(1610964101251).toISOString();

      return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeInstanceOf(Object);
          expect(reviews).toEqual(
            expect.objectContaining({
              review_id: 2,
              title: "Jenga",
              category: "dexterity",
              designer: "Leslie Scott",
              owner: "philippaclaire9",
              review_body: "Fiddly fun for all the family",
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              created_at: time,
              votes: 5,
              comment_count: "3",
            })
          );
        });
    });
  });
  describe("GET - errors: /api/reviews/:review_id", () => {
    test("400: responds with an error message when passed an endpoint with an incorrect data type", () => {
      const review_id = "invalid_type";
      return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("input is not valid");
        });
    });
    test("404: responds with an error message when passed an endpoint with correct data type but does not exist", () => {
      const review_id = 999;
      return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe(`review with id: ${review_id} does not exist`);
        });
    });
  });

  describe("GET: /api/reviews/:review_id/comment", () => {
    test("200: responds with a comment object containing the keys: comment_id, body, votes, author, review_id, created_at", () => {
      const review_id = 1;
      const time = new Date(1616874588110).toISOString();

      return request(app)
        .get(`/api/reviews/${review_id}/comment`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeInstanceOf(Object);
          expect(reviews).toEqual(
            expect.objectContaining({
              comment_id: 1,
              body: "Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite",
              votes: 10,
              author: "philippaclaire9",
              review_id: 3,
              created_at: time,
            })
          );
        });
    });
  });

  describe("PATCH: /api/reviews/:review_id", () => {
    test("201: responds with a votes incrementing by inc_vote", () => {
      const review_id = 1;

      return request(app)
        .patch(`/api/reviews/${review_id}`)
        .send({ inc_votes: 5 })
        .expect(201)
        .then(({ body: { review } }) => {
          expect(review.votes).toBe(6);
          expect(review.review_id).toBe(1);
        });
    });
    test("201: responds with a votes decrementing by inc_vote", () => {
      const review_id = 1;
      const inc_vote = { inc_votes: -100 };

      return request(app)
        .patch(`/api/reviews/${review_id}`)
        .send(inc_vote)
        .expect(201)
        .then(({ body: { review } }) => {
          expect(review).toBeInstanceOf(Object);
          expect(review.votes).toBe(-99);
          expect(review.review_id).toBe(1);
        });
    });
  });
  describe("PATCH - errors: /api/reviews/:review_id", () => {
    test("400: responds with an error message when passed an endpoint with an incorrect data type", () => {
      const review_id = 1;
      const inc_vote = { inc_votes: "NaN" };

      return request(app)
        .patch(`/api/reviews/${review_id}`)
        .expect(400)
        .send(inc_vote)
        .then(({ body: { message } }) => {
          expect(message).toBe("input is not valid");
        });
    });
    test("400: responds with an error message when passed an endpoint where review_id is invalid data type", () => {
      const review_id = "invalid";
      const inc_vote = { inc_votes: "3" };

      return request(app)
        .patch(`/api/reviews/${review_id}`)
        .expect(400)
        .send(inc_vote)
        .then(({ body: { message } }) => {
          expect(message).toBe("input is not valid");
        });
    });

    test("400: responds with an error message when passed an endpoint where inc_vote key missing", () => {
      const review_id = 1;
      const inc_vote = { invalid_vote: 5 };

      return request(app)
        .patch(`/api/reviews/${review_id}`)
        .expect(400)
        .send(inc_vote)
        .then(({ body: { message } }) => {
          expect(message).toBe("input is missing");
        });
    });

    test("404: responds with an error message when passed an endpoint with correct data type but does not exist", () => {
      const review_id = 999;
      const inc_vote = { inc_votes: "3" };

      return request(app)
        .patch(`/api/reviews/${review_id}`)
        .expect(404)
        .send(inc_vote)
        .then(({ body: { message } }) => {
          expect(message).toBe(`review with id: ${review_id} does not exist`);
        });
    });
  });
});

describe("API: /api/users", () => {
  describe("GET: /api/users", () => {
    test("200: responds with an array of user objects containing the properties of username, name and avatar_url", () => {
      return request(app)
        .get("/api/users/")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toHaveLength(4);
          expect(users).toBeInstanceOf(Array);
          users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("GET - errors: /api/users", () => {
    test("404: responds with error message", () => {
      return request(app)
        .get("/api/invalid_users")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("invalid endpoint");
        });
    });
  });
});
