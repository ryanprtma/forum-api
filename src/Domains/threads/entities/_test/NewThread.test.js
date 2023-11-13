const NewThread = require('../NewThread');

describe('NewThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const userId = 'user-123';
    const payload = {
      title: 'title',
    };

    // Action & Assert
    expect(() => new NewThread(userId, payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const userId = 'user-123';
    const payload = {
      title: 'title',
      body: 1234,
    };

    // Action & Assert
    expect(() => new NewThread(userId, payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThread entities correctly', () => {
    // Arrange
    const userId = 'user-123';
    const payload = {
      title: 'title',
      body: 'body',
    };

    // Action
    const newThread = new NewThread(userId, payload);

    // Assert
    expect(newThread).toBeInstanceOf(NewThread);
    expect(newThread.userId).toEqual(userId);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
  });
});
