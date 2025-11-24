# Data Positioning Default Presenter

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=data-positioning_datapos-presenter-default&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=data-positioning_datapos-presenter-default)
[![npm version](https://img.shields.io/npm/v/@datapos/datapos-presenter-default)](https://www.npmjs.com/package/@datapos/datapos-presenter-default)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

A library that implements the default presenter in accordance with the Data Positioning presenter interface.

## Installation

There’s no need to install this presenter manually. Once released, it’s uploaded to the Data Positioning Engine cloud and becomes instantly available to all new instances of the browser app. A notification about the new version is also sent to all existing browser apps.

## Repository Management Commands

The following list details the repository management commands implementation by this project. For more details, please refer to the scripts section of the 'package.json' file in this project.

| Name               | VS Code Shortcuts | Notes                                                                                                                                              |
| ------------------ | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| audit              | alt+ctrl+shift+a  | Audit the project's dependencies for known security vulnerabilities.                                                                               |
| build              | alt+ctrl+shift+b  | Build the package using Vite. Output to '/dist' directory.                                                                                         |
| check              | alt+ctrl+shift+c  | Identify outdated dependencies using npm `outdated` and `npm-check-updates` with option to install latest versions. Also runs `retire` scanner.    |
| document           | alt+ctrl+shift+d  | Identify licenses of the project's production and peer dependencies. See [LICENSES.json](./LICENSES.json).                                         |
| format             | alt+ctrl+shift+f  | Use `prettier`to enforce formatting style rules.                                                                                                   |
| lint               | alt+ctrl+shift+l  | Use `eslint`to check the code for potential errors and enforces coding style rules.                                                                |
| publish            | alt+ctrl+shift+p  | Publish the package to `npm`.                                                                                                                      |
| release            | alt+ctrl+shift+r  | Bump version, build configuration, build presenter, synchronise with `GitHub`, upload presenter to Data Positioning platform and publish to `npm`. |
| sync:withGitHub    | alt+ctrl+shift+s  | Synchronise local repository with the main GitHub repository.                                                                                      |
| test               | alt+ctrl+shift+t  | ❌ Not implemented.                                                                                                                                |
| update:dataPosDeps | alt+ctrl+shift+u  | Install the latest version of all Data Positioning dependencies.                                                                                   |

## Bundle Analysis

View the [bundle report](https://data-positioning.github.io/datapos-presenter-default/stats/index.html) to analyze the bundle composition and module sizes (generated with rollup-plugin-visualizer).

## Compliance

The following badge reflects FOSSA's assessment of this repository's open-source license compliance.

## License

[MIT](./LICENSE) © 2026 Data Positioning Pty Ltd
