# rto-strategy.md

## Recovery Time Objective (RTO) Strategy

| Document Version | 1.0 |
|-----------------|-----|
| Date             | 2026-05-13 |
| Owner            | DevOps Team |
| Project          | Metrical Zone of Wines |

---

### 1. Definition

**Recovery Time Objective (RTO)** is the maximum acceptable time to restore business services after a disaster or major failure.  
For the *Metrical Zone of Wines* platform, the RTO is set to **6 hours** from the moment the incident is declared.

---

### 2. Scope

This RTO applies to the complete production environment hosted on AWS:

- Spring Boot backend (EC2 instance, port 14080)
- MySQL database (EC2 instance, port 5800)
- MongoDB database (EC2 instance, custom port, e.g., 37017)
- Network configuration (VPC, security groups, routing)
- Application data, configuration, and secrets

The RTO does **not** include:
- End‑user DNS propagation time (if a public IP changes)
- Time to manually approve AWS support tickets (if needed)
- Third‑party service outages (GitHub, Maven Central, etc.)

---

### 3. Backup & Recovery Infrastructure

| Backup type      | Schedule                    | Retention | Location |
|------------------|-----------------------------|-----------|----------|
| Full backup      | Every Saturday, 17:00 UTC   | 4 weeks   | S3 bucket (cross‑region) |
| Incremental backup| Every day (except Saturday) | 1 week    | S3 bucket (same region) |

Backups include:
- MySQL database dump (`mysqldump` of `wines_db_prod`)
- MongoDB data dump (`mongodump` of `wines_db`)
- Spring Boot application JAR and configuration files
- Custom environment variables (stored as secrets in AWS Secrets Manager or parameter store)
- EC2 instance AMI snapshot (weekly)

---

### 4. RTO Breakdown (6 hours total)

| Activity                                                                 | Estimated Time |
|--------------------------------------------------------------------------|----------------|
| **Incident detection & declaration** – monitoring alerts / manual report | 15 min         |
| **Damage assessment & decision** – choose restore point                 | 15 min         |
| **Infrastructure restoration** – launch replacement EC2 instances, VPC   | 30 min         |
| **Restore MySQL from latest full + incremental**                        | 60 min         |
| **Restore MongoDB from latest full + incremental**                      | 30 min         |
| **Application deployment** – upload JAR, configure env vars             | 30 min         |
| **Startup & smoke tests** – health checks, basic API tests              | 30 min         |
| **Data verification** – sample queries, consistency check               | 30 min         |
| **Switch DNS / update security groups** (if needed)                     | 15 min         |
| **Post‑restore monitoring** – validate all endpoints                    | 45 min         |

**Total contingency time: 6 hours** (allowing 2 hours for unexpected issues).

---

### 5. Responsibilities

| Role                     | Responsibility                                                                 |
|--------------------------|--------------------------------------------------------------------------------|
| DevOps Engineer          | Execute restore scripts, verify backups, launch replacement infrastructure.    |
| Database Administrator   | Restore MySQL and MongoDB dumps, validate data integrity.                      |
| Application Developer    | Smoke‑test critical endpoints (e.g., `/api/wines`, `/api/countries`).          |
| Security Lead            | Verify secrets and IAM roles are correctly re‑attached.                        |
| Product Owner            | Approve restore point and sign off on service resumption.                      |

---

### 6. Procedures (High‑Level)

1. **Detect incident** – monitoring dashboard (CloudWatch) or user report.
2. **Isolate failed resources** – stop corrupted instances, revoke compromised keys.
3. **Select recovery point** – choose the most recent full Saturday backup + all incremental until one day before incident.
4. **Launch new EC2 instances** (or reuse existing if only data is corrupted).
   - Use the same VPC, subnet, security groups.
5. **Restore MySQL**:
   - Create new database `wines_db_prod_restore`.
   - Apply full backup → then incremental dumps.
   - Rename database to `wines_db_prod` after verification.
6. **Restore MongoDB**:
   - Run `mongorestore` on the target MongoDB EC2.
   - Recreate users and indexes.
7. **Deploy application**:
   - Copy JAR to backend EC2.
   - Set environment variables (DB_HOST, MONGO_HOST, etc.).
   - Start with `java -Xmx256m -Xms128m -jar app.jar`.
8. **Run smoke tests**:
   - `GET /api/countries` returns data.
   - `GET /health` returns `200 OK`.
   - Database write test (POST to a test endpoint).
9. **Re‑enable monitoring** and update on‑call status.

---

### 7. RTO Improvement Plan

- Automate restore procedures using AWS CloudFormation or Terraform (target RTO: 3 hours).
- Create a hot‑standby EC2 instance with pre‑installed Java and Gradle (target RTO: 2 hours).
- Enable cross‑region replication for backups to reduce download time.

---

### 8. Exceptions and Assumptions

- All backups are stored in the **same AWS region** (us‑east‑1) by default. Multi‑region backup adds 30 minutes to restore.
- The AWS account has sufficient EC2 and S3 service quotas.
- The incident does **not** destroy the backup bucket (use bucket versioning and MFA delete).
- Human operators are available during business hours (9 AM – 6 PM UTC‑5). Outside hours, RTO may extend to 12 hours.

---
