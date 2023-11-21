const Comment = require('../Comment');

describe('Comment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      userName: 'user-123',
      content: 'content',
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      userName: 'user-123',
      content: 'content',
      created_at: 1234,
      is_deleted: 1234,
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Comment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      userName: 'user-123',
      content: 'content',
      created_at: '2023-08-19T09:25:59.754Z',
      is_deleted: false,
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment).toBeInstanceOf(Comment);
    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.userName);
    expect(comment.content).toEqual(payload.content);
    expect(comment.date).toEqual(payload.created_at);
    expect(comment.is_deleted).toEqual(payload.is_deleted);
  });

  it('should create custom Comment format correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      userName: 'user-123',
      content: 'content',
      created_at: '2023-08-19T09:25:59.754Z',
      is_deleted: false,
    };

    const customCommentFormat = {
      id: payload.id,
      username: payload.userName,
      date: payload.created_at,
      content: payload.content,
    };

    // Action
    const comment = new Comment(payload).entityToCustomFormat();

    // Assert
    expect(comment).toStrictEqual(customCommentFormat);
  });

  it('entityToCustomFormat when is_deleted is true', () => {
    const deletedComment = new Comment(
      {
        id: 'comment-123',
        userName: 'user-123',
        content: 'content',
        created_at: '2023-08-19T09:25:59.754Z',
        is_deleted: true,
      },
    );

    const formattedComment = deletedComment.entityToCustomFormat();

    expect(formattedComment).toEqual({
      id: 'comment-123',
      username: 'user-123',
      date: '2023-08-19T09:25:59.754Z',
      content: '**komentar telah dihapus**',
    });
  });

  describe('entityToCustomFormat', () => {
    it('should return object in custom format when not deleted', () => {
      const payload = {
        id: 'comment_id',
        userName: 'user_name',
        content: 'This is a comment',
        created_at: '2023-11-21',
        is_deleted: false,
      };
      const comment = new Comment(payload);
      const customFormat = comment.entityToCustomFormat();
      expect(customFormat).toEqual({
        id: payload.id,
        username: payload.userName,
        date: payload.created_at,
        content: payload.content,
      });
    });

    it('should return object in custom format when deleted', () => {
      const payload = {
        id: 'comment_id',
        userName: 'user_name',
        content: 'This is a comment',
        created_at: '2023-08-19T09:25:59.754Z',
        is_deleted: true,
      };
      const comment = new Comment(payload);
      const customFormat = comment.entityToCustomFormat();
      expect(customFormat).toEqual({
        id: payload.id,
        username: payload.userName,
        date: payload.created_at,
        content: '**komentar telah dihapus**',
      });
    });
  });
});
