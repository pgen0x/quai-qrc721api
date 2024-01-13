# Sequelize Migrations

This section provides instructions on how to use Sequelize migrations to manage your database schema changes.

## Table of Contents

- [Introduction to Migrations](#introduction-to-migrations)
- [Installation](#installation)
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

## Seeding Data

```bash
npx sequelize-cli db:seed:all

```

This command will execute all seeders and populate your database with the specified data.

## Rolling Back Seeds

Undo the last seed:

```bash
npx sequelize-cli db:seed:undo
```

Undo all seeds:

```bash
npx sequelize-cli db:seed:undo:all
```

## Additional Resources

- [Sequelize Migrations Documentation](https://sequelize.org/docs/v6/other-topics/migrations/)
- [Sequelize CLI Documentation](https://sequelize.org/master/manual/migrations.html#the-cli)
- [Sequelize Data Types](https://sequelize.org/docs/v6/moved/data-types/)
