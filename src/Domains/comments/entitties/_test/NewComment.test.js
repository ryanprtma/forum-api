const NewComment = require('../NewComment');

describe('NewComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      thread_id: 'thread-123',
      content: 'content',
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      thread_id: 'thread-123',
      content: 'content',
      created_at: 1234,
      is_deleted: 1234,
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment entities correctly', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      thread_id: 'thread-123',
      content: 'content',
      created_at: '2023-08-19T09:25:59.754Z',
      is_deleted: false,
    };

    // Action
    const newComment = new NewComment(payload);

    // Assert
    expect(newComment).toBeInstanceOf(NewComment);
    expect(newComment.owner).toEqual(payload.owner);
    expect(newComment.thread_id).toEqual(payload.thread_id);
    expect(newComment.content).toEqual(payload.content);
    expect(newComment.created_at).toEqual(payload.created_at);
    expect(newComment.is_deleted).toEqual(payload.is_deleted);
  });
});
