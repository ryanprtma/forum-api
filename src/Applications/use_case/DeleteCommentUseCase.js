class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(id, userId, threadId) {
    await this._commentRepository.findNotDeletedCommentByIdAndThreadId(id, threadId);
    await this._threadRepository.verifyThreadOwner(threadId, userId);

    return this._commentRepository.deleteComment(id);
  }
}

module.exports = DeleteCommentUseCase;
