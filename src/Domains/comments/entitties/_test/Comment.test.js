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
});