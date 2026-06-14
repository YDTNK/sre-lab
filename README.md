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

## Roadmap

1. Build the project foundation
2. Deploy a landing page
3. Add CI/CD
4. Add monitoring and alerting
5. Launch the first AI-powered micro service
6. Add revenue experiments
