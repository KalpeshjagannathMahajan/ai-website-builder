# Storefront - wizshop
Goal - To create a top notch developer experience and build a super scalable and amazing product
Take quick architectural decisions using below laws.

# Code Laws

1. Component name will be in PascalCase
2. All new components will be functional components
3. Component number of lines should not increase 350 lines unless its unavoidable
4. Use redux only to save backend information which needs to be used app wide
5. Use flat component structure for desiging flows i.e child component level should be 2 at worst case unless unavoidable
6. Use context api if the flow is big and need to manage lot of components with lot of states
7. Only use let, const and arrow functions
8. Dont use array native functions, mostly use lodash
9. Design components should be made common inside modules folder
10. No JSX variables unless unavoidable
11. States should be declared at top unless unavoidable
12. Library imports on top, a space and then rest imports
13. Typescript Props definition required props on top followed by a space and then optional Props
14. No Inline styles unless 1, try to clean that up too
15. No inline function definition

16. All functions and variables will be with underscore
17. App Flows (Bunch of screens to work together)
18. File name and folder structure should be as follows

- Feature Name Folder
- Feature Name File
- Logic separation (use Feature File which contains all the logic)
- Components Folder for child components
- Styles
- Helpers
- write styles and logic in component if it does not exceed 350 lines
- data transformers
- Context in context.ts

19. String Localization
20. Squash and Merge feature/fix branches
21. Branch Naming
22. Add the text line in en file use t translate the file.

- {Jira-ticket-id}-feat-{feature-name}
- {Jira-ticket-id}-fix-{fix-name}
- {Jira-ticket-id}-chore-{chore-name}

22. Generic Library Rules
    This is the generic library rules. Use Text and other design.

## Branch Details

Here are the key branches in the project and their purposes:

- **`develop`**:  
  Latest features are merged here. This branch is used for integration and testing before moving features to the pre-production **`new-pre-prod`**: and production **`main`** environments.
  - **`staging.sourcerer.tech`** is pointing to this branch
  
- **`new-pre-prod`**:  
  Pre-production branch where integration testing takes place. It closely mimics the production environment to ensure that all features and fixes are thoroughly vetted before deployment.
  - **`tenant16.sourcerer.tech `** is pointing to this branch

- **`main`**:  
  The production branch. This is the stable branch containing live features that are used by end-users. Only well-tested and approved changes are merged into this branch. All the client sites are pointing to this branch

- **`pre-prod-demo`**:  
  Production version of the **`new-pre-prod`** branch. This branch is used for testing features that are live on **`new-pre-prod` with production environment. These are the demo sites that are pointing to this branch
  - **`demo1.sourcerer.tech`** 
  - **`demo1.sourcerer.tech`** 
  - **`demo1.sourcerer.tech`** 

- **`chore-align-with-ultron`**:  
  This branch includes latest features of ultron. This branch serves as a bridge between **`ultron`** and **`storefront`**. It aligns shared features and configurations across both platforms.

  Handling Changes Across Repositories

  1. Merging Changes:
     - Merge updates from ultron into the **`chore-align-with-ultron`** branch to ensure consistency.
     - Do the same for Storefront changes, keeping the branch aligned with both repos.

  2. Testing:
     - Focus on testing the latest features, code refactoring, and overall structure.
     - Ensure UI and feature-specific elements function correctly.
     - Ensure that the previous code being replaced by refactoring is properly removed to avoid duplication or legacy code issues

  3. Syncing Process:
     - Fetch and merge the latest changes from both repositories.
     - Resolve any conflicts, ensuring compatibility across both platforms. Any updated code refactoring or structure from ultron should be accepted in Storefront during the merge. 

  4. Final Merge:
     -  Once testing is complete, merge the branch into the respective Ultron and Storefront branches, keeping both repositories in sync.

  Pushing Merged Changes to Both Repositories

  1. Create a Bridge Branch:
     - Create a branch in one of the repositories that will act as the bridge between the two repositories.
       
     ```bash
     git checkout -b chore-align-with-ultron
     ```

  2. Add Remote for the Second Repository:
     - Add ultron as a Remote in store-front.
       
     ```bash
     git remote -v 
     git remote add git@github.com:Sourcewiz/ultron.git <URL-of-second-repository>
     ```

  3. Fetch Changes from Ultron:
     - Fetch changes from the ultron to ensure you have the latest updates and checkout ultron **`staging`** branch.
       
     ```bash
     git fetch
     git checkout staging
     ```

  4. Merge Ultron Changes:
     - Merge/pull changes from ultron to `chore-align-with-ultron` branch.
       
     ```bash
     git pull origin staging
       or
     git merge staging
     ```

  5. Resolve Conflicts and Push Changes:
     - If there are any conflicts between Storefront and Ultron, resolve them, commit and push the changes.
     
     ```bash
     git commit -m "Resolved conflicts between Storefront and Ultron"
     git push 
     ```

  6. Set the Remote URL to Storefront and Push Changes:
     - Set Storefront as the active remote, push the changes to the Storefront repository.
       
     ```bash
     git remote set-url origin git@github.com:Sourcewiz/store-front-poc.git <URL-of-storefront-repository>
     git push 
     ```

## Getting Started

To get started with Storefront - wizshop, clone the repository and install the necessary dependencies using Yarn:

```bash
git clone git@github.com:Sourcewiz/store-front-poc.git
cd store-front-poc
yarn install
```

## Environment-Specific Scripts

You can run the development server in different environments using the following commands:

- **Staging**:
  
  ```bash
  yarn dev:staging
  ```
  This will start the development server in **staging** mode on port 3000.

- **Pre-production**:
  
  ```bash
  yarn dev:preprod
  ```
  This will start the development server in **preprod** mode on port 3000.

- **Production**:
  
  ```bash
  yarn dev:prod
  ```
  This will start the development server in **production** mode on port 3000.

- **Tenant-Specific Configuration**:
  
  ```bash
  VITE_APP_TENANT_ID
  ```
  This environment variable is used to identify different tenants. Based on the tenant id, specific configurations, feature flags, and UI customizations, themes and fonts are applied.

- **Repository-Based Layout Customization**:
  
  ```bash
  VITE_APP_REPO
  ```
  This variable indicates the repository context. The application uses this to handle layout and feature variations for different platforms.
   - **`store_front`**: Represents the storefront layout, which includes features and UI elements specific to store-based tenants.
   - **`ultron`**: Refers to the Ultron application, where the UI elements are the same for all tenants
  
Each of these commands sets the appropriate environment and adjusts memory usage via `NODE_OPTIONS`.

## Linting and Code Formatting

We use ESLint and Prettier for code linting and formatting. Run the following command to check your code for issues:

```bash
yarn lint
```

Linting and formatting will automatically run before commits due to Husky and lint-staged setup.

## Husky

Husky is configured to run lint-staged before every commit. It ensures that code follows our style guide and is free of linting errors.

To install Husky hooks, run:

```bash
yarn prepare
```

## License

This project is private and not intended for public use.

  
