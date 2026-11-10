CREATE TABLE "accounts" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "age_years" SMALLINT NOT NULL,
    "activity_level" TEXT NOT NULL,
    "primary_goal" TEXT NOT NULL,
    "stress_level" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "profiles_age_years_non_negative" CHECK ("age_years" >= 0)
);

CREATE TABLE "profile_metrics" (
    "profile_id" UUID NOT NULL,
    "height_cm" DECIMAL(5,2) NOT NULL,
    "weight_kg" DECIMAL(6,2) NOT NULL,
    "target_weight_kg" DECIMAL(6,2) NOT NULL,
    "resting_heart_rate_bpm" SMALLINT NOT NULL,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "profile_metrics_pkey" PRIMARY KEY ("profile_id"),
    CONSTRAINT "profile_metrics_height_positive" CHECK ("height_cm" > 0),
    CONSTRAINT "profile_metrics_weight_positive" CHECK ("weight_kg" > 0),
    CONSTRAINT "profile_metrics_target_weight_positive" CHECK ("target_weight_kg" > 0),
    CONSTRAINT "profile_metrics_resting_heart_rate_positive" CHECK ("resting_heart_rate_bpm" > 0)
);

CREATE TABLE "profile_goals" (
    "profile_id" UUID NOT NULL,
    "daily_movement_minutes" SMALLINT NOT NULL,
    "calorie_target_kcal" INTEGER NOT NULL,
    "protein_target_grams" DECIMAL(6,2) NOT NULL,
    "sleep_target_minutes" SMALLINT NOT NULL,
    "stress_goal" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "profile_goals_pkey" PRIMARY KEY ("profile_id"),
    CONSTRAINT "profile_goals_daily_movement_non_negative" CHECK ("daily_movement_minutes" >= 0),
    CONSTRAINT "profile_goals_calories_non_negative" CHECK ("calorie_target_kcal" >= 0),
    CONSTRAINT "profile_goals_protein_non_negative" CHECK ("protein_target_grams" >= 0),
    CONSTRAINT "profile_goals_sleep_non_negative" CHECK ("sleep_target_minutes" >= 0)
);

CREATE TABLE "movement_daily_records" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "record_date" DATE NOT NULL,
    "active_minutes" INTEGER NOT NULL,
    CONSTRAINT "movement_daily_records_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "movement_daily_records_active_minutes_non_negative" CHECK ("active_minutes" >= 0)
);

CREATE TABLE "stress_check_ins" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "record_date" DATE NOT NULL,
    "stress_level" TEXT NOT NULL,
    "energy_level" TEXT NOT NULL,
    "sleep_quality" TEXT NOT NULL,
    CONSTRAINT "stress_check_ins_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "profiles_account_id_idx" ON "profiles"("account_id");
CREATE UNIQUE INDEX "movement_daily_records_profile_id_record_date_key"
    ON "movement_daily_records"("profile_id", "record_date");
CREATE INDEX "movement_daily_records_record_date_idx" ON "movement_daily_records"("record_date");
CREATE UNIQUE INDEX "stress_check_ins_profile_id_record_date_key"
    ON "stress_check_ins"("profile_id", "record_date");
CREATE INDEX "stress_check_ins_record_date_idx" ON "stress_check_ins"("record_date");

ALTER TABLE "profiles" ADD CONSTRAINT "profiles_account_id_fkey"
    FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "profile_metrics" ADD CONSTRAINT "profile_metrics_profile_id_fkey"
    FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "profile_goals" ADD CONSTRAINT "profile_goals_profile_id_fkey"
    FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "movement_daily_records" ADD CONSTRAINT "movement_daily_records_profile_id_fkey"
    FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "stress_check_ins" ADD CONSTRAINT "stress_check_ins_profile_id_fkey"
    FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
