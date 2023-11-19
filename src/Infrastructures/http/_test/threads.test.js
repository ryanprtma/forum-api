const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const authReqPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const createdAt = new Date().toISOString();
      const threadReqPayload = {
        title: 'dicoding',
        body: 'Dicoding Indonesia',
        createdAt,
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

  describe('when GET /threads/{threadId}/comments/{commentId}', () => {
    it('should return thread with comments', async () => {
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

      // add comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: { Authorization: `Bearer ${accessToken}` },
        payload: commentReqPayload,
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
