const NewComment = require('../../Domains/comments/entitties/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId, useCasePayload) {
    const payload = {
      owner: userId,
      thread_id: threadId,
      is_deleted: false,
      ...useCasePayload,
    };

    await this._threadRepository.findThreadById(threadId);

    const newComment = new NewComment(payload);
    const addedComment = await this._commentRepository.addComment(newComment);
    return addedComment.entityToCustomFormat();
  }
}

module.exports = AddCommentUseCase;
