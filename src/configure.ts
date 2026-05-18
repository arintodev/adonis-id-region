import type ConfigureCommand from '@adonisjs/core/commands/configure'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()

  // 1. Register the provider in adonisrc.ts
  try {
    await codemods.updateRcFile((rcFile: any) => {
      rcFile.addProvider('@arintodev/adonis-location/providers/location_provider')
    })
    command.logger.success('Provider registered successfully in adonisrc.ts')
  } catch (error) {
    command.logger.error('Failed to register provider in adonisrc.ts')
    console.error(error)
  }

  // 2. Resolve package source directories
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  
  // In the built package, configure.js will reside in build/src/configure.js
  // So the package root is 2 levels up (build/) or we can resolve it relatively
  const packageRoot = path.resolve(__dirname, '../..')
  
  const migrationsSource = path.join(packageRoot, 'database', 'migrations')
  const seedersSource = path.join(packageRoot, 'database', 'seeders')
  const dataSource = path.join(packageRoot, 'data')

  // Resolve user project destination directories
  const migrationsDest = command.app.makePath('database', 'migrations')
  const seedersDest = command.app.makePath('database', 'seeders')
  const dataDest = command.app.makePath('data')

  // 3. Copy Migrations
  if (fs.existsSync(migrationsSource)) {
    try {
      fs.mkdirSync(migrationsDest, { recursive: true })
      fs.cpSync(migrationsSource, migrationsDest, { recursive: true })
      command.logger.success('Database migrations copied successfully')
    } catch (error) {
      command.logger.error('Failed to copy database migrations')
      console.error(error)
    }
  }

  // 4. Copy Seeders
  if (fs.existsSync(seedersSource)) {
    try {
      fs.mkdirSync(seedersDest, { recursive: true })
      fs.cpSync(seedersSource, seedersDest, { recursive: true })
      command.logger.success('Database seeders copied successfully')
    } catch (error) {
      command.logger.error('Failed to copy database seeders')
      console.error(error)
    }
  }

  // 5. Copy CSV Data Files
  if (fs.existsSync(dataSource)) {
    try {
      fs.mkdirSync(dataDest, { recursive: true })
      fs.cpSync(dataSource, dataDest, { recursive: true })
      command.logger.success('CSV data files copied successfully')
    } catch (error) {
      command.logger.error('Failed to copy CSV data files')
      console.error(error)
    }
  }
}
