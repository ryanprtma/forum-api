const AddedComment = require('../../Domains/comments/entitties/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

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

  async findNotDeletedCommentByIdAndThreadId(id, threadId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND thread_id = $2 AND is_deleted = false',
      values: [id, threadId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('Comment tidak ditemukan atau thread tidak ditemukan atau comment sudah dihapus!');
    }
  }

  async softDeleteComment(id) {
    const query = {
      text: 'UPDATE comments set is_deleted = true WHERE id = $1 and is_deleted = false',
      values: [id],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
