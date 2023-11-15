const Comment = require('../../Domains/comments/entitties/Comment');

class GetThreadWithDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(id) {
    const thread = await this._threadRepository.findThreadByIdWithUser(id);
    const comments = await this._commentRepository.getCommentsWithUser();

    const customComments = await comments.map((comment) => comment.entityToCustomFormat());
    return {
      ...thread,
      comments: customComments,
    };
  }
}

module.exports = GetThreadWithDetailUseCase;
