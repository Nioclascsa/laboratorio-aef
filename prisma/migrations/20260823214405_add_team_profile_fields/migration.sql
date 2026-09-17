-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN     "activeProjects" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "courses" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "featuredPubs" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "orcid" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "researchGate" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "researchLines" TEXT NOT NULL DEFAULT '';
