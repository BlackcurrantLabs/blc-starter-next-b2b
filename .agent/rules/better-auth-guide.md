---
trigger: model_decision
description: Use this guide when you need full docs on auth, this project utilises better-auth.
---

# Better Auth

> The most comprehensive authentication framework for TypeScript

## Table of Contents

### Adapters

- [PostgreSQL](/llms.txt/docs/adapters/postgresql.md): Integrate Better Auth with PostgreSQL.
- [Prisma](/llms.txt/docs/adapters/prisma.md): Integrate Better Auth with Prisma.
- [SQLite](/llms.txt/docs/adapters/sqlite.md): Integrate Better Auth with SQLite.

### Authentication

- [Email & Password](/llms.txt/docs/authentication/email-password.md): Implementing email and password authentication with Better Auth.

### Basic Usage

- [Basic Usage](/llms.txt/docs/basic-usage.md): Getting started with Better Auth

### Comparison

- [Comparison](/llms.txt/docs/comparison.md): Comparison of Better Auth versus over other auth libraries and services.

### Concepts

- [API](/llms.txt/docs/concepts/api.md): Better Auth API.
- [CLI](/llms.txt/docs/concepts/cli.md): Built-in CLI for managing your project.
- [Client](/llms.txt/docs/concepts/client.md): Better Auth client library for authentication.
- [Cookies](/llms.txt/docs/concepts/cookies.md): Learn how cookies are used in Better Auth.
- [Database](/llms.txt/docs/concepts/database.md): Learn how to use a database with Better Auth.
- [Email](/llms.txt/docs/concepts/email.md): Learn how to use email with Better Auth.
- [Hooks](/llms.txt/docs/concepts/hooks.md): Better Auth Hooks let you customize BetterAuth's behavior
- [OAuth](/llms.txt/docs/concepts/oauth.md): How Better Auth handles OAuth
- [Plugins](/llms.txt/docs/concepts/plugins.md): Learn how to use plugins with Better Auth.
- [Rate Limit](/llms.txt/docs/concepts/rate-limit.md): How to limit the number of requests a user can make to the server in a given time period.
- [Session Management](/llms.txt/docs/concepts/session-management.md): Better Auth session management.
- [TypeScript](/llms.txt/docs/concepts/typescript.md): Better Auth TypeScript integration.
- [User & Accounts](/llms.txt/docs/concepts/users-accounts.md): User and account management.

### Errors

- [Account already linked to different user](/llms.txt/docs/errors/account_already_linked_to_different_user.md): The account is already linked to a different user.
- [Email doesn't match](/llms.txt/docs/errors/email_doesn't_match.md): The email doesn't match the email of the account.
- [Email not found](/llms.txt/docs/errors/email_not_found.md): The provider did not return an email address.
- [Errors](/llms.txt/docs/errors.md): Errors that can occur in Better Auth.
- [Invalid callback request](/llms.txt/docs/errors/invalid_callback_request.md): The callback request is invalid.
- [No callback URL](/llms.txt/docs/errors/no_callback_url.md): The callback URL was not found in the request.
- [No code](/llms.txt/docs/errors/no_code.md): The code was not found in the request.
- [OAuth provider not found](/llms.txt/docs/errors/oauth_provider_not_found.md): The OAuth provider was not found.
- [Signup disabled](/llms.txt/docs/errors/signup_disabled.md): Signup disabled error
- [State mismatch](/llms.txt/docs/errors/state_mismatch.md): The state parameter in the request doesn't match the state parameter in the cookie.
- [State not found](/llms.txt/docs/errors/state_not_found.md): The state parameter was not found in the request.
- [Unable to get user info](/llms.txt/docs/errors/unable_to_get_user_info.md): The user info was not found in the request.
- [Unable to link account](/llms.txt/docs/errors/unable_to_link_account.md): The account could not be linked.
- [Unknown error](/llms.txt/docs/errors/unknown.md): An unknown error occurred.

### Examples

- [Next.js Example](/llms.txt/docs/examples/next-js.md): Better Auth Next.js example.

### Guides

- [Migrating from Auth0 to Better Auth](/llms.txt/docs/guides/auth0-migration-guide.md): A step-by-step guide to transitioning from Auth0 to Better Auth.
- [Browser Extension Guide](/llms.txt/docs/guides/browser-extension-guide.md): A step-by-step guide to creating a browser extension with Better Auth.
- [Optimizing for Performance](/llms.txt/docs/guides/optimizing-for-performance.md): A guide to optimizing your Better Auth application for performance.
- [Create your first plugin](/llms.txt/docs/guides/your-first-plugin.md): A step-by-step guide to creating your first Better Auth plugin.

### Installation

- [Installation](/llms.txt/docs/installation.md): Learn how to configure Better Auth in your project.

### Integrations

- [Next.js integration](/llms.txt/docs/integrations/next.md): Integrate Better Auth with Next.js.

### Introduction

- [Introduction](/llms.txt/docs/introduction.md): Introduction to Better Auth.

### Plugins

- [Two-Factor Authentication (2FA)](/llms.txt/docs/plugins/2fa.md): Enhance your app's security with two-factor authentication.
- [Admin](/llms.txt/docs/plugins/admin.md): Admin plugin for Better Auth
- [Anonymous](/llms.txt/docs/plugins/anonymous.md): Anonymous plugin for Better Auth.
- [API Key](/llms.txt/docs/plugins/api-key.md): API Key plugin for Better Auth.
- [Bearer Token Authentication](/llms.txt/docs/plugins/bearer.md): Authenticate API requests using Bearer tokens instead of browser cookies
- [Captcha](/llms.txt/docs/plugins/captcha.md): Captcha plugin
- [Community Plugins](/llms.txt/docs/plugins/community-plugins.md): A list of recommended community plugins.
- [Device Authorization](/llms.txt/docs/plugins/device-authorization.md): OAuth 2.0 Device Authorization Grant for limited-input devices
- [Email OTP](/llms.txt/docs/plugins/email-otp.md): Email OTP plugin for Better Auth.
- [Generic OAuth](/llms.txt/docs/plugins/generic-oauth.md): Authenticate users with any OAuth provider
- [JWT](/llms.txt/docs/plugins/jwt.md): Authenticate users with JWT tokens in services that can't use the session
- [Last Login Method](/llms.txt/docs/plugins/last-login-method.md): Track and display the last authentication method used by users
- [Magic link](/llms.txt/docs/plugins/magic-link.md): Magic link plugin
- [MCP](/llms.txt/docs/plugins/mcp.md): MCP provider plugin for Better Auth
- [Multi Session](/llms.txt/docs/plugins/multi-session.md): Learn how to use multi-session plugin in Better Auth.
- [OAuth 2.1 Provider](/llms.txt/docs/plugins/oauth-provider.md): A Better Auth plugin that enables your auth server to serve as an OAuth 2.1 provider.
- [OAuth Proxy](/llms.txt/docs/plugins/oauth-proxy.md): OAuth Proxy plugin for Better Auth
- [One-Time Token Plugin](/llms.txt/docs/plugins/one-time-token.md): Generate and verify single-use token
- [Open API](/llms.txt/docs/plugins/open-api.md): Open API reference for Better Auth.
- [Organization](/llms.txt/docs/plugins/organization.md): The organization plugin allows you to manage your organization's members and teams.
- [Passkey](/llms.txt/docs/plugins/passkey.md): Passkey
- [Phone Number](/llms.txt/docs/plugins/phone-number.md): Phone number plugin
- [Username](/llms.txt/docs/plugins/username.md): Username plugin

### Reference

- [FAQ](/llms.txt/docs/reference/faq.md): Frequently asked questions about Better Auth.
- [Options](/llms.txt/docs/reference/options.md): Better Auth configuration options reference.
- [Resources](/llms.txt/docs/reference/resources.md): A curated collection of resources to help you learn and master Better Auth.
- [Security](/llms.txt/docs/reference/security.md): Better Auth security features.
