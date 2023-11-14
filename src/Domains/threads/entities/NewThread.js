class NewThread {
  constructor(userId, payload) {
    this._verifyPayload(userId, payload);

    this.userId = userId;
    this.title = payload.title;
    this.body = payload.body;
    this.createdAt = payload.createdAt;
  }

  _verifyPayload(userId, payload) {
    const { title, body, createdAt } = payload;

    if (!userId || !title || !body || !createdAt) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof createdAt !== 'string') {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewThread;
