const InvariantError = require('../../Commons/exceptions/InvariantError');
const Thread = require('../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(userId, newThread) {
    const { title, body } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const user_id = userId;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, user_id, title, body',
      values: [id, user_id, title, body],
    };

    const result = await this._pool.query(query);

    const thread = { ...result.rows[0] };

    return new Thread({
      id: thread.id,
      userId: thread.user_id,
      title: thread.title,
      body: thread.body,
    });
  }
}

module.exports = ThreadRepositoryPostgres;
