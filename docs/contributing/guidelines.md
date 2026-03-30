# Contributing Guidelines

Thank you for your interest in contributing to EFCC Convictions Explorer! 🎉

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

## How to Contribute

### 1. Report Bugs

Found a bug? Help us fix it!

**Before reporting:**
- Check if bug already exists in [GitHub Issues](https://github.com/yourusername/efcc-convictions-explorer/issues)
- Gather system info and error messages

**When reporting:**
- Use clear, descriptive title
- Include steps to reproduce
- Include system info (OS, Python version, Node version)
- Attach error logs/screenshots

**Example:**
```
Title: API returns 500 error when searching for special characters

Steps to reproduce:
1. Start backend API
2. Search for "DOE & CO"
3. Observe 500 error

Expected: Should return no results or handle gracefully
Actual: 500 Internal Server Error

System: Windows 10, Python 3.11.2, Node 18.16.0
```

### 2. Suggest Features

Have an idea? We'd love to hear it!

**Feature request template:**
```
Title: [FEATURE] Brief description

Motivation:
Why do you want this feature? What problem does it solve?

Proposed Solution:
How should this feature work?

Alternatives:
Any alternative approaches?

Additional Context:
Screenshots, links, or other context
```

### 3. Improve Documentation

Documentation improvements are always welcome!

**You can:**
- Fix typos
- Clarify confusing sections
- Add examples
- Improve organization
- Update outdated info

### 4. Submit Code Changes

Want to contribute code? Follow these steps:

#### Step 1: Fork the Repository

```bash
# On GitHub, click "Fork" button
# Clone your fork
git clone https://github.com/YOUR-USERNAME/efcc-convictions-explorer.git
cd efcc-convictions-explorer
```

#### Step 2: Create a Branch

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Or bugfix branch
git checkout -b bugfix/your-bug-name
```

**Branch naming:**
- `feature/` for new features
- `bugfix/` for bug fixes
- `docs/` for documentation
- `test/` for tests

#### Step 3: Make Your Changes

```bash
# Make your code changes
# Follow code style guidelines (see below)

# Test your changes
python test_api.py          # Backend
npm run build               # Frontend
```

#### Step 4: Commit Your Changes

```bash
git add .
git commit -m "Brief description of changes"
```

**Commit message guidelines:**
- Use present tense ("Add feature" not "Added feature")
- Be concise and descriptive
- Reference issues when applicable

**Examples:**
```
Add search filtering by offense type
Fix NaN value handling in data processing
Update installation documentation
```

#### Step 5: Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then on GitHub:
1. Click "Compare & pull request"
2. Fill out PR template
3. Request review
4. Address feedback

### Development Setup

See [Development Setup Guide](./setup.md)

### Code Style

- **Python**: PEP 8 (use `autopep8` or `black`)
- **JavaScript**: Prettier + ESLint
- **Markdown**: Consistent formatting

See [Code Style Guide](./code-style.md) for details.

### Testing

Write tests for new features:

```bash
# Backend tests
python test_api.py

# Frontend tests
npm run test

# Linting
npm run lint
```

See [Testing Guide](./testing.md)

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Changes are documented
- [ ] New tests added (if applicable)
- [ ] All tests pass locally
- [ ] Commit messages are clear
- [ ] Branch is up to date with main

### PR Checklist

When creating a PR, include:

```
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
How has this been tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes

## Related Issues
Closes #123
```

### Review Process

1. **Automated Checks**
   - Code linting
   - Tests passing
   - Coverage maintained

2. **Code Review**
   - Maintainers review code
   - Feedback provided
   - Changes requested if needed

3. **Approval & Merge**
   - PR approved
   - Branch merged to main
   - Deployment to production

## Areas for Contribution

### High Priority
- [ ] Database migration (SQL)
- [ ] Authentication system
- [ ] Advanced filtering UI
- [ ] Data export functionality
- [ ] Performance optimization

### Medium Priority
- [ ] Additional visualizations
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Email notifications
- [ ] Advanced caching

### Low Priority
- [ ] UI theme customization
- [ ] Additional statistics
- [ ] Browser extensions
- [ ] Analytics dashboard

## Getting Help

- **Questions?** Create a [GitHub Discussion](https://github.com/yourusername/efcc-convictions-explorer/discussions)
- **Setup issues?** Check [Development Setup](./setup.md)
- **Not sure?** Ask in an issue before starting

## Contributor Recognition

Contributors will be recognized in:
- [CONTRIBUTORS.md](../CONTRIBUTORS.md)
- GitHub contributors page
- Project credits

## License

By contributing, you agree that your contributions will be licensed under the [Project License](../LICENSE).

---

**Thank you for contributing!** 🙏

**Need Help?**
- Read [Full Contributing Guide](../contributing/guidelines.md)
- Check [Development Setup](./setup.md)
- Ask in [GitHub Discussions](https://github.com/yourusername/efcc-convictions-explorer/discussions)

**Documentation Version**: 1.0.0
