Username: admin
Password: admin@123
Username: staff@123
Password: staff@123
Username: user
Password: user@123

## Local setup

1. Start Apache and MySQL in XAMPP.
2. Open phpMyAdmin and import:
   `sql/health_sanitation_db (1).sql`
3. Check `config/env.local.php`.
   - `db_host`, `db_port`, `db_name`, `db_user`, and `db_pass` must match your MySQL/XAMPP setup.
   - Put your Gemini API key in `gemini_key` if you want the AI chat and AI insights to work.

The SQL file creates the `health_sanitation_db` database, the main app tables, sample records, and the `ai_tasks` table used by the AI assistant follow-up feature.

## AI folder advice

Continue the AI folder, but keep it as assistant automation:
- Good: answer questions from current system data.
- Good: suggest form values from staff notes.
- Good: create follow-up tasks that staff can review.
- Avoid for now: letting AI approve permits, edit violations, or change medical/sanitation records automatically.

This keeps the app beginner-friendly and safer while you learn PHP, sessions, CRUD, and API calls.
