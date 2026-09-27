# DECISIONS.md

## 1. Tech stack: NestJS (on top of Express)

**What:** I built the backend with NestJS. The challenge requires Express.js, and it is still in the stack: NestJS runs on Express by default and uses it to expose the HTTP endpoints.

**Why:** NestJS gives you dependency injection and a modular design out of the box. In my view, this pays off over time in any Node.js backend. If you already have a solid grounding in SOLID principles and design patterns, NestJS makes it easy to apply them consistently. That matters for a serious project that grows over time, especially with medium to large teams.

## 2. Backend architecture: Clean Architecture + lightweight DDD

**What:** The backend follows Clean Architecture combined with a lightweight version of Domain-Driven Design.

**Why:**

1. **DDD puts the business first.** It lets me design the system around its core business rules, so I start with what really matters. I usually begin by understanding the problem and the strict rules the system must enforce, without thinking yet about which infrastructure or tools will be used (beyond a general idea). Infrastructure is also important, but I only tackle it once the business rules are well understood.

2. **Clean Architecture keeps everything working for the domain.** It helps me design the whole solution around what the domain needs. It also decouples the system from third-party services: my code talks only to its own interfaces, and external systems and tools are handled in the infrastructure layer. This keeps them interchangeable. It also helps me think about each layer separately, work out exactly what each one needs, and solve that well.

Together, Clean Architecture and DDD give a clear separation of responsibilities. With distributed teams, several people can work on the same feature at once, each owning a layer. The feature ships faster without losing quality, and when something fails it is easy to find where and why. This view comes from my own experience.

## 3. Frontend architecture: feature-based structure

**What:** On the frontend, I followed a lightweight version of the same principles through a feature-based folder structure.

**Why:** Grouping code by feature makes it easier to work on a specific page or on a whole, self-contained feature.

## 4. Data split: PostgreSQL vs MongoDB

**What:** PostgreSQL stores `events`, `ticket_tiers` and `reservations`. MongoDB stores `orders`.

**Why PostgreSQL for events, tiers and reservations:** These tables are closely related. To compute availability accurately without over-engineering, the natural approach was a `LEFT JOIN` between `ticket_tiers` and `reservations`, calculating each tier's availability in one place, on a single database server. This way the availability shown is always accurate and never stored as a column. If I stored it, I would have to keep incrementing and decrementing that value correctly for every action (hold, cancel, confirm).

**Why MongoDB for orders:** The requirements set no strict relational rules for orders. An order is a document that holds a snapshot of the main entities (event, tier, reservation), so it fits naturally in MongoDB. If the order structure changes in the future, that won't be a problem, since one of MongoDB's strengths is that a collection can store documents of any shape.

## 5. Preventing overselling: row-level lock on the ticket tier

**What:** When a reservation is created, the requested `ticket_tiers` row is locked inside the transaction (`SELECT ... FOR UPDATE`). The lock works like a semaphore: any other request trying to reserve tickets for the same tier at the same time has to wait until the first transaction commits. PostgreSQL handles all of this.

**Why:** Availability is not stored as a counter; it is computed from `reservations` (see decision 4). To keep that calculation correct, I need to prevent concurrent writes to `reservations` for the same tier. With a row lock, when two requests try to reserve the same tier at the same time, the second one blocks on the tier row until the first transaction releases it. By then, the first reservation is committed, so the second request computes availability from up-to-date data. Keeping the lock in the same database as the data is what guarantees the availability calculation.

**Alternatives considered:**

- **PostgreSQL advisory locks.** They would also work, but for this strict use case a row lock was the better fit. The row lock is tied directly to the tier row being reserved. An advisory lock uses an application-defined key that the code has to derive from the tier ID and acquire explicitly, which adds a convention to maintain for no extra benefit here.
