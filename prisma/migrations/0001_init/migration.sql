-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MEMBER', 'VIEWER');
CREATE TYPE "ContactSource" AS ENUM ('COLD', 'WARM', 'REFERRAL', 'WEBSITE', 'INBOUND');
CREATE TYPE "ContactStage" AS ENUM ('NEW_LEAD', 'CONTACTED', 'ENGAGED', 'NURTURING', 'SALES_QUALIFIED', 'CLIENT', 'RETAINED');
CREATE TYPE "InteractionType" AS ENUM ('EMAIL_SENT', 'EMAIL_RECEIVED', 'CALL', 'MEETING', 'NOTE', 'STAGE_CHANGE', 'SEQUENCE_ENROLLED', 'LINKEDIN_MESSAGE', 'SMS');
CREATE TYPE "InteractionDirection" AS ENUM ('INBOUND', 'OUTBOUND');
CREATE TYPE "SequenceType" AS ENUM ('COLD_OUTREACH', 'WARM_NURTURE', 'CLIENT_ONBOARDING', 'RETENTION', 'UPSELL');
CREATE TYPE "SequenceStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED');
CREATE TYPE "StepType" AS ENUM ('EMAIL', 'LINKEDIN', 'SMS', 'TASK', 'WAIT');
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'REPLIED', 'UNSUBSCRIBED');
CREATE TYPE "CampaignType" AS ENUM ('EMAIL', 'SEQUENCE', 'LINKEDIN', 'SMS');
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED');
CREATE TYPE "InsightType" AS ENUM ('READY_TO_BUY', 'COLD_REENGAGEMENT', 'UPSELL_OPPORTUNITY', 'CHURN_RISK');
CREATE TYPE "CheckInStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'MISSED', 'RESCHEDULED');

-- Tenant
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'starter',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");

-- User
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_tenantId_email_key" ON "User"("tenantId", "email");
CREATE INDEX "User_tenantId_idx" ON "User"("tenantId");

-- Contact
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "website" TEXT,
    "phone" TEXT,
    "source" "ContactSource" NOT NULL DEFAULT 'COLD',
    "stage" "ContactStage" NOT NULL DEFAULT 'NEW_LEAD',
    "industry" TEXT,
    "jobTitle" TEXT,
    "linkedinUrl" TEXT,
    "engagementScore" INTEGER NOT NULL DEFAULT 0,
    "healthScore" INTEGER NOT NULL DEFAULT 0,
    "lastContactedAt" TIMESTAMP(3),
    "isClient" BOOLEAN NOT NULL DEFAULT false,
    "contractValue" DOUBLE PRECISION,
    "ltv" DOUBLE PRECISION,
    "notes" TEXT,
    "assignedToId" TEXT,
    "sequenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Contact_tenantId_email_key" ON "Contact"("tenantId", "email");
CREATE INDEX "Contact_tenantId_idx" ON "Contact"("tenantId");
CREATE INDEX "Contact_stage_idx" ON "Contact"("stage");
CREATE INDEX "Contact_source_idx" ON "Contact"("source");

-- Tag
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#6366F1',
    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Tag_tenantId_name_key" ON "Tag"("tenantId", "name");

-- ContactTag
CREATE TABLE "ContactTag" (
    "contactId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "ContactTag_pkey" PRIMARY KEY ("contactId", "tagId")
);

-- Interaction
CREATE TABLE "Interaction" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "type" "InteractionType" NOT NULL,
    "direction" "InteractionDirection" NOT NULL DEFAULT 'OUTBOUND',
    "subject" TEXT,
    "body" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "opened" BOOLEAN NOT NULL DEFAULT false,
    "clicked" BOOLEAN NOT NULL DEFAULT false,
    "replied" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Interaction_contactId_idx" ON "Interaction"("contactId");
CREATE INDEX "Interaction_sentAt_idx" ON "Interaction"("sentAt");

-- Sequence
CREATE TABLE "Sequence" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "SequenceType" NOT NULL DEFAULT 'COLD_OUTREACH',
    "status" "SequenceStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Sequence_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Sequence_tenantId_idx" ON "Sequence"("tenantId");

-- SequenceStep
CREATE TABLE "SequenceStep" (
    "id" TEXT NOT NULL,
    "sequenceId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" "StepType" NOT NULL DEFAULT 'EMAIL',
    "subject" TEXT,
    "body" TEXT,
    "delayDays" INTEGER NOT NULL DEFAULT 0,
    "delayHours" INTEGER NOT NULL DEFAULT 0,
    "condition" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SequenceStep_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "SequenceStep_sequenceId_idx" ON "SequenceStep"("sequenceId");
CREATE INDEX "SequenceStep_order_idx" ON "SequenceStep"("order");

-- SequenceEnrollment
CREATE TABLE "SequenceEnrollment" (
    "id" TEXT NOT NULL,
    "sequenceId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "nextSendAt" TIMESTAMP(3),
    CONSTRAINT "SequenceEnrollment_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SequenceEnrollment_sequenceId_contactId_key" ON "SequenceEnrollment"("sequenceId", "contactId");
CREATE INDEX "SequenceEnrollment_contactId_idx" ON "SequenceEnrollment"("contactId");
CREATE INDEX "SequenceEnrollment_nextSendAt_idx" ON "SequenceEnrollment"("nextSendAt");

-- Campaign
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CampaignType" NOT NULL DEFAULT 'EMAIL',
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "sequenceId" TEXT,
    "audienceCount" INTEGER NOT NULL DEFAULT 0,
    "openRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "clickRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "replyRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "conversionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Campaign_tenantId_idx" ON "Campaign"("tenantId");

-- ABVariant
CREATE TABLE "ABVariant" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "openRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "clickRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "replyRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "audience" INTEGER NOT NULL DEFAULT 0,
    "isWinner" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ABVariant_pkey" PRIMARY KEY ("id")
);

-- AIInsight
CREATE TABLE "AIInsight" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "type" "InsightType" NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "recommendation" TEXT NOT NULL,
    "signalStrength" DOUBLE PRECISION,
    "isActioned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    CONSTRAINT "AIInsight_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AIInsight_contactId_idx" ON "AIInsight"("contactId");
CREATE INDEX "AIInsight_type_idx" ON "AIInsight"("type");

-- ClientCheckIn
CREATE TABLE "ClientCheckIn" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "status" "CheckInStatus" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "satisfaction" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClientCheckIn_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ClientCheckIn_contactId_idx" ON "ClientCheckIn"("contactId");
CREATE INDEX "ClientCheckIn_scheduledAt_idx" ON "ClientCheckIn"("scheduledAt");

-- Integration
CREATE TABLE "Integration" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'disconnected',
    "config" JSONB,
    "lastSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Integration_tenantId_type_key" ON "Integration"("tenantId", "type");

-- Foreign Keys
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContactTag" ADD CONSTRAINT "ContactTag_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContactTag" ADD CONSTRAINT "ContactTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Sequence" ADD CONSTRAINT "Sequence_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SequenceStep" ADD CONSTRAINT "SequenceStep_sequenceId_fkey" FOREIGN KEY ("sequenceId") REFERENCES "Sequence"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SequenceEnrollment" ADD CONSTRAINT "SequenceEnrollment_sequenceId_fkey" FOREIGN KEY ("sequenceId") REFERENCES "Sequence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SequenceEnrollment" ADD CONSTRAINT "SequenceEnrollment_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_sequenceId_fkey" FOREIGN KEY ("sequenceId") REFERENCES "Sequence"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ABVariant" ADD CONSTRAINT "ABVariant_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AIInsight" ADD CONSTRAINT "AIInsight_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClientCheckIn" ADD CONSTRAINT "ClientCheckIn_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Integration" ADD CONSTRAINT "Integration_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
