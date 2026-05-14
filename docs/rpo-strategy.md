# Recovery Point Objective (RPO) Strategy

| Document Version | 1.0 |
|-----------------|-----|
| Date             | 2026-05-13 |
| Owner            | DevOps Team |
| Project          | Metrical Zone of Wines |

---

### 1. Definition

**Recovery Point Objective (RPO)** is the maximum acceptable amount of data loss measured in time.  
For the *Metrical Zone of Wines* platform, the RPO is set to **24 hours**.

---

### 2. Rationale

- **Full backup every Saturday (17:00 UTC)** – provides a complete point‑in‑time snapshot.
- **Incremental backups daily** – capture changes from Monday to Friday and Sunday.
- Maximum data loss = up to **one day** of changes (if a failure occurs before the next incremental backup is taken).

The business has determined that losing up to 24 hours of wine inventory, user ratings, or regional metrics is acceptable, given the non‑critical nature of the application during off‑hours.

---

### 3. Backup Schedule & RPO per Component

| Component       | Backup Type   | Schedule (UTC)          | RPO (maximum data loss) | Recovery Method                     |
|-----------------|---------------|-------------------------|--------------------------|-------------------------------------|
| MySQL Database  | Full          | Saturday, 17:00         | 7 days (week)            | `mysqldump` → S3 bucket              |
| MySQL Database  | Incremental   | Daily (Mon‑Fri, Sun)    | **24 hours**             | Binary logs + `mysqlbinlog`         |
| MongoDB         | Full          | Saturday, 17:00         | 7 days                   | `mongodump` → S3 bucket              |
| MongoDB         | Incremental   | Daily (Mon‑Fri, Sun)    | **24 hours**             | Oplog + `mongorestore --oplogReplay`|
| EC2 Instance    | AMI snapshot  | Saturday, 17:00         | 7 days (only OS + tools) | Launch from AMI                     |
| App JAR + config| Manual / Git   | Every code push         | 0 hours (code in Git)    | Re‑clone from repository            |

> **Effective RPO** = 24 hours, because the most frequent backup of **data** (incremental) runs daily.

---

### 4. How the Incremental Backup Works

#### MySQL (EC2 at 10.0.1.83)

- Binary logging is enabled (`log_bin = ON`).
- Every night at 02:00 UTC, a script runs:
  ```bash
  mysqlbinlog --read-from-remote-server --host=10.0.1.83 --user=backup_user --password ... \
    --raw --result-file=/tmp/inc_$(date +%Y%m%d).binlog
