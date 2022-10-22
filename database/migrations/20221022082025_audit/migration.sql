-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATED', 'UPDATED', 'DELETED');

-- CreateTable
CREATE TABLE "audits" (
    "id" VARCHAR(36) NOT NULL,
    "auditable" VARCHAR(30) NOT NULL,
    "auditableId" VARCHAR(36) NOT NULL,
    "previous" JSONB,
    "incoming" JSONB,
    "action" "AuditAction" NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audits_auditable_auditableId_idx" ON "audits"("auditable", "auditableId");

-- CreateIndex
CREATE INDEX "audits_userId_idx" ON "audits"("userId");
