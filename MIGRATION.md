# Sequelize Migrations

This section provides instructions on how to use Sequelize migrations to manage your database schema changes.

## Table of Contents

- [Introduction to Migrations](#introduction-to-migrations)
- [Installation](#installation)
- [Data Structure](#data-structure)
- [Creating a Migration](#creating-a-migration)
- [Running Migrations](#running-migrations)
- [Rolling Back Migrations](#rolling-back-migrations)
- [Additional Resources](#additional-resources)

## Introduction to Migrations

Sequelize migrations allow you to make changes to your database schema in a structured and repeatable manner. Migrations keep track of the changes you make and allow you to apply or revert those changes as needed.

## Installation

Make sure you have Sequelize installed in your project:

```bash
npm install sequelize sequelize-cli

```

## Data Structure

We have documented the data structure for the project in a Google Sheets document. This data structure defines the layout and relationships of the various data entities in the project. It's an important reference for understanding how data is organized and stored in the application.

You can access the data structure document here: [Data Structure Google Sheets](https://docs.google.com/spreadsheets/d/1PjDRNgVuseY0I0eppnjlDXyNMHf6X1PWQgubbd4_g_Q/edit#gid=0).

Feel free to refer to this document when working with the project's database, models, and migrations.

## Creating a Migration

To create a new migration, you can use the sequelize-cli:

```bash
npx sequelize-cli migration:generate --name migration-name

```

This will create a new migration file in the migrations directory. Open the migration file and define your schema changes using the Sequelize API.

## Running Migrations

To apply the migrations and update your database schema, run:

```bash
npx sequelize-cli db:migrate

```

This command will execute all pending migrations.

## Rolling Back Migrations

If you need to revert a migration, you can run:

```bash
npx sequelize-cli db:migrate:undo

```

This will revert the last applied migration. If you want to revert all migrations, use:

```bash
npx sequelize-cli db:migrate:undo:all

```

## Additional Resources

- [Sequelize Migrations Documentation](https://sequelize.org/docs/v6/other-topics/migrations/)
- [Sequelize CLI Documentation](https://sequelize.org/master/manual/migrations.html#the-cli)
- [Sequelize Data Types](https://sequelize.org/docs/v6/moved/data-types/)
