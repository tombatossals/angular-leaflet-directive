# Documentation

This document describes the process that automatically generates the documentation using Travis CI.

## How it works

Here's a general overview of how things work:

1. A commit is pushed to the repository
2. Travis CI starts a build
3. Main script runs (run unit tests)
4. If main script fails, build exits
5. `./scripts/deploy_docs_to_gh_pages.sh` script is run
6. If commit message does not contain the string `[build-docs]`, build exits
7. Output of `gulp dgeni` is committed to gh-pages branch
8. `docs/*.css` are added to `gh-pages` branch as well
9. `gh-pages` branch is pushed back to GitHub
10. GitHub updates statically hosted documentation on `angular.github.io`.

## Configuration

To provide Travis CI with rights to deploy the newly generated documentation to GitHub, we need to provide it with a GitHub token that represents an account that has sufficient rights to push to the repository.

#### Step 1: create a GitHub token

To generate a new personal access token in GitHub, go to *Personal settings / Applications* and click on *Generate new token* in the *Personal access tokens* section of the page.

Give it an appropriate description such as "Documentation deployment token for router" so you can later identify the token again in case you no longer need it and want to remove it.

Finally copy the generated token that GitHub presents on your screen. It is important to copy it right now because it is only shown once and you'll have to regenerate a new one if you forget it.

#### Step 2: tell Travis to use the token

Travis offers a really convenient feature where it lets you define environment variables to customize the build process.

What's more is that it even lets you encrypt these variables so you can add sensitive information to `.travis.yml` without having to worry about others seeing the file.

To add encryped environment variables to your `.travis.yml` file, you can:

```sh
$ gem install travis
$ cd <repository-directory>
$ travis encrypt GITHUB_TOKEN=<secret-token-from-step-1> --add
```

> On Mac OS X, if `gem install travis` fails, you may have to install the latest version of Ruby first by running: `brew install ruby`.

This will add a line to the `.travis.yml` file that looks like this:

```sh
secure: <encryped string>
```

When Travis runs the deployment script, it will decrypt the encrypted value and make it available as a regular environment variable so we can conveniently access the original GITHUB_TOKEN again from within the deployment script.

That's it! Save and commit the updated `.travis.yml` file.

## Deploying manually

If required, the documentation can also be generated and deployed to GitHub pages from your local machine.

You need to specify the GITHUB_TOKEN manually like this:

```sh
$ GITHUB_TOKEN=<github-token> ./scripts/deploy_docs_to_gh_pages.sh
```

> **Attention**: It is not recommended to run the deployment script locally if you don't know what you are doing. The scripts is written to run on Travis CI in a VM where code can be deleted without repercussions. Make sure you don't have unsaved work that has not been committed and pushed to GitHub to prevent unwanted code loss in case something goes wrong.

## Change log

#### 2015-03-15

- added support for commit message filtering
- updated documentation

#### 2015-03-14

- added dgeni exception handler
- updated documentation

#### 2015-03-13

- initial version
