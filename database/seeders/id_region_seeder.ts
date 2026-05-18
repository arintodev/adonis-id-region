import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import fs from 'node:fs'
import path from 'node:path'
import csv from 'csv-parser'
import { Country, Province, Regency, District, Village } from '@arintodev/adonis-id-region/models'

export default class IndonesiaRegionSeeder extends BaseSeeder {
  private async parseCsv(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = []
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error))
    })
  }

  public async run() {
    const dataPath = path.resolve('data')

    // Using a transaction to ensure data integrity
    const trx = await db.transaction()

    try {
      // 1. Seed Countries
      const countriesFile = path.join(dataPath, 'countries.csv')
      if (fs.existsSync(countriesFile)) {
        const countries = await this.parseCsv(countriesFile)
        if (countries.length > 0) {
          await Country.updateOrCreateMany('id', countries, { client: trx })
          console.log(`Seeded ${countries.length} countries`)
        }
      }

      // 2. Seed Provinces
      const provincesFile = path.join(dataPath, 'provinces.csv')
      if (fs.existsSync(provincesFile)) {
        const provinces = await this.parseCsv(provincesFile)
        if (provinces.length > 0) {
          await Province.updateOrCreateMany('id', provinces, { client: trx })
          console.log(`Seeded ${provinces.length} provinces`)
        }
      }

      // 3. Seed Regencies
      const regenciesFile = path.join(dataPath, 'regencies.csv')
      if (fs.existsSync(regenciesFile)) {
        const regencies = await this.parseCsv(regenciesFile)
        if (regencies.length > 0) {
          await Regency.updateOrCreateMany('id', regencies, { client: trx })
          console.log(`Seeded ${regencies.length} regencies`)
        }
      }

      // 4. Seed Districts
      const districtsFile = path.join(dataPath, 'districts.csv')
      if (fs.existsSync(districtsFile)) {
        const districts = await this.parseCsv(districtsFile)
        if (districts.length > 0) {
          // Chunked insert for districts if it's large, though usually okay
          const chunkSize = 1000
          for (let i = 0; i < districts.length; i += chunkSize) {
            const chunk = districts.slice(i, i + chunkSize)
            await District.updateOrCreateMany('id', chunk, { client: trx })
          }
          console.log(`Seeded ${districts.length} districts`)
        }
      }

      // 5. Seed Villages (can be very large, use chunking)
      const villagesFile = path.join(dataPath, 'villages.csv')
      if (fs.existsSync(villagesFile)) {
        const villages = await this.parseCsv(villagesFile)
        if (villages.length > 0) {
          const chunkSize = 1000
          for (let i = 0; i < villages.length; i += chunkSize) {
            const chunk = villages.slice(i, i + chunkSize)
            await Village.updateOrCreateMany('id', chunk, { client: trx })
            if ((i + chunkSize) % 10000 === 0) {
              console.log(`Seeded ${Math.min(i + chunkSize, villages.length)} villages...`)
            }
          }
          console.log(`Seeded ${villages.length} villages in total`)
        }
      }

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      console.error('Seeding failed, rolled back.', error)
      throw error
    }
  }
}
