---
title: Database Design Principles
date: 2024-01-10
tags: Database, SQL, Backend
summary: Key concepts in database normalization, indexing strategies, and query optimization. Notes from practical experience and theoretical learning.
---

# Database Design Principles

Good database design is fundamental to building scalable and maintainable applications. This guide covers essential principles I've learned through experience.

## Normalization

Normalization eliminates data redundancy and ensures data integrity:

### First Normal Form (1NF)
- Each column contains atomic values
- Each column contains values of a single type
- Each column has a unique name

### Second Normal Form (2NF)
- Must be in 1NF
- All non-key attributes fully depend on the primary key

### Third Normal Form (3NF)
- Must be in 2NF
- No transitive dependencies

## Indexing Strategies

Proper indexing dramatically improves query performance:

```sql
-- Create index on frequently queried columns
CREATE INDEX idx_user_email ON users(email);

-- Composite index for multi-column queries
CREATE INDEX idx_order_date_status ON orders(order_date, status);
```

### When to Use Indexes
- Columns frequently used in WHERE clauses
- Foreign key columns
- Columns used in JOIN operations
- Columns used in ORDER BY

### When to Avoid Indexes
- Small tables
- Columns with low cardinality
- Tables with frequent INSERT/UPDATE operations

## Query Optimization

Writing efficient queries is crucial for performance:

```sql
-- Bad: SELECT *
SELECT * FROM users WHERE id = 1;

-- Good: Select only needed columns
SELECT id, name, email FROM users WHERE id = 1;

-- Use EXPLAIN to analyze queries
EXPLAIN SELECT * FROM orders WHERE user_id = 123;
```

## Relationships

Understanding and properly implementing relationships:

- **One-to-One**: User profile information
- **One-to-Many**: User has many orders
- **Many-to-Many**: Students and courses (junction table)

## Key Takeaways

1. Design for scalability from the start
2. Normalize to 3NF, then denormalize strategically
3. Index thoughtfully - not every column needs an index
4. Always consider query patterns when designing tables
5. Use constraints to enforce data integrity