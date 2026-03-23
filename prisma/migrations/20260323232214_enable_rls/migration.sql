-- Enable Row Level Security on tables
ALTER TABLE "Paper" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- Optional: Create policies (examples below are commented out needed for specific access)
-- CREATE POLICY "Enable read access for all users" ON "Paper" FOR SELECT USING (true);
-- CREATE POLICY "Enable read access for users to their own data" ON "User" FOR SELECT USING (auth.uid() = id::uuid);
