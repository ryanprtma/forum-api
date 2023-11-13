const NewThread = require('../../../Domains/threads/entities/NewThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const useCasePayload = {
      title: 'title',
      body: 'body',
    };

    const mockNewThreadRepository = new Thread({
      id: 'thread-123',
      userId: 'user-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockNewThreadRepository));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Act
    const thread = await addThreadUseCase.execute(userId, useCasePayload);

    // Assert
    expect(thread).toStrictEqual(new Thread({
      id: 'thread-123',
      userId: 'user-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));

    expect(mockThreadRepository.addThread).toBeCalledWith(
      userId,
      new NewThread(
        userId,
        {
          title: useCasePayload.title,
          body: useCasePayload.body,
        },
      ),
    );
  });
});
