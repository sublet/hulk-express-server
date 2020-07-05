const { v4: uuidv4 } = require('uuid')

class BaseService {

  constructor(model) {
    this._model = model
    this._mongodb = model.build()
  }

  async create(data) {
    if (!data) throw new Error('Data is required')
    return await this._mongodb.create(data)
  }

  async createMany() {
    return await this._mongodb.insertMany(...arguments)
  }

  async readOne(id) {
    if (!id) throw new Error('id is required')

    const query = {
      _id: id
    }

    let results = await this._mongodb.findOne(query).exec()

    if (!results) {
      throw new Error('Not found.')
    }
    return results
  }

  async readMany(query, { limit = 20, populate = null, sort = null } = {}) {
    let cursor = this._mongodb.find(query)
    if (limit) cursor.limit(+limit)
    if (populate) populate.map(itm => cursor = cursor.populate(itm))
    if (sort) cursor = cursor.sort(sort)
    let results = cursor.exec()
    return results.map(obj => obj.toClient())
  }

  async createOrUpdate(query, data) {
    if (!query) throw new Error('query is required')
    if (!data) throw new Error('data is required')

    data.modifiedAt = Date.now()

    const insertData = {
      _id: uuidv4(),
      createdAt: Date.now(),
      deleted: false
    }

    return await this._mongodb
      .findOneAndUpdate(
        query,
        { $set: data, $setOnInsert: insertData },
        { new: true, upsert: true }
      )
      .exec()
  }

  find() {
    return this._mongodb.find(...arguments)
  }

  async findOne(query) {
    const results = await this._mongodb.findOne(query).exec()
    return (results) ? results.toClient() : results
  }
  
  async count() {
    return await this._mongodb.count(...arguments).exec()
  }
  
  async update() {
    return await this._mongodb.updateOne(...arguments).exec()
  }

  async updateMany() {
    return await this._mongodb.updateMany(...arguments).exec()
  }

  async delete() {
    return await this._mongodb.deleteOne(...arguments).exec()
  }

  async deleteMany() {
    return await this._mongodb.deleteMany(...arguments).exec()
  }

  async remove() {
    return await this._mongodb.remove(...arguments)
  }

  aggregate(params) {
    return this._mongodb.aggregate(params).exec()
  }

  // prepare(obj) {
  //   // console.log(this._mongodb.schema.toObject())
  //   // obj = obj.toHexString()
  //   console.log(typeof obj._id)
  //   obj.id = obj._id
  //   delete obj._id
  //   delete obj.deleted
  //   delete obj.__v
  //   return obj
  // }

  // update(id, data) {

  // }

  // delete() {

  // }

}

module.exports = BaseService