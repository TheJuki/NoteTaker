import Datastore from '@seald-io/nedb'

export default new Datastore({
  autoload: true,
  inMemoryOnly: true
})
