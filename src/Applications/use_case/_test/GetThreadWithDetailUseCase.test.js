const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

const GetThreadWithDetailUseCase = require('../GetThreadWithDetailUseCase');

describe('GetThreadWithDetailUseCase', () => {
  it('should orchestrating the get thread with detail action correctly', async () => {
    // Arrange
    const useCasePayload = 'comment-123';
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.findThreadByIdWithUser = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentsWithUser = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const addCommentUseCase = new GetThreadWithDetailUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Act
    await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.findThreadByIdWithUser).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentsWithUser).toBeCalled();
  });
});
