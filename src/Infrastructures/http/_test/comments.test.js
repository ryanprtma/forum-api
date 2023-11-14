const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const authReqPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const threadReqPayload = {
        title: 'dicoding',
        body: 'Dicoding Indonesia',
      };

      const commentReqPayload = {
        content: 'dicoding',
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

      // add thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: { Authorization: `Bearer ${accessToken}` },
        payload: threadReqPayload,
      });

      const threadResponsejson = JSON.parse(threadResponse.payload);
      const { id: threadId } = threadResponsejson.data.addedThread;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: { Authorization: `Bearer ${accessToken}` },
        payload: commentReqPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
    });
  });
});
