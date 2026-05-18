import type ConfigureCommand from '@adonisjs/core/commands/configure'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()

  // 1. Register the provider in adonisrc.ts
  try {
    await codemods.updateRcFile((rcFile: any) => {
      rcFile.addProvider('@arintodev/adonis-indonesia-region/providers/location_provider')
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

  const modelsSource = path.join(packageRoot, 'src', 'models')
  const migrationsSource = path.join(packageRoot, 'database', 'migrations')
  const seedersSource = path.join(packageRoot, 'database', 'seeders')
  const dataSource = path.join(packageRoot, 'data')

  // Resolve user project destination directories
  const modelsDest = command.app.makePath('app', 'models')
  const migrationsDest = command.app.makePath('database', 'migrations')
  const seedersDest = command.app.makePath('database', 'seeders')
  const dataDest = command.app.makePath('data')

  // 3. Copy Models
  if (fs.existsSync(modelsSource)) {
    try {
      fs.mkdirSync(modelsDest, { recursive: true })
      // Copy all model files except index.ts
      const files = fs.readdirSync(modelsSource)
      for (const file of files) {
        if (file !== 'index.ts' && file !== 'index.js') {
          const srcFile = path.join(modelsSource, file)
          const destFile = path.join(modelsDest, file)
          fs.copyFileSync(srcFile, destFile)
        }
      }
      command.logger.success('Models copied successfully to app/models/')
    } catch (error) {
      command.logger.error('Failed to copy models')
      console.error(error)
    }
  }

  // 4. Copy Migrations with static timestamp prefix (000000000000x)
  const migrationFiles = {
    'create_countries_table.ts': '0000000000001_create_countries_table.ts',
    'create_provinces_table.ts': '0000000000002_create_provinces_table.ts',
    'create_regencies_table.ts': '0000000000003_create_regencies_table.ts',
    'create_districts_table.ts': '0000000000004_create_districts_table.ts',
    'create_villages_table.ts': '0000000000005_create_villages_table.ts',
  }

  if (fs.existsSync(migrationsSource)) {
    try {
      fs.mkdirSync(migrationsDest, { recursive: true })
      for (const [originalName, newName] of Object.entries(migrationFiles)) {
        const srcFile = path.join(migrationsSource, originalName)
        const destFile = path.join(migrationsDest, newName)
        if (fs.existsSync(srcFile)) {
          fs.copyFileSync(srcFile, destFile)
        }
      }
      command.logger.success('Database migrations copied successfully with 000000000000x prefix')
    } catch (error) {
      command.logger.error('Failed to copy database migrations')
      console.error(error)
    }
  }

  // 5. Copy Seeders with 1000000000000_ prefix
  if (fs.existsSync(seedersSource)) {
    try {
      fs.mkdirSync(seedersDest, { recursive: true })
      const seederFiles = fs.readdirSync(seedersSource)
      for (const file of seederFiles) {
        let destName = file
        const srcFile = path.join(seedersSource, file)
        const destFile = path.join(seedersDest, destName)
        fs.copyFileSync(srcFile, destFile)
      }
      command.logger.success('Database seeders copied successfully (renamed to 1000000000000_location_seeder.ts)')
    } catch (error) {
      command.logger.error('Failed to copy database seeders')
      console.error(error)
    }
  }

  // 6. Copy CSV Data Files
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
