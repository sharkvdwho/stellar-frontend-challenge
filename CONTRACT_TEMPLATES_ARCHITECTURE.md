# Contract Templates System - Architecture

## Overview

A JSON-based contract template system that allows users to browse, select, and deploy pre-configured Soroban contracts with one click.

## Architecture

### File Structure

```
contract-templates/
├── README.md              # Template documentation
├── template-schema.json   # JSON schema validation
├── counter.json           # Counter template example
└── [more-templates].json  # Additional templates

lib/
└── templates.ts           # Template loading and management

app/
└── templates/
    └── page.tsx           # Templates UI page
```

### Data Flow

```
1. User visits /templates
   ↓
2. Frontend loads templates from contract-templates/*.json
   ↓
3. Templates displayed in grid with search/filter
   ↓
4. User selects template
   ↓
5. User enters deployer secret & network
   ↓
6. Frontend calls deployContract() with template.contractPath
   ↓
7. Backend compiles and deploys contract
   ↓
8. Contract saved to localStorage
   ↓
9. User redirected to contract dashboard
```

## Components

### 1. Template JSON Files (`contract-templates/*.json`)

**Purpose**: Define contract metadata and configuration

**Schema**: Validated against `template-schema.json`

**Fields**:
- `id` - Unique identifier
- `name` - Display name
- `description` - Contract description
- `contractPath` - Path to source code
- `contractName` - WASM file name
- `functions` - Available functions
- `events` - Emitted events
- `features` - Feature list
- `tags` - Searchable tags
- `difficulty` - Complexity level
- `icon` - Visual identifier

### 2. Template Loader (`lib/templates.ts`)

**Functions**:
- `loadTemplates()` - Load all templates
- `loadTemplate(id)` - Load specific template
- `getTemplatesByCategory()` - Filter by category
- `searchTemplates()` - Search functionality

**Implementation Notes**:
- Currently returns hardcoded templates
- Future: Fetch from `/contract-templates/*.json` files
- Can be extended to fetch from API

### 3. Templates Page (`app/templates/page.tsx`)

**Features**:
- Template grid display
- Search functionality
- Category filtering
- Template selection
- One-click deployment
- Wallet connection
- Network selection (testnet/mainnet)

**UI Components**:
- Template cards with metadata
- Search bar
- Category filter
- Deployment panel
- Loading states
- Error handling

## Template Format

### Example: counter.json

```json
{
  "id": "counter",
  "name": "Counter Contract",
  "description": "A simple counter contract...",
  "contractPath": "contracts/counter",
  "contractName": "counter",
  "functions": [...],
  "events": [...],
  "features": [...],
  "tags": [...],
  "icon": "🔢",
  "difficulty": "beginner"
}
```

## Integration Points

### 1. Deploy Integration

Templates integrate with existing deploy system:
- Uses `deployContract()` from `lib/api.ts`
- Uses `contractPath` from template
- Uses `contractName` from template

### 2. Storage Integration

Deployed contracts saved to localStorage:
- Uses `saveContract()` from `lib/storage.ts`
- Stores contract ID, name, network

### 3. Navigation

After deployment:
- Redirects to `/contracts/:id`
- Shows contract dashboard

## Future Enhancements

### Phase 1 (Current)
- ✅ JSON template files
- ✅ Template loader
- ✅ Templates UI page
- ✅ One-click deployment

### Phase 2 (Future)
- [ ] Template validation against schema
- [ ] Template marketplace/registry
- [ ] Template versioning
- [ ] Template dependencies
- [ ] Template parameters/config
- [ ] Template preview/README
- [ ] Template ratings/reviews

### Phase 3 (Advanced)
- [ ] Template builder UI
- [ ] Template sharing
- [ ] Template categories/collections
- [ ] Template search with filters
- [ ] Template analytics

## Usage

### For Users

1. Navigate to `/templates`
2. Browse available templates
3. Search or filter by category
4. Select a template
5. Enter deployer secret key
6. Choose network (testnet/mainnet)
7. Click "Deploy Contract"
8. Wait for deployment
9. View contract dashboard

### For Developers

1. Create contract source in `contracts/`
2. Create JSON template in `contract-templates/`
3. Follow schema in `template-schema.json`
4. Template appears automatically in UI

## API Integration

Templates use existing deployment API:

```typescript
deployContract({
  contractPath: template.contractPath,
  contractName: template.contractName,
  network: 'testnet',
  deployerSecret: 'S...'
})
```

## Error Handling

- Template loading errors → Show error message
- Deployment errors → Show error with details
- Missing contract source → Backend validation error
- Invalid template JSON → Schema validation error

## Security Considerations

- Template JSON files are static (no code execution)
- Contract source code is validated by backend
- Deployer secret key handled securely
- Network selection prevents accidental mainnet deployment

## Performance

- Templates loaded once on page load
- Search/filter happens client-side
- No API calls until deployment
- Fast template switching

## Accessibility

- Keyboard navigation support
- Screen reader friendly
- Clear visual hierarchy
- Error messages accessible

