/**
 *
 * helrTest.js - used to test some of the helper functions we utilize in our TinyApp project
 *
 */


const { assert } = require('chai');

const { getUserByEmail } = require('../helper.js');

// Test Database
const testUsers = {
  '54321': {
    id: "54321",
    email: "maggie.smith@hotmail.com",
    password: "$2a$10$3GVbAzBiwABZ5CcMs7rsXePtI8wwJLKZL9mVMpL7drv9josqu.MdK",

  },
  '12345': {
    id: "12345",
    email: "ethan.steip@gmail.com",
    password: "$2a$10$IpfSpG9HMIxAaoiW0W/BduItqapZkUzLwzWSzZ9g1QNg0GFhSzECG",
  },
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("ethan.steip@gmail.com", testUsers);
    const expectedUserID = "12345";

    assert.equal(user.id, expectedUserID);
  });
  it('should return a user with valid email', function() {
    const user = getUserByEmail("maggie.smith@hotmail.com", testUsers);
    const expectedUserID = "54321";
    
    assert.equal(user.id, expectedUserID);
  });
});