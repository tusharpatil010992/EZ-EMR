========================
HARD ARCHITECTURE RULES
========================

1. DO NOT over-engineer
   - No microservices
   - No Kafka / queues
   - No Redis
   - No CQRS
   - No event sourcing
   - No GraphQL
   - No Kubernetes

2. Modular Monolith ONLY
   Backend must remain a single Spring Boot application with internal modules.

3. Frontend must be feature-based
   Organize by business modules, NOT by generic component grouping.

4. Single database rule
   PostgreSQL only. No additional databases.

5. Multi-tenancy rule
   Every business table MUST include:
   tenant_id (UUID, NOT NULL)

6. Walk-in rule
   Walk-in patients MUST NOT be separate system.
   Use:
   - patients.is_walkin
   - appointments.is_walkin
   - appointment_time can be NULL for walk-ins

7. No cross-module repository access
   Modules must communicate ONLY via service layer.

8. Keep APIs REST only
   No GraphQL, no RPC.
