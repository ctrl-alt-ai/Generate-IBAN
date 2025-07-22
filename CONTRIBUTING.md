# Contributing to IBAN Generator

Thank you for your interest in contributing to the IBAN Generator! This document provides guidelines and information for contributors.

## 🎯 How to Contribute

### Types of Contributions We Welcome

1. **Bug Reports**: Found a bug? Please report it!
2. **Feature Requests**: Have an idea for improvement? We'd love to hear it!
3. **Code Contributions**: Submit pull requests for bug fixes or new features
4. **Documentation**: Help improve our documentation
5. **Testing**: Add test cases or improve existing ones
6. **New Country Support**: Add support for additional countries

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git
- Basic knowledge of TypeScript and React

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Generate-IBAN.git
   cd Generate-IBAN
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Run Tests**
   ```bash
   npm run test
   ```

## 📝 Development Guidelines

### Code Standards

- **TypeScript**: All code must be written in TypeScript
- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Use Prettier for code formatting
- **Testing**: All new features must include tests
- **Documentation**: Update documentation for new features

### Code Style

```typescript
// Use descriptive names
const generateRandomChars = (length: number, type: CharacterType): string => {
  // Implementation
};

// Add JSDoc comments for public methods
/**
 * Generates a valid IBAN for the specified country
 * @param country - Two-letter country code
 * @param bankInfo - Optional bank information
 * @returns Generated IBAN or null if generation fails
 */
export function generateIBAN(country: string, bankInfo?: BankInfo | null): string | null {
  // Implementation
}
```

### Commit Messages

Use conventional commit format:

```
type(scope): description

Examples:
feat(generators): add support for Austria (AT)
fix(validation): handle edge case in IBAN length validation
docs(readme): update setup instructions
test(generators): add tests for Belgium generator
refactor(config): simplify configuration loading
```

## 🏗️ Architecture Guidelines

### Plugin Architecture

When adding new countries, follow the plugin pattern:

1. **Configuration First**: Add country specs to JSON files
2. **Generator Class**: Create a country-specific generator
3. **Factory Registration**: Register the generator in the factory
4. **Tests**: Add comprehensive tests

### Error Handling

- Use custom error types from `src/errors/IBANErrors.ts`
- Provide meaningful error messages
- Include country context where relevant
- Handle edge cases gracefully

### Testing Requirements

All contributions must include appropriate tests:

```typescript
describe('NewFeature', () => {
  test('should handle normal case', () => {
    // Test implementation
  });

  test('should handle edge cases', () => {
    // Test edge cases
  });

  test('should throw appropriate errors', () => {
    // Test error scenarios
  });
});
```

## 🌍 Adding New Country Support

### Step-by-Step Guide

1. **Research IBAN Format**
   - Find official IBAN specification for the country
   - Understand the structure (bank code, branch code, account number, etc.)
   - Identify any check digit algorithms used

2. **Update Configuration Files**

   Add to `src/config/iban-specs.json`:
   ```json
   {
     "AT": {
       "length": 20,
       "bankCodeLength": 5,
       "accountLength": 11,
       "bankCodeType": "numeric",
       "accountType": "numeric"
     }
   }
   ```

   Add to `src/config/country-names.json`:
   ```json
   {
     "AT": "Austria"
   }
   ```

   Add to `src/config/bank-data.json` (optional):
   ```json
   {
     "AT": {
       "BKAUATWW": { "name": "Bank Austria", "code": "12000" }
     }
   }
   ```

3. **Create Generator Class**

   Create `src/generators/AustriaGenerator.ts`:
   ```typescript
   import { CountryGenerator } from './CountryGenerator';
   import type { IBANSpec, BankInfo } from '../utils/types';

   export class AustriaGenerator extends CountryGenerator {
     constructor(spec: IBANSpec) {
       super('AT', spec);
     }

     protected generateBBAN(bankInfo?: BankInfo | null): string {
       const bankCodePart = this.generateBankCodePart(bankInfo);
       const accountPart = this.generateAccountPart();
       return bankCodePart + accountPart;
     }
   }
   ```

4. **Register in Factory**

   Update `src/generators/CountryGeneratorFactory.ts`:
   ```typescript
   import { AustriaGenerator } from './AustriaGenerator';

   // In initializeGenerators method:
   if (specs.AT) {
     this.generators.set('AT', new AustriaGenerator(specs.AT));
   }
   ```

5. **Add Tests**

   Create comprehensive tests in `src/__tests__/generators/`:
   ```typescript
   describe('AustriaGenerator', () => {
     // Test normal generation
     // Test with bank info
     // Test IBAN format
     // Test length validation
     // Test edge cases
   });
   ```

6. **Update Documentation**
   - Add country to README.md supported countries table
   - Update any relevant documentation

## 🧪 Testing Guidelines

### Test Categories

1. **Unit Tests**: Test individual functions and classes
2. **Integration Tests**: Test component interactions
3. **Error Tests**: Test error scenarios and edge cases
4. **Configuration Tests**: Test configuration loading

### Running Tests

```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- CountryGenerators.test.ts

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Test Structure

```typescript
describe('Component/Feature', () => {
  beforeEach(() => {
    // Setup
  });

  describe('specific functionality', () => {
    test('should do something specific', () => {
      // Arrange
      const input = 'test input';
      
      // Act
      const result = functionUnderTest(input);
      
      // Assert
      expect(result).toBe('expected output');
    });
  });
});
```

## 📋 Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code following our guidelines
   - Add tests for new functionality
   - Update documentation if needed

3. **Validate Your Changes**
   ```bash
   npm run lint
   npm run format
   npm run test
   npm run build
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a pull request on GitHub

### PR Review Criteria

- [ ] Code follows project style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated if needed
- [ ] No breaking changes (or properly documented)
- [ ] Commit messages follow conventional format
- [ ] CI checks are passing

## 🐛 Bug Reports

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Exact steps to reproduce the bug
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**: Browser, OS, Node.js version
- **Screenshots**: If applicable

### Bug Report Template

```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error...

## Expected Behavior
What should have happened

## Actual Behavior
What actually happened

## Environment
- Browser: Chrome 91.0.4472.124
- OS: macOS 11.4
- Node.js: v18.16.0
- npm: 9.7.2

## Additional Context
Any additional information
```

## 🔍 Code Review Guidelines

### For Authors
- Keep PRs focused and reasonably sized
- Provide clear descriptions
- Respond promptly to feedback
- Test your changes thoroughly

### For Reviewers
- Be constructive and respectful
- Focus on code quality and maintainability
- Check for test coverage
- Verify documentation updates

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Documentation**: Check the README and code comments

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and questions
- Focus on constructive feedback
- Maintain a positive environment

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributors graph

Thank you for contributing to IBAN Generator! 🚀