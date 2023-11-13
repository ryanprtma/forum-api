const NewComment = require('../../Domains/comments/entitties/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(userId, threadId, useCasePayload) {
    const payload = {
      owner: userId,
      thread_id: threadId,
      is_deleted: false,
      ...useCasePayload,
    };

    const newComment = new NewComment(payload);
    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
