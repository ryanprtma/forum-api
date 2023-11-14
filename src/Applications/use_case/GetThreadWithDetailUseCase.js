class GetThreadWithDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(id) {
    const thread = await this._threadRepository.findThreadByIdWithUser(id);
    const comments = await this._commentRepository.getCommentsWithUser();
    return {
      ...thread,
      comments,
    };
  }
}

module.exports = GetThreadWithDetailUseCase;
