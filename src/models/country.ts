import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Province from './province.js'

export default class Country extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare alpha3: string

  @column()
  declare numeric: string

  @column()
  declare name: string

  @hasMany(() => Province)
  declare provinces: HasMany<typeof Province>
}
