# @arintodev/adonis-location

A reusable and scalable location module for AdonisJS 7 using TypeScript and Lucid ORM. This package provides models, migrations, seeders, services, and validators for managing countries, provinces, regencies, districts, and villages.

## Features
- **Clean Architecture:** Domain-oriented and scalable structure.
- **Lucid Models:** Relationships pre-configured (Country -> Province -> Regency -> District -> Village).
- **Service Class:** Reusable `LocationService` for querying hierarchical location data.
- **Data Seeding:** Built-in seeder for bulk-inserting CSV data using transactions and chunking (optimized for large datasets like villages).
- **VineJS Validator:** Pre-compiled validator for location fields.

## Installation

Since this is an internal package, you can install it from your local directory or private npm registry:

```bash
npm install @arintodev/adonis-location
```

## Configuration

Simply run the configure command in your AdonisJS project root:

```bash
node ace configure @arintodev/adonis-location
```

This command will automatically:
1. Register the **LocationProvider** inside your `adonisrc.ts` file.
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

**Using the LocationService inside a controller:**

```typescript
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { LocationService } from '@arintodev/adonis-location'

@inject()
export default class LocationController {
  constructor(private locationService: LocationService) {}

  public async getProvinces({ request, response }: HttpContext) {
    const countryId = request.input('country_id', 'IDN')
    const provinces = await this.locationService.getProvinces(countryId)
    return response.json(provinces)
  }

  public async getFullAddress({ params, response }: HttpContext) {
    const address = await this.locationService.fullAddress(params.villageId)
    return response.json({ address })
  }
}
```

**Using the Validator:**

```typescript
import type { HttpContext } from '@adonisjs/core/http'
import { addressValidator } from '@arintodev/adonis-location'

export default class AddressController {
  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(addressValidator)
    
    // Save address with payload...
    return response.created(payload)
  }
}
```
