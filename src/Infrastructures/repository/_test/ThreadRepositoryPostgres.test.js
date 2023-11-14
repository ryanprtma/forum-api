const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ username: 'dicoding' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread and return thread correctly', async () => {
      // Arrange
      const userId = 'user-123';
      const createdAt = new Date().toISOString();
      const newThread = new NewThread(
        userId,
        {
          title: 'dicoding',
          body: 'Dicoding Indonesia',
          createdAt,
        },
      );
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(userId, newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return thread correctly', async () => {
      // Arrange
      const userId = 'user-123';
      const createdAt = new Date().toISOString();
      const newThread = new NewThread(
        userId,
        {
          title: 'dicoding',
          body: 'Dicoding Indonesia',
          createdAt,
        },
      );
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const thread = await threadRepositoryPostgres.addThread(userId, newThread);

      // Assert
      expect(thread).toStrictEqual(new Thread({
        id: 'thread-123',
        userId: 'user-123',
        title: 'dicoding',
        body: 'Dicoding Indonesia',
        date: createdAt,
      }));
    });
  });

  describe('findThreadById function', () => {
    it('should throw NotFoundError when thread not exists', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.findThreadById('xxx')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('verifyThreadOwner function', () => {
    it('should throw NotFoundError when thread not exists', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadOwner('xxx', 'xxx')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('verifyThreadOwner function', () => {
    it('should throw NotFoundError when thread not owned by user id', async () => {
      // Arrange
      const createdAt = new Date().toISOString();
      ThreadsTableTestHelper.addThread({ id: 'thread-123', createdAt });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadOwner('thread-123', 'xxx')).rejects.toThrowError(AuthorizationError);
    });
  });
});
