const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NewComment = require('../../../Domains/comments/entitties/NewComment');
const AddedComment = require('../../../Domains/comments/entitties/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return added comment correctly', async () => {
      // Arrange
      const owner = 'user-123';
      const createdAt = new Date().toISOString();
      const newComment = new NewComment(
        {
          owner,
          thread_id: 'thread-123',
          content: 'content',
          created_at: createdAt,
          is_deleted: false,
        },
      );
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const owner = 'user-123';
      const createdAt = new Date().toISOString();
      const newComment = new NewComment(
        {
          owner,
          thread_id: 'thread-123',
          content: 'content',
          created_at: createdAt,
          is_deleted: false,
        },
      );
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        owner: 'user-123',
        thread_id: 'thread-123',
        content: 'content',
        created_at: createdAt,
        is_deleted: false,
      }));
    });
  });
});
