# IBAN Generator

A modern, extensible IBAN (International Bank Account Number) generator with a plugin-based architecture. Built with React, TypeScript, and comprehensive testing to ensure reliability for financial applications.

## 🚀 Features

- **Multi-country support**: Generate valid IBANs for Netherlands, Germany, Belgium, France, Spain, and Italy
- **Plugin architecture**: Easy to extend with new countries without code changes
- **Bank-specific generation**: Optional bank selection for realistic IBANs
- **Bulk generation**: Generate up to 100 IBANs at once
- **Format validation**: Built-in IBAN format and length validation
- **Responsive UI**: Works on desktop and mobile devices
- **Copy & Download**: Easy sharing and export functionality

## 🏗️ Architecture

### Plugin-Based Design
The application uses a plugin architecture that makes adding new countries simple:

```typescript
// Adding a new country is as simple as:
// 1. Add spec to iban-specs.json
// 2. Create a new generator class
// 3. Register in CountryGeneratorFactory
```

### Key Components
- **CountryGenerator**: Abstract base class for country-specific IBAN generation
- **CountryGeneratorFactory**: Manages generator instances and country routing
- **ConfigLoader**: Loads configuration from JSON files
- **ValidationUtils**: Comprehensive input validation
- **Custom Error Types**: Specific error handling for different failure scenarios

## 🛠️ Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ctrl-alt-ai/Generate-IBAN.git
   cd Generate-IBAN
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🧪 Testing

The project includes comprehensive test coverage:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage
- **Unit tests**: All utility functions and classes
- **Integration tests**: Country generators and factory
- **Error handling**: Custom error types and edge cases
- **Configuration**: JSON config loading and validation

## 🎯 Development

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

### Project Structure
```
src/
├── components/          # React components
├── config/             # JSON configuration files
├── errors/             # Custom error types
├── generators/         # Country-specific IBAN generators
├── styles/            # CSS styles
├── utils/             # Utility functions
└── __tests__/         # Test files
```

## 🌍 Supported Countries

| Country | Code | Format Example | Bank Selection |
|---------|------|----------------|----------------|
| Netherlands | NL | NL91 ABNA 0417 1643 00 | ✅ |
| Germany | DE | DE89 3704 0044 0532 0130 00 | ✅ |
| Belgium | BE | BE68 5390 0754 7034 | ✅ |
| France | FR | FR14 2004 1010 0505 0001 3M02 606 | ✅ |
| Spain | ES | ES91 2100 0418 4502 0005 1332 | ✅ |
| Italy | IT | IT60 X054 2811 1010 0000 0123 456 | ✅ |

## 📝 Adding a New Country

1. **Add IBAN specification** to `src/config/iban-specs.json`:
```json
{
  "XX": {
    "length": 24,
    "bankCodeLength": 4,
    "accountLength": 16,
    "bankCodeType": "numeric",
    "accountType": "alphanumericUpper"
  }
}
```

2. **Add country name** to `src/config/country-names.json`:
```json
{
  "XX": "New Country"
}
```

3. **Add bank data** (optional) to `src/config/bank-data.json`

4. **Create generator class**:
```typescript
export class NewCountryGenerator extends CountryGenerator {
  constructor(spec: IBANSpec) {
    super('XX', spec);
  }

  protected generateBBAN(bankInfo?: BankInfo | null): string {
    const bankCodePart = this.generateBankCodePart(bankInfo);
    const accountPart = this.generateAccountPart();
    return bankCodePart + accountPart;
  }
}
```

5. **Register in factory** (`src/generators/CountryGeneratorFactory.ts`)

## 🔒 Security & Validation

- **Input sanitization**: All user inputs are validated
- **Type safety**: Full TypeScript coverage
- **Error boundaries**: Graceful error handling
- **Secure random generation**: Uses Web Crypto API
- **No sensitive data storage**: Generated IBANs are for testing only

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Quick Start for Contributors
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with tests
4. Run the test suite: `npm run test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- IBAN specifications from the International Organization for Standardization (ISO 13616)
- Country-specific banking regulations and formats
- Open source community for tools and libraries

---

**⚠️ Disclaimer**: This tool generates IBANs for testing purposes only. Do not use these IBANs for actual financial transactions. Always verify IBAN validity with official banking systems.
