const { db: Base } = require('../../../app')

class DocumentModel extends Base.Model {

  schema() {
    return {
      title: {
        type: String,
        required: true
      }
    }
  }
  
}

module.exports = DocumentModel