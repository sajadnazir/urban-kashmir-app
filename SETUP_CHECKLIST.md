# Setup Checklist

Use this checklist to ensure your development environment is properly configured.

## ✅ Prerequisites

- [ ] Node.js 22+ installed via nvm
- [ ] React Native CLI installed globally
- [ ] Xcode installed (for iOS development on macOS)
- [ ] Android Studio installed (for Android development)
- [ ] CocoaPods installed (for iOS)
- [ ] Java JDK installed (for Android)

## ✅ Initial Setup

- [ ] Clone/download the project
- [ ] Run `nvm use 22` to switch to Node 22
- [ ] Run `npm install` to install dependencies
- [ ] For iOS: Run `cd ios && bundle install && bundle exec pod install && cd ..`
- [ ] Verify no TypeScript errors in your IDE

## ✅ Environment Configuration

- [ ] Update API base URL in `src/api/client.ts`
- [ ] Configure any required API keys
- [ ] Set up environment variables if needed
- [ ] Update app name in `app.json` if needed
- [ ] Update bundle identifier (iOS) and package name (Android) if needed

## ✅ First Run

- [ ] Start Metro: `npm start`
- [ ] Run on iOS: `npm run ios` (in new terminal)
- [ ] Run on Android: `npm run android` (in new terminal)
- [ ] Verify the app launches successfully
- [ ] Check that the HomeScreen displays correctly

## ✅ Development Tools

- [ ] Install VS Code extensions:
  - ESLint
  - Prettier
  - React Native Tools
  - TypeScript and JavaScript Language Features
- [ ] Enable format on save in VS Code
- [ ] Install React Native Debugger (optional)
- [ ] Install Flipper for debugging (optional)

## ✅ Code Quality

- [ ] Run `npm run lint` to check for linting errors
- [ ] Run `npm test` to run tests (if configured)
- [ ] Verify TypeScript compilation: `npx tsc --noEmit`
- [ ] Check that Prettier formatting works

## ✅ Project Understanding

- [ ] Read through `README.md`
- [ ] Review `PROJECT_STRUCTURE.md`
- [ ] Check `USAGE_EXAMPLES.md` for code patterns
- [ ] Explore the `src/` folder structure
- [ ] Understand the API service pattern
- [ ] Understand the Zustand store pattern
- [ ] Review the custom hooks

## ✅ Customization

- [ ] Update app colors in `src/constants/index.ts`
- [ ] Replace placeholder API endpoints with real ones
- [ ] Add your app's logo/assets to `src/assets/`
- [ ] Update app display name
- [ ] Configure app icons (iOS and Android)
- [ ] Configure splash screen (iOS and Android)

## ✅ Git Setup

- [ ] Initialize git repository (if not already done)
- [ ] Review `.gitignore` file
- [ ] Make initial commit
- [ ] Set up remote repository
- [ ] Push to remote

## ✅ Team Setup

- [ ] Share project documentation with team
- [ ] Set up code review process
- [ ] Configure CI/CD pipeline (if needed)
- [ ] Set up staging/production environments
- [ ] Document deployment process

## 🎯 Next Steps

After completing this checklist:

1. Start building your features
2. Follow the patterns in `USAGE_EXAMPLES.md`
3. Keep the code organized following the folder structure
4. Write tests for critical functionality
5. Document any new patterns or conventions

## 📝 Notes

- Always use `nvm use 22` before running npm commands
- Keep dependencies up to date
- Follow TypeScript best practices
- Use ESLint and Prettier for code consistency
- Write meaningful commit messages

## 🆘 Getting Help

If you encounter issues:

1. Check `TROUBLESHOOTING.md` (if available)
2. Review React Native documentation
3. Check the issue tracker
4. Ask the team for help

---

**Last Updated**: Initial Setup
**Project Version**: 0.0.1
