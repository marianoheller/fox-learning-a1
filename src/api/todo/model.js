import mongoose, { Schema } from 'mongoose'

const todoSchema = new Schema({
  name: {
    type: String
  },
  disabled: {
    type: Boolean,
    default: false
  },
  done: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

todoSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      name: this.name,
      disabled: this.disabled,
      done: this.done,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Todo', todoSchema)

export const schema = model.schema
export default model
