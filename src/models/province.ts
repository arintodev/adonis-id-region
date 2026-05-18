import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Country from './country.js'
import Regency from './regency.js'

export default class Province extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare countryId: string

  @column()
  declare name: string

  @belongsTo(() => Country)
  declare country: BelongsTo<typeof Country>

  @hasMany(() => Regency)
  declare regencies: HasMany<typeof Regency>
}
