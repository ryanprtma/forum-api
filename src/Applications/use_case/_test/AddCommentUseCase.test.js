const NewComment = require('../../../Domains/comments/entitties/NewComment');
const AddedComment = require('../../../Domains/comments/entitties/AddedComment');
const Thread = require('../../../Domains/threads/entities/Thread');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const owner = 'user-123';
    const threadId = 'thread-123';
    const useCasePayload = {
      content: 'content',
      created_at: '2023-08-19T09:25:59.754Z',
      is_deleted: false,
    };

    const mockNewThreadRepository = new Thread({
      id: threadId,
      userId: owner,
      title: 'title',
      body: 'body',
      date: '2023-08-19T09:25:59.754Z',
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.findThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockNewThreadRepository));

    const mockNewCommentRepository = new AddedComment({
      id: 'comment-123',
      owner,
      thread_id: threadId,
      content: useCasePayload.content,
      created_at: useCasePayload.created_at,
      is_deleted: useCasePayload.is_deleted,
    });

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockNewCommentRepository));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Act
    const comment = await addCommentUseCase.execute(owner, threadId, useCasePayload);

    // Assert
    expect(comment).toStrictEqual(new AddedComment({
      id: 'comment-123',
      owner,
      thread_id: threadId,
      content: useCasePayload.content,
      created_at: useCasePayload.created_at,
      is_deleted: useCasePayload.is_deleted,
    }));

    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment(
        {
          owner,
          thread_id: threadId,
          content: useCasePayload.content,
          created_at: useCasePayload.created_at,
          is_deleted: useCasePayload.is_deleted,
        },
      ),
    );
  });
});
