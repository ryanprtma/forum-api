const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const Thread = require('../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(userId, newThread) {
    const { title, body, createdAt } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const user_id = userId;
    const created_at = createdAt;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, user_id, title, body, created_at',
      values: [id, user_id, title, body, created_at],
    };

    const result = await this._pool.query(query);

    const thread = { ...result.rows[0] };

    return new AddedThread({
      id: thread.id,
      userId: thread.user_id,
      title: thread.title,
      body: thread.body,
      date: thread.created_at,
    });
  }

  // TODO: change addedThread To Thread
  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('Thread tidak ditemukan!');
    }

    const thread = { ...result.rows[0] };

    return new AddedThread({
      id: thread.id,
      userId: thread.user_id,
      title: thread.title,
      body: thread.body,
      date: thread.created_at,
    });
  }

  async findThreadByIdWithUser(id) {
    const query = {
      text: 'SELECT threads.*, users.username FROM threads JOIN users ON threads.user_id = users.id WHERE threads.id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('Thread tidak ditemukan!');
    }

    const thread = { ...result.rows[0] };

    return new Thread({
      id: thread.id,
      userName: thread.username,
      title: thread.title,
      body: thread.body,
      date: thread.created_at,
    });
  }

  async verifyThreadOwner(id, userId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Thread tidak ditemukan!');
    }

    const thread = result.rows[0];
    if (thread.user_id !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini!');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
