const Comment = require('../../Domains/comments/entitties/Comment');

class GetThreadWithDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(id) {
    const thread = await this._threadRepository.findThreadByIdWithUser(id);
    const comments = await this._commentRepository.getCommentsByThreadIdWithUser(id);

    const customComments = await comments.map((comment) => new Comment({
      id: comment.id,
      userName: comment.username,
      content: comment.content,
      created_at: comment.created_at,
      is_deleted: comment.is_deleted,
    }).entityToCustomFormat());
    return {
      ...thread,
      comments: customComments,
    };
  }
}

module.exports = GetThreadWithDetailUseCase;
