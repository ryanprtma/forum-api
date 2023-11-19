const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepostory = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.findNotDeletedCommentByIdAndThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const mockThreadRepository = new ThreadRepostory();

    mockThreadRepository.verifyThreadOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Act
    await deleteCommentUseCase.execute('comment-123', 'user-123', 'thread-123');

    // Assert
    expect(mockCommentRepository.findNotDeletedCommentByIdAndThreadId)
      .toBeCalledWith('comment-123', 'thread-123');
    expect(mockThreadRepository.verifyThreadOwner)
      .toBeCalledWith('thread-123', 'user-123');
    expect(mockCommentRepository.deleteComment)
      .toBeCalledWith('comment-123');
  });
});
