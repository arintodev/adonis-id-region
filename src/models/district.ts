import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Regency from './regency.js'
import Village from './village.js'

export default class District extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare regencyId: number

  @column()
  declare name: string

  @belongsTo(() => Regency)
  declare regency: BelongsTo<typeof Regency>

  @hasMany(() => Village)
  declare villages: HasMany<typeof Village>
}
