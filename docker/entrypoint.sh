#!/bin/sh

# เชื่อมต่อกับ PostgreSQL และตรวจสอบว่าฐานข้อมูลมีหรือไม่
echo "Checking if database exists..."

# ตรวจสอบการเชื่อมต่อกับฐานข้อมูล
if PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; then
  echo "Database exists, skipping migration..."
else
  echo "Database does not exist, creating database and migrating..."
  # ถ้าฐานข้อมูลไม่มี, ทำการ migrate
  npx prisma migrate deploy
fi

# เริ่มต้นแอป
exec "$@"
