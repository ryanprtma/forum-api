const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
      const authReqPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const threadReqPayload = {
        title: 'dicoding',
        body: 'Dicoding Indonesia',
      };

      const server = await createServer(container);

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // auth user
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: authReqPayload,
      });

      const authResponseJson = JSON.parse(authResponse.payload);
      const { accessToken } = authResponseJson.data;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: { Authorization: `Bearer ${accessToken}` },
        payload: threadReqPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const authReqPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const threadReqPayload = {
        title: 2,
        body: ['Dicoding Indonesia'],
      };

      const server = await createServer(container);

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // auth user
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: authReqPayload,
      });

      const authResponseJson = JSON.parse(authResponse.payload);
      const { accessToken } = authResponseJson.data;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: { Authorization: `Bearer ${accessToken}` },
        payload: threadReqPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
  });
});
