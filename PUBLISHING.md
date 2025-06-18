# Publishing Guide for Vue Form Handler

This document provides instructions for publishing the Vue Form Handler package to npm.

## Preparation Checklist

1. ✅ Package structure is set up
2. ✅ Build configuration is in place
3. ✅ Documentation is created
4. ✅ License is added

## Before Publishing

1. Update the author field in `package.json` with your name or organization
2. Update the repository URL in `package.json` with your actual repository URL
3. Update the copyright line in the LICENSE file with your name or organization
4. Consider updating the version number if you're releasing a new version

## Building the Package

Run the build script to compile the TypeScript code:

```bash
npm run build
```

This will create the distribution files in the `dist` directory.

## Testing the Package Locally

Before publishing, you can test the package locally:

```bash
# In the package directory
npm pack

# This creates a .tgz file that you can install in another project
# In your test project
npm install /path/to/vue-form-handler-1.0.0.tgz
```

## Publishing to npm

1. Make sure you're logged in to npm:

```bash
npm login
```

2. Publish the package:

```bash
npm publish
```

If this is your first time publishing this package, you might need to specify that it's public:

```bash
npm publish --access=public
```

## After Publishing

1. Create a git tag for the version:

```bash
git tag v1.0.0
git push origin v1.0.0
```

2. Update your project or documentation website with the new version information

## Updating the Package

When you need to update the package:

1. Make your changes
2. Update the version in `package.json` (follow [semantic versioning](https://semver.org/))
3. Run the build
4. Publish the new version

```bash
npm version patch # or minor, or major
npm run build
npm publish
```

## Troubleshooting

- If you get permission errors, make sure you're logged in to npm correctly
- If the package name is taken, choose a different name in `package.json`
- If you need to unpublish a version (within 72 hours of publishing): `npm unpublish vue-form-handler@1.0.0`