import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // 1. Countries
    this.schema.createTable('countries', (table) => {
      table.string('id', 2).primary() // ISO alpha-2
      table.string('alpha_3', 3).notNullable()
      table.string('numeric', 3).notNullable()
      table.string('name').notNullable()
      table.timestamps()
    })

    // 2. Provinces
    this.schema.createTable('provinces', (table) => {
      table.integer('id').primary()
      table.string('country_id', 3).references('id').inTable('countries').onDelete('CASCADE')
      table.string('name').notNullable()
      table.timestamps()
    })

    // 3. Regencies
    this.schema.createTable('regencies', (table) => {
      table.integer('id').primary()
      table.integer('province_id').references('id').inTable('provinces').onDelete('CASCADE')
      table.string('name').notNullable()
      table.timestamps()
    })

    // 4. Districts
    this.schema.createTable('districts', (table) => {
      table.integer('id').primary()
      table.integer('regency_id').references('id').inTable('regencies').onDelete('CASCADE')
      table.string('name').notNullable()
      table.timestamps()
    })

    // 5. Villages
    this.schema.createTable('villages', (table) => {
      table.integer('id').primary()
      table.integer('district_id').references('id').inTable('districts').onDelete('CASCADE')
      table.string('name').notNullable()
      table.string('postal_code').nullable()
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTableIfExists('villages')
    this.schema.dropTableIfExists('districts')
    this.schema.dropTableIfExists('regencies')
    this.schema.dropTableIfExists('provinces')
    this.schema.dropTableIfExists('countries')
  }
}
