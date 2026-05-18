import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'countries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 2).primary() // ISO alpha-2
      table.string('alpha3', 3).notNullable()
      table.string('numeric', 3).notNullable()
      table.string('name').notNullable()
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
