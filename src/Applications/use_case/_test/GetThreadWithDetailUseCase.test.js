const Thread = require('../../../Domains/threads/entities/Thread');
const Comment = require('../../../Domains/comments/entitties/Comment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

const GetThreadWithDetailUseCase = require('../GetThreadWithDetailUseCase');

describe('GetThreadWithDetailUseCase', () => {
  it('should orchestrating the get thread with detail action correctly', async () => {
    // Arrange
    const useCasePayload = 'comment-123';
    const createdAt = new Date().toISOString();

    const mockExistsThreadRepository = new Thread({
      id: 'thread-123',
      userName: 'user-123',
      title: 'title',
      body: 'body',
      date: createdAt,
    });

    const mockExistsCommentRepository = new Comment({
      id: 'comment-123',
      userName: 'user-123',
      content: 'content',
      created_at: createdAt,
      is_deleted: false,
    });

    const momckedComments = [mockExistsCommentRepository];

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.findThreadByIdWithUser = jest.fn()
      .mockImplementation(() => Promise.resolve(mockExistsThreadRepository));

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentsWithUser = jest.fn()
      .mockImplementation(() => Promise.resolve(momckedComments));

    const addCommentUseCase = new GetThreadWithDetailUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Act
    const threadWithDetail = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(threadWithDetail).toStrictEqual(
      {
        id: 'thread-123',
        username: 'user-123',
        title: 'title',
        body: 'body',
        date: createdAt,
        comments: [
          {
            id: 'comment-123',
            username: 'user-123',
            date: createdAt,
            content: 'content',
          },
        ],
      },
    );

    expect(mockThreadRepository.findThreadByIdWithUser).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentsWithUser).toBeCalled();
  });
});
