const InvariantError = require('../../Commons/exceptions/InvariantError');
const AddedComment = require('../../Domains/comments/entitties/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const {
      owner, thread_id, content, created_at, is_deleted,
    } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, owner, thread_id, content, created_at, is_deleted',
      values: [id, owner, thread_id, content, created_at, is_deleted],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }
}

module.exports = CommentRepositoryPostgres;
