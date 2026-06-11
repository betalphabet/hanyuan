# hanyuan.info auth.md

This document details agent registration and authentication instructions for the hanyuan.info site APIs and resources.

## Agent Registration

To register an AI agent or crawler with our services, please submit a registration request:
- **Registration Endpoint:** `https://hanyuan.info/agent/register`
- **Supported Methods:** Anonymous API key request, identity assertion.
- **Claim Endpoint:** `https://hanyuan.info/agent/claim`

## Authentication

AI agents should authenticate by including the API key in the `Authorization` header:
```http
Authorization: Bearer YOUR_AGENT_KEY
```
