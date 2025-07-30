# IBAN Generator

A modern, extensible IBAN (International Bank Account Number) generator with a plugin-based architecture. Built with React, TypeScript, and comprehensive testing to ensure reliability for financial applications.

## 🚀 Features

- **Multi-country support**: Generate valid IBANs for 14 European countries including Netherlands, Germany, Belgium, France, Spain, Italy, Austria, Switzerland, Luxembourg, Portugal, United Kingdom, Sweden, Norway, and Denmark
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

| Country | Code | Format Example | Length | Bank Selection |
|---------|------|----------------|--------|----------------|
| Netherlands | NL | NL91 ABNA 0417 1643 00 | 18 | ✅ |
| Germany | DE | DE89 3704 0044 0532 0130 00 | 22 | ✅ |
| Belgium | BE | BE68 5390 0754 7034 | 16 | ✅ |
| France | FR | FR14 2004 1010 0505 0001 3M02 606 | 27 | ✅ |
| Spain | ES | ES91 2100 0418 4502 0005 1332 | 24 | ✅ |
| Italy | IT | IT60 X054 2811 1010 0000 0123 456 | 27 | ✅ |
| Austria | AT | AT61 1904 3002 3457 3201 | 20 | ✅ |
| Switzerland | CH | CH93 0076 2011 6238 5295 7 | 21 | ✅ |
| Luxembourg | LU | LU28 0019 4006 4475 0000 | 20 | ✅ |
| Portugal | PT | PT50 0002 0123 1234 5678 9015 4 | 25 | ✅ |
| United Kingdom | GB | GB29 NWBK 6016 1331 9268 19 | 22 | ✅ |
| Sweden | SE | SE45 5000 0000 0583 9825 7466 | 24 | ✅ |
| Norway | NO | NO93 8601 1117 947 | 15 | ✅ |
| Denmark | DK | DK50 0040 0440 1162 43 | 18 | ✅ |

### Country-Specific Features

#### 🇦🇹 Austria (AT)
- **Format**: AT + 2 check + 5 bank code + 11 account number
- **Banks**: Bank Austria, Erste Bank, Raiffeisen Bank

#### 🇨🇭 Switzerland (CH)
- **Format**: CH + 2 check + 5 bank code + 12 account number  
- **Banks**: UBS, Credit Suisse, PostFinance

#### 🇱🇺 Luxembourg (LU)
- **Format**: LU + 2 check + 3 bank code + 13 account number
- **Banks**: BGL BNP Paribas, Banque Internationale, Spuerkeess

#### 🇵🇹 Portugal (PT)
- **Format**: PT + 2 check + 4 bank code + 4 branch + 11 account + 2 national check
- **Banks**: Millennium bcp, Caixa Geral, Santander
- **Special**: Includes national check digits for additional validation

#### 🇬🇧 United Kingdom (GB)
- **Format**: GB + 2 check + 4 bank code + 6 sort code + 8 account number
- **Banks**: Barclays, HSBC, Lloyds
- **Special**: Uses sort codes for branch identification

#### 🇸🇪 Sweden (SE)
- **Format**: SE + 2 check + 3 bank code + 17 account number
- **Banks**: Handelsbanken, Swedbank, SEB

#### 🇳🇴 Norway (NO)
- **Format**: NO + 2 check + 4 bank code + 7 account number
- **Banks**: DNB, Nordea, SpareBank1
- **Special**: Shortest IBAN format (15 characters)

#### 🇩🇰 Denmark (DK)
- **Format**: DK + 2 check + 4 bank code + 10 account number
- **Banks**: Danske Bank, Nordea, Jyske Bank

## 📝 Adding a New Country

The plugin architecture makes it easy to add new countries. Here's how:

1. **Add IBAN specification** to `src/config/iban-specs.json`:
```json
{
  "XX": {
    "length": 24,
    "bankCodeLength": 4,
    "accountLength": 16,
    "bankCodeType": "numeric",
    "accountType": "alphanumericUpper",
    "branchCodeLength": 4,
    "branchCodeType": "numeric",
    "nationalCheckLength": 2,
    "nationalCheckType": "numeric"
  }
}
```

2. **Add country name** to `src/config/country-names.json`:
```json
{
  "XX": "New Country"
}
```

3. **Add bank data** to `src/config/bank-data.json`:
```json
{
  "XX": {
    "BANKCODE": { "name": "Bank Name", "code": "BNKC" }
  }
}
```

4. **Create generator class**:
```typescript
export class NewCountryGenerator extends CountryGenerator {
  constructor(spec: IBANSpec) {
    super('XX', spec);
  }

  protected generateBBAN(bankInfo?: BankInfo | null): string {
    const bankCodePart = this.generateBankCodePart(bankInfo);
    const branchCodePart = this.generateBranchCodePart(); // Optional
    const accountPart = this.generateAccountPart();
    
    // For countries with national check digits (like Portugal, Belgium)
    const nationalCheckPart = this.calculateNationalCheck(
      (bankCodePart + branchCodePart + accountPart).replace(/\D/g, '')
    );
    
    return bankCodePart + branchCodePart + accountPart + nationalCheckPart;
  }
}
```

5. **Register in factory** (`src/generators/CountryGeneratorFactory.ts`):
```typescript
import { NewCountryGenerator } from './NewCountryGenerator';

// In initializeGenerators():
if (specs.XX) {
  this.generators.set('XX', new NewCountryGenerator(specs.XX));
}
```

6. **Add comprehensive tests** to verify the implementation works correctly

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
