# SRE Lab

SRE Lab is a personal platform project for building, operating, monitoring, and improving multiple AI-powered micro services.

## Live Site

https://sre-lab.pages.dev/

## Purpose

The goal of this project is to learn and demonstrate practical SRE skills through real service operation.

This project focuses on:

- CI/CD
- Monitoring
- Alerting
- Runbooks
- Cost control
- Reliability improvement
- Automated monetization experiments

## Monitoring

The landing page is deployed on Cloudflare Pages and monitored with Grafana Cloud Synthetic Monitoring.

- Target URL: https://sre-lab.pages.dev/
- Check type: HTTP uptime check
- Probe location: Tokyo, JP (AWS)
- Expected status code: 200
- Purpose: detect downtime and build a basic SRE operation workflow

Future improvements:

- Add alert notifications
- Add an incident response runbook
- Track uptime and response time trends
- Record incidents and reliability improvements

## Alerting

Grafana Cloud Alerting is configured for the landing page uptime check.

- Alert rule: sre-lab-uptime-down
- Metric: probe_success
- Condition: probe_success < 0.5
- Probe location: Tokyo, JP (AWS)
- Evaluation interval: 1m
- Pending period: 2m
- Contact point: sre-lab-email
- Runbook: docs/runbook.md

This alert is intended to detect downtime and connect monitoring results to an operational response workflow.

## Incident Management

SRE Lab records operational incidents and follow-up actions in an incident log.

- Incident log: docs/incidents.md
- Purpose: record alerts, investigations, mitigations, root causes, and reliability improvements

## Operations

SRE Lab defines basic operational workflows for deployments, monitoring, incident response, and cost control.

- Operations guide: docs/operations.md
- Daily checks: Cloudflare Pages, Grafana monitoring, alert rules, GitHub Actions
- Weekly checks: uptime trends, incidents, runbook accuracy, cost and usage

## Services

SRE Lab will host multiple AI-powered micro services.

The first planned service is:

- AI Moving Assistant
  - Purpose: help users estimate moving preparation tasks and packing materials
  - Status: static MVP
  - Service design: docs/services.md
  - MVP specification: docs/moving-assistant.md

## AI API Design

SRE Lab plans to add an AI API backend using Cloudflare Workers.

- Target service: AI Moving Assistant
- Backend design: Cloudflare Workers API
- Purpose: keep API keys secure, validate requests, handle errors, and control API cost
- Design document: docs/ai-api-design.md

## API

SRE Lab includes a Cloudflare Workers API layer for future AI-powered features.

- API app: apps/api
- Initial endpoint: POST /api/moving-assistant
- Current behavior: mock response
- Future behavior: AI-generated moving checklist

## Roadmap

1. Build the project foundation
2. Deploy a landing page
3. Add CI/CD
4. Add monitoring and alerting
5. Launch the first AI-powered micro service
6. Add revenue experiments
