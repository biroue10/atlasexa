<div align="center">

# Atlasexa

### Find, evaluate, and compare products with confidence.

Atlasexa is an intelligent product discovery and comparison platform that helps users find products based on their needs, budget, specifications, prices, and quality scores.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tests](https://img.shields.io/badge/Tests-Backend%20%2B%20Frontend-success)](#testing)
[![Performance](https://img.shields.io/badge/Performance-Budget%20Validated-success)](#performance-budget)

[Features](#features) ·
[Architecture](#architecture) ·
[Installation](#installation) ·
[API](#api-endpoints) ·
[Testing](#testing) ·
[Roadmap](#roadmap)

</div>

---

## Overview

Online shoppers often need to visit multiple websites, compare specifications manually, check prices, and determine whether a product is suitable for their needs.

Atlasexa brings this information together in one experience.

Users can:

- search for products using natural keywords;
- browse a structured product catalog;
- filter products by brand, category, and maximum price;
- sort products by relevance, score, price, or name;
- inspect specifications and scoring explanations;
- compare multiple products side by side;
- share filtered catalog URLs;
- discover the most suitable option based on budget and requirements.

---

## Features

### Intelligent product search

Atlasexa searches across:

- product names;
- product descriptions;
- brand names.

Search queries are normalized, validated, and ranked using PostgreSQL trigram similarity.

### Relevance ranking

When a search is active, matching products can be sorted by relevance.

The current ranking prioritizes:

1. product-name matches;
2. brand-name matches;
3. product-description matches;
4. product score as a secondary ranking signal;
5. product name as a deterministic final sort.

### Product catalog

The catalog supports:

- pagination;
- brand filtering;
- category filtering;
- maximum-price filtering;
- search relevance sorting;
- score sorting;
- lowest-price sorting;
- highest-price sorting;
- alphabetical sorting.

### Shareable catalog URLs

Filters are synchronized with the URL.

Example:

```text
/products?q=Lenovo&brand=Lenovo&category=Laptops&max_price=900&sort_by=relevance&page=1
