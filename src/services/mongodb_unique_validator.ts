import { mergeDeep } from "./methods"


// Function typecheck helper
function isFunc (val: any): boolean { return (typeof val === 'function') }

function deepPath(schema: any, pathName: any): any {
  let path
  const paths = pathName.split('.')
  if (paths.length > 1) pathName = paths.shift()
  if (isFunc(schema.path)) path = schema.path(pathName)
  if (path && path.schema) path = deepPath(path.schema, paths.join('.'))
  return path
}

// (fn: (schema: mongoose.Schema<any, mongoose.Model<any, any, any>, {}>, opts?: any) => void, opts?: any): mongoose.Schema<any, mongoose.Model<any, any, any>, {}>

const plugin: any = function(schema: any, options: { type?: any; message?: any }) {
  options = options || {}
  const type = options.type || plugin.defaults?.type || 'unique'
  const message = options.message || plugin.defaults?.message || 'Error, expected `{PATH}` to be unique. Value: `{VALUE}`'

  // Mongoose Schema objects don't describe default _id indexes
  // https://github.com/Automattic/mongoose/issues/5998
  const indexes = [[{ _id: 1 }, { unique: true }]].concat(schema.indexes())

  // Dynamically iterate all indexes
  for (let i = 0; i < indexes.length; i++) {
    const index = indexes[i]
    const indexOptions: any = index[1]

    if (indexOptions.unique) {
      const paths = Object.keys(index[0])

      for (let j = 0; j < paths.length; j++) {
        const pathName: string = paths[j]

        // Choose error message
        const pathMessage = typeof indexOptions.unique === 'string' ? indexOptions.unique : message

        // Obtain the correct path object
        const path = deepPath(schema, pathName) || schema.path(pathName)

        if (path) {
          // Add an async validator
          path.validate(function() {
            return new Promise((resolve, reject) => {
              const isSubdocument = isFunc(schema.ownerDocument)
              const isQuery = schema.constructor.name === 'Query'
              const parentDoc = isSubdocument ? schema.ownerDocument() : schema
              const isNew = typeof parentDoc.isNew === 'boolean' ? parentDoc.isNew : !isQuery

              const conditions: any = {}
              for (let i = 0; i < paths.length; i++) {
                const name: string = paths[i]
                let pathValue

                // If the doc is a query, this is a findAndUpdate
                if (isQuery) pathValue = schema._update?.name || schema._update[`$set.${name}`]
                else {
                  const selectedName = isSubdocument ? name.split('.').pop()?.toString() : name
                  pathValue = schema[selectedName || '']
                }

                // Wrap with case-insensitivity
                if (path.options.uniqueCaseInsensitive || indexOptions.uniqueCaseInsensitive) {
                  // Escape RegExp chars
                  pathValue = pathValue.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
                  pathValue = new RegExp('^' + pathValue + '$', 'i')
                }

                conditions[name] = pathValue                
              }

              if (!isNew) {
                // Use conditions the user has with find*AndUpdate
                if (isQuery) {
                  for (let i = 0; i < schema._conditions.length; i++) {
                    const condition = schema._conditions[i];
                    conditions[i] = { $ne: condition }
                  }
                } else if (schema._id) {
                  conditions._id = { $ne: schema._id }
                }
              }

              if (indexOptions.partialFilterExpression) {
                mergeDeep(conditions, indexOptions.partialFilterExpression)
              }

              // Obtain the model depending on context
              // https://github.com/Automattic/mongoose/issues/3430
              // https://github.com/Automattic/mongoose/issues/3589
              let model
              if (isQuery) {
                model = schema.model
              } else if (isSubdocument) {
                model = schema.ownerDocument().model(schema.ownerDocument().constructor.modelName)
              } else if (isFunc(schema.model)) {
                model = schema.model(schema.constructor.modelName)
              }

              // Is this model a discriminator and the unique index is on the whole collection,
              // not just the instances of the discriminator? If so, use the base model to query.
              // https://github.com/Automattic/mongoose/issues/4965
              if (model.baseModelName && indexOptions.partialFilterExpression === null) {
                model = model.db.model(model.baseModelName)
              }

              model.find(conditions).countDocuments((err: any, count: number) => {
                if(err) {
                  console.log('Error on unique validator:', err)
                  reject(err)
                }
                resolve(count === 0)
              })
            })
          }, pathMessage, type)
        }

      }

    }

  }

}

export default plugin
