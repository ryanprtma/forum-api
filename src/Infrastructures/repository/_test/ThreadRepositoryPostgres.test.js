const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
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
      const newThread = new NewThread(
        userId,
        {
          title: 'dicoding',
          body: 'Dicoding Indonesia',
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
      const newThread = new NewThread(
        userId,
        {
          title: 'dicoding',
          body: 'Dicoding Indonesia',
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
      }));
    });
  });
});
