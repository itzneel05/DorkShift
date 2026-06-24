
## Use Cases

### 1. Exposure Discovery — Cloud Credentials

| Role | Security researcher |
|------|-------------------|
| Goal | Identify potentially exposed cloud credential patterns across public sources |
| Trigger | Authorised audit of an organisation's external exposure surface |
| Steps | 1. Enter a sample credential pattern into the seed input<br>2. Select **AWS Credentials** category<br>3. Enable platforms: GitHub, Pastebin, grep.app, PublicWWW<br>4. Switch on all 5 mutation strategies<br>5. Add target prefix `o:acme-corp` for organisation scoping<br>6. Click RUN |
| Result | 40–80 platform-specific search queries with one-click launch URLs for manual review |

### 2. Internal Exposure Audit

| Role | DevOps engineer |
|------|----------------|
| Goal | Check if company configuration patterns appear on any searchable platform |
| Trigger | Post-incident review mandates exposure assessment |
| Steps | 1. Select the **Config File Exposure** template<br>2. Add target prefix `d:yourcompany.com`<br>3. Review the auto-classified category suggestion<br>4. Click RUN |
| Result | All 12 platform tabs populated with scoped queries. Copy-all per platform for manual validation. |

### 3. Learning Platform Coverage

| Role | Security professional new to OSINT |
|------|-----------------------------------|
| Goal | Understand what kinds of patterns can be discovered through search queries |
| Trigger | Learning phase — exploring category coverage |
| Steps | 1. Type a generic keyword like "password"<br>2. Watch the classifier banner detect the category<br>3. Browse the category list for adjacent classes<br>4. Select a template<br>5. Click RUN and inspect the output variety |
| Result | Hands-on discovery of 30 detection categories across 12 platforms |

### 4. Shareable Investigation

| Role | Red team lead |
|------|--------------|
| Goal | Share a configured investigation configuration with a teammate |
| Trigger | Mid-engagement handoff |
| Steps | 1. Configure target, category, platforms, and strategies<br>2. Click RUN to generate results and encode the share URL<br>3. Copy the browser URL (`?s=base64string`)<br>4. Send to teammate |
| Result | Teammate opens the URL and the full configuration is restored — target, category, platforms, and mutations |

### 5. Technology Stack Discovery

| Role | Penetration tester |
|------|-------------------|
| Goal | Generate search queries targeting a specific technology stack (Django, Rails, etc.) |
| Trigger | Target uses Django for their web application |
| Steps | 1. Enter a Django-related keyword<br>2. Select the relevant category<br>3. Enable **Framework-Specific** strategy<br>4. In the expanded config, ensure `django` is active<br>5. Click RUN |
| Result | Queries include framework-specific patterns like `SECRET_KEY = '{value}'` and `DATABASES['default']['PASSWORD']` |
