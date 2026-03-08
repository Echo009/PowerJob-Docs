# OpenAPI Documentation

::: warning Documentation in Progress
This page is under construction. Please check back later.
:::

## Overview

PowerJob provides a complete OpenAPI that allows developers to create, trigger, and stop tasks through HTTP endpoints.

## Getting Started

### Get AppId and AppSecret

1. Login to PowerJob console
2. Go to application management
3. Copy AppId and AppSecret

### Request Signing

All OpenAPI requests require signature verification...

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/createJob | POST | Create job |
| /api/runJob | POST | Trigger job |
| /api/stopJob | POST | Stop job |
| /api/fetchJobLog | GET | Fetch logs |
