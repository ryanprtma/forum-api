const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const createdAt = new Date().toISOString();
    const useCasePayload = {
      title: 'title',
      body: 'body',
      createdAt,
    };

    const mockAddedThreadRepository = new AddedThread({
      id: 'thread-123',
      userId: 'user-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      date: createdAt,
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThreadRepository));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Act
    const addedThread = await addThreadUseCase.execute(userId, useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      userId: 'user-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      date: useCasePayload.createdAt,
    }));

    expect(mockThreadRepository.addThread).toBeCalledWith(
      userId,
      new NewThread(
        userId,
        {
          title: useCasePayload.title,
          body: useCasePayload.body,
          createdAt: useCasePayload.createdAt,
        },
      ),
    );
  });
});
