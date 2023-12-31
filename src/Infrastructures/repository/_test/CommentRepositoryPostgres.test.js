const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NewComment = require('../../../Domains/comments/entitties/NewComment');
const AddedComment = require('../../../Domains/comments/entitties/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    const createdAt = new Date().toISOString();
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123', createdAt });
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

  describe('findNotDeletedCommentByIdAndThreadId function', () => {
    it('should not throw an error if the comment exists and is not deleted', async () => {
      // Arrange
      const createdAt = new Date().toISOString();
      await CommentsTableTestHelper.addComment({ id: 'comment-123', created_at: createdAt, thread_id: 'thread-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & assert
      await expect(commentRepositoryPostgres.findNotDeletedCommentByIdAndThreadId('comment-123', 'thread-123')).resolves.not.toThrow();
    });

    it('should throw NotFoundError when not deleted comment by id and thread id from database not exists', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.findNotDeletedCommentByIdAndThreadId('xxx', 'xxx')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('getCommentsByThreadIdWithUser function', () => {
    it('should return comment with user correctly', async () => {
      // Arrange
      const createdAt = new Date().toISOString();
      await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123', created_at: createdAt });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const commentsWithUser = await commentRepositoryPostgres.getCommentsByThreadIdWithUser('thread-123');

      // Assert
      expect(commentsWithUser).toHaveLength(1);
    });
  });

  describe('deleteComment function', () => {
    it('should soft delete comment from database', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-124', created_at: new Date().toISOString() });
      // Action
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await commentRepositoryPostgres.deleteComment('comment-124');

      // Assert
      const deletedComment = await CommentsTableTestHelper.findDeletedCommentById('comment-124');
      expect(deletedComment).toHaveLength(1);
      expect(deletedComment[0].id).toEqual('comment-124');
      expect(deletedComment[0].is_deleted).toEqual(true);
    });
  });
});
