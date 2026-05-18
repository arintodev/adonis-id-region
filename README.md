# @arintodev/adonis-id-region

A reusable and scalable region module for AdonisJS 7 using TypeScript and Lucid ORM. This package provides models, migrations, seeders, services, and validators for managing countries, provinces, regencies, districts, and villages.

## Features
- **Clean Architecture:** Domain-oriented and scalable structure.
- **Lucid Models:** Relationships pre-configured (Country -> Province -> Regency -> District -> Village).
- **Service Class:** Reusable `RegionService` for querying hierarchical region data.
- **Data Seeding:** Built-in seeder for bulk-inserting CSV data using transactions and chunking (optimized for large datasets like villages).
- **VineJS Validator:** Pre-compiled validator for region fields.

## Installation

You can install this package directly from your GitHub repository:

```bash
npm install arintodev/adonis-id-region
```

## Configuration

Simply run the configure command in your AdonisJS project root:

```bash
node ace configure @arintodev/adonis-id-region
```

This command will automatically:
1. Register the **RegionProvider** inside your `adonisrc.ts` file.
2. Copy the **database migrations** to your project (`database/migrations/`).
3. Copy the **database seeders** to your project (`database/seeders/`).
4. Copy all **CSV data files** to your project (`data/`).

After running the configuration, you can run migrations and seed the database:

```bash
# Run migrations
node ace migration:run

# Seed geographical data
node ace db:seed
```

## Example API Usage

**Using the RegionService inside a controller:**

```typescript
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { RegionService } from '@arintodev/adonis-id-region'

@inject()
export default class RegionController {
  constructor(private RegionService: RegionService) {}

  public async getProvinces({ request, response }: HttpContext) {
    const countryId = request.input('country_id', 'IDN')
    const provinces = await this.RegionService.getProvinces(countryId)
    return response.json(provinces)
  }

  public async getFullAddress({ params, response }: HttpContext) {
    const address = await this.RegionService.fullAddress(params.villageId)
    return response.json({ address })
  }
}
```

**Using the Validator:**

```typescript
import type { HttpContext } from '@adonisjs/core/http'
import { addressValidator } from '@arintodev/adonis-id-region'

export default class AddressController {
  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(addressValidator)
    
    // Save address with payload...
    return response.created(payload)
  }
}
```
