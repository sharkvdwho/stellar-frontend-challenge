# Contract Templates

JSON-based contract template system for one-click deployment.

## Structure

```
contract-templates/
├── README.md              # This file
├── template-schema.json   # JSON schema for templates
├── counter.json           # Counter contract template
└── ...                    # More templates
```

## Template Schema

Each template is a JSON file following the schema defined in `template-schema.json`.

### Required Fields

- `id` - Unique identifier
- `name` - Display name
- `description` - What the contract does
- `contractPath` - Path to contract source (e.g., "contracts/counter")
- `contractName` - Contract name for WASM file

### Optional Fields

- `version` - Template version
- `category` - Category (basic, intermediate, advanced, defi, nft, token, governance)
- `author` - Author name
- `functions` - Array of contract functions
- `events` - Array of contract events
- `features` - List of features
- `tags` - Searchable tags
- `icon` - Emoji icon
- `difficulty` - beginner, intermediate, advanced
- `estimatedDeployTime` - Deployment time estimate

## Example Template

See `counter.json` for a complete example.

## Adding New Templates

1. Create a new JSON file in this directory
2. Follow the schema in `template-schema.json`
3. Ensure the contract source exists at the specified `contractPath`
4. The template will automatically appear in the UI

## Template Loading

Templates are loaded by the frontend from this directory. The loading logic is in `lib/templates.ts`.

