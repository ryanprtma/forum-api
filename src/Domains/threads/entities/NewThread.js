class NewThread {
  constructor(userId, payload) {
    this._verifyPayload(userId, payload);

    this.userId = userId;
    this.title = payload.title;
    this.body = payload.body;
  }

  _verifyPayload(userId, payload) {
    const { title, body } = payload;

    if (!userId || !title || !body) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewThread;
