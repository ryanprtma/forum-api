const AddedComment = require('../AddedComment');

describe('AddedComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      thread_id: 'thread-123',
      content: 'content',
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      owner: 'user-123',
      thread_id: 'thread-123',
      content: 'content',
      created_at: 1234,
      is_deleted: 1234,
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedComment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      owner: 'user-123',
      thread_id: 'thread-123',
      content: 'content',
      created_at: '2023-08-19T09:25:59.754Z',
      is_deleted: false,
    };

    // Action
    const addedComment = new AddedComment(payload);

    // Assert
    expect(addedComment).toBeInstanceOf(AddedComment);
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.owner).toEqual(payload.owner);
    expect(addedComment.thread_id).toEqual(payload.thread_id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.created_at).toEqual(payload.created_at);
    expect(addedComment.is_deleted).toEqual(payload.is_deleted);
  });
});
