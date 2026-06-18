import React, { useState } from 'react';
import { 
  FileCode, 
  Database, 
  Workflow, 
  Clipboard, 
  ClipboardCheck, 
  Milestone, 
  Blocks, 
  Network,
  Share2,
  CalendarDays
} from 'lucide-react';

export default function DatabaseDeliverables() {
  const [activeSubTab, setActiveSubTab] = useState<'architecture' | 'prisma' | 'postgres' | 'api' | 'roadmap'>('architecture');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const triggerCopy = (text: string, tabId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(tabId);
    setTimeout(() => setCopiedText(null), 1500);
  };

  // PRISMA MODEL CODE BLOCK
  const prismaSchemaCode = `// datasource & generators config
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// NextAuth models for Google OAuth integration
model User {
  id            String          @id @default(uuid())
  name          String?
  email         String          @unique
  emailVerified DateTime?
  image         String?
  role          UserRole        @default(USER)
  accounts      Account[]
  sessions      Session[]
  casinos       CasinoAccount[]
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
}

enum UserRole {
  USER
  ADMIN
  OPERATOR
}

model Account {
  id                 String  @id @default(uuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String?  @db.Text
  access_token       String?  @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?  @db.Text
  session_state      String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// Core Social Casino integration schemas
model CasinoAccount {
  id                     String              @id @default(uuid())
  userId                 String
  name                   String              // e.g., Stake.us, Chumba
  logoUrl                String?
  casinoUrl              String
  username               String
  passwordEncrypted      String              // AES-256 Symmetric encryption
  loginNotes             String?             @db.Text
  stateRestriction       String?
  accountStatus          AccountStatus       @default(ACTIVE)
  scBalance              Decimal             @default(0.00) @db.Decimal(12, 4)
  gcBalance              Int                 @default(0)
  vipLevel               String?
  joinDate               DateTime?
  lastLogin              DateTime?
  lastCollectionTime     DateTime?
  todayBonusStatus       BonusStatus         @default(AVAILABLE)
  freeSpinsAvailable     Int                 @default(0)
  playthroughRequirement Decimal             @default(0.00) @db.Decimal(12, 4)
  playthroughProgress    Decimal             @default(0.00) @db.Decimal(12, 4)
  redemptionStatus       RedemptionStatus    @default(NONE)
  accountHealth          HealthStatus        @default(EXCELLENT)
  color                  String              @default("#eab308")
  transactions           CasinoTransaction[]
  promoCodes             PromoCode[]
  createdAt              DateTime            @default(now())
  updatedAt              DateTime            @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum AccountStatus {
  ACTIVE
  SUSPENDED
  PENDING_VERIFICATION
}

enum BonusStatus {
  CLAIMED
  AVAILABLE
  COOLDOWN
}

enum RedemptionStatus {
  NONE
  ELIGIBLE
  PENDING
  COMPLETED
}

enum HealthStatus {
  EXCELLENT
  GOOD
  WARNING
  CRITICAL
}

// Financial Ledger models
model CasinoTransaction {
  id         String          @id @default(uuid())
  casinoId   String
  type       TransactionType
  amountSC   Decimal         @db.Decimal(12, 4)
  amountGC   Int             @default(0)
  timestamp  DateTime        @default(now())
  status     TransactionStatus @default(COMPLETED)
  notes      String?         @db.Text

  casino CasinoAccount @relation(fields: [casinoId], references: [id], onDelete: Cascade)
}

enum TransactionType {
  DEPOSIT
  REDEMPTION
  WIN
  LOSS
  BONUS_CLAIM
  PROMO_CLAIM
}

enum TransactionStatus {
  COMPLETED
  PENDING
  FAILED
}

// Promo Code managers
model PromoCode {
  id                  String    @id @default(uuid())
  casinoId            String
  code                String
  dateAdded           DateTime  @default(now())
  expirationDate      DateTime
  lastUsed            DateTime?
  dailyUsageAvailable Boolean   @default(false)
  rewardValue         String    // e.g., "1.00 SC + 10 Free Spins"
  isArchived          Boolean   @default(false)
  isFavorite          Boolean   @default(false)
  usedCount           Int       @default(0)

  casino CasinoAccount @relation(fields: [casinoId], references: [id], onDelete: Cascade)
}

// Background headless crawling telemetry logs
model AutomationLog {
  id         String     @id @default(uuid())
  casinoId   String
  startTime  DateTime   @default(now())
  endTime    DateTime?
  status     LogStatus
  output     String?    @db.Text
  errorMsg   String?    @db.Text
}

enum LogStatus {
  SUCCESS
  FAILED
  RUNNING
}`;

  // POSTGRES DDL SCRIPT BLOCK
  const postgresDdlCode = `-- Enable UUID Extension in PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Roles Enum counterparts
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'OPERATOR');
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION');
CREATE TYPE "BonusStatus" AS ENUM ('CLAIMED', 'AVAILABLE', 'COOLDOWN');
CREATE TYPE "RedemptionStatus" AS ENUM ('NONE', 'ELIGIBLE', 'PENDING', 'COMPLETED');
CREATE TYPE "HealthStatus" AS ENUM ('EXCELLENT', 'GOOD', 'WARNING', 'CRITICAL');
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'REDEMPTION', 'WIN', 'LOSS', 'BONUS_CLAIM', 'PROMO_CLAIM');
CREATE TYPE "TransactionStatus" AS ENUM ('COMPLETED', 'PENDING', 'FAILED');

-- Users Core Table representation
CREATE TABLE "User" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(255),
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "image" TEXT,
  "role" "UserRole" NOT NULL DEFAULT 'USER',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Casino Integration Table details
CREATE TABLE "CasinoAccount" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "name" VARCHAR(100) NOT NULL,
  "logoUrl" TEXT,
  "casinoUrl" TEXT NOT NULL,
  "username" VARCHAR(255) NOT NULL,
  "passwordEncrypted" TEXT NOT NULL, -- AES GCM Symmetric Encrypted
  "loginNotes" TEXT,
  "stateRestriction" TEXT,
  "accountStatus" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
  "scBalance" NUMERIC(12,4) NOT NULL DEFAULT 0.00,
  "gcBalance" INT NOT NULL DEFAULT 0,
  "vipLevel" VARCHAR(100),
  "joinDate" DATE,
  "lastLogin" TIMESTAMP WITH TIME ZONE,
  "lastCollectionTime" TIMESTAMP WITH TIME ZONE,
  "todayBonusStatus" "BonusStatus" NOT NULL DEFAULT 'AVAILABLE',
  "freeSpinsAvailable" INT NOT NULL DEFAULT 0,
  "playthroughRequirement" NUMERIC(12,4) NOT NULL DEFAULT 0.00,
  "playthroughProgress" NUMERIC(12,4) NOT NULL DEFAULT 0.00,
  "redemptionStatus" "RedemptionStatus" NOT NULL DEFAULT 'NONE',
  "accountHealth" "HealthStatus" NOT NULL DEFAULT 'EXCELLENT',
  "color" VARCHAR(10) DEFAULT '#f4b860',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Financial Stream Activity Table
CREATE TABLE "CasinoTransaction" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "casinoId" UUID NOT NULL REFERENCES "CasinoAccount"("id") ON DELETE CASCADE,
  "type" "TransactionType" NOT NULL,
  "amountSC" NUMERIC(12,4) NOT NULL,
  "amountGC" INT NOT NULL DEFAULT 0,
  "timestamp" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "status" "TransactionStatus" NOT NULL DEFAULT 'COMPLETED',
  "notes" TEXT
);

-- Promotional Codes Indexes and Table
CREATE TABLE "PromoCode" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "casinoId" UUID NOT NULL REFERENCES "CasinoAccount"("id") ON DELETE CASCADE,
  "code" VARCHAR(100) NOT NULL,
  "dateAdded" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "expirationDate" TIMESTAMP WITH TIME ZONE NOT NULL,
  "lastUsed" TIMESTAMP WITH TIME ZONE,
  "dailyUsageAvailable" BOOLEAN NOT NULL DEFAULT FALSE,
  "rewardValue" VARCHAR(255) NOT NULL,
  "isArchived" BOOLEAN NOT NULL DEFAULT FALSE,
  "isFavorite" BOOLEAN NOT NULL DEFAULT FALSE,
  "usedCount" INT NOT NULL DEFAULT 0
);

-- Indexes for blazing query performance
CREATE INDEX "IDX_CasinoAccount_userId" ON "CasinoAccount"("userId");
CREATE INDEX "IDX_CasinoTransaction_casinoId" ON "CasinoTransaction"("casinoId");
CREATE INDEX "IDX_PromoCode_casinoId" ON "PromoCode"("casinoId");`;

  // API ROUTE SNIPPET BLOCK
  const nextApiCode = `// File: /app/api/casinos/[id]/claim/route.ts
// Secure Server-side Proxy for daily bonus collection and headless worker dispatch

import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db";
import { runHeadlessCollector } from "@/lib/automation/runner";
import { decryptCredential } from "@/lib/security";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = params; // Casino ID requested

    // Fetch the target casino details with encrypted credentials from PostgreSQL
    const account = await db.casinoAccount.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Decrypt password server-side inside secure environment context
    const plainPassword = decryptCredential(account.passwordEncrypted);

    // Run Headless background process
    const result = await runHeadlessCollector({
      casinoName: account.name,
      username: account.username,
      password: plainPassword,
      method: account.bonusCollectionMethod,
      selectors: {
        balance: account.balanceSelectors,
        claims: account.dashboardUrl
      }
    });

    if (!result.success) {
      // Record failed run in telemetries log
      await db.automationLog.create({
        data: {
          casinoId: account.id,
          status: "FAILED",
          errorMsg: result.error,
          output: result.logs.join("\\n")
        }
      });

      return NextResponse.json({ 
        success: false, 
        error: "Automation failed or WAF triggered", 
        logs: result.logs 
      }, { status: 422 });
    }

    // Update DB with the scraped balances & success details
    const updatedAccount = await db.casinoAccount.update({
      where: { id: account.id },
      data: {
        scBalance: result.scBalance,
        gcBalance: result.gcBalance,
        todayBonusStatus: "CLAIMED",
        lastCollectionTime: new Date()
      }
    });

    // Record the financial claim transaction
    await db.casinoTransaction.create({
      data: {
        casinoId: account.id,
        type: "BONUS_CLAIM",
        amountSC: result.claimedSc,
        notes: "Automated Daily bonus collection successful: " + (result.claimedSc || "$1.00 SC")
      }
    });

    return NextResponse.json({ 
      success: true, 
      scBalance: updatedAccount.scBalance,
      gcBalance: updatedAccount.gcBalance
    });

  } catch (error: any) {
    console.error("API claim error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}`;

  return (
    <div className="space-y-6" id="deliverables-reference">
      <div className="bg-[#151922] p-5 rounded-xl border border-gray-800 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-[#F4B860]" />
              Production Deliverables Workspace
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Copy-ready blueprints, Prisma database schemas, SQL migrations, secure API routers, and launching roadmaps to deploy this stack instantly to Next.js + PostgreSQL.
            </p>
          </div>

          <div className="flex bg-[#0B0D12] rounded border border-gray-850 p-1 font-mono text-[11px]">
            <button
              onClick={() => setActiveSubTab('architecture')}
              className={`px-3 py-1.5 rounded transition ${activeSubTab === 'architecture' ? 'bg-[#F4B860] text-black font-bold' : 'text-gray-400'}`}
            >
              📐 Architecture
            </button>
            <button
              onClick={() => setActiveSubTab('prisma')}
              className={`px-3 py-1.5 rounded transition ${activeSubTab === 'prisma' ? 'bg-[#F4B860] text-black font-bold' : 'text-gray-400'}`}
            >
              💎 Prisma
            </button>
            <button
              onClick={() => setActiveSubTab('postgres')}
              className={`px-3 py-1.5 rounded transition ${activeSubTab === 'postgres' ? 'bg-[#F4B860] text-black font-bold' : 'text-gray-400'}`}
            >
              🐘 SQL
            </button>
            <button
              onClick={() => setActiveSubTab('api')}
              className={`px-3 py-1.5 rounded transition ${activeSubTab === 'api' ? 'bg-[#F4B860] text-black font-bold' : 'text-gray-400'}`}
            >
              🌐 API route
            </button>
            <button
              onClick={() => setActiveSubTab('roadmap')}
              className={`px-3 py-1.5 rounded transition ${activeSubTab === 'roadmap' ? 'bg-[#F4B860] text-black font-bold' : 'text-gray-400'}`}
            >
              🚀 Roadmap
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-[#0B0D12] p-5 rounded-lg border border-gray-850 min-h-[400px]">
          {activeSubTab === 'architecture' && (
            <div className="space-y-6 text-sm">
              <div className="border-b border-gray-850 pb-3">
                <h3 className="font-bold text-white flex items-center gap-1.5">
                  <Network className="h-4.5 w-4.5 text-[#F4B860]" />
                  Full-Stack Architecture Specification
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-[#F4B860] uppercase text-xs font-mono">1. Client Layer (Next.js App Router)</h4>
                    <p className="text-gray-300 text-xs mt-1">
                      Next.js 15 with React Server Components (RSC) to serve the static dashboard scaffolding in milliseconds. Tailwind CSS v4 coordinates dark design patterns, with localized cryptographically shaded local storage values for secure offline credential caches.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-[#60A5FA] uppercase text-xs font-mono">2. Secure Server-side API Proxy</h4>
                    <p className="text-gray-300 text-xs mt-1">
                      Sensitive third-party interactions and password decrypting are locked inside Node.js API handlers. No passwords or API secret keys leak to web debuggers or client-side context.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-[#4ADE80] uppercase text-xs font-mono">3. Google OAuth & NextAuth Configuration</h4>
                    <p className="text-gray-300 text-xs mt-1">
                      Integrated login mechanisms using JWT tokens and database adapters. Users are sandboxed to visual scopes, allowing multiple operators to safely isolate and manage distinct sets of casino credentials in parallel databases.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-purple-400 uppercase text-xs font-mono">4. Automation Headless Runner</h4>
                    <p className="text-gray-300 text-xs mt-1">
                      A background job worker module utilizing headless puppeteer instances. Periodically triggers claims actions, updates balance records, and generates notification warning logs, automatically halting on Cloudflare WAF or Geolocation locks.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#151922] border border-gray-800 rounded-lg">
                <h4 className="font-bold text-white text-xs mb-1.5 font-mono flex items-center gap-1">
                  <Blocks className="h-4 w-4" /> Recommended Folder Scaffold (Next.js 15)
                </h4>
                <pre className="text-[11px] text-gray-400 font-mono leading-tight">
{`/casino-command-center
  ├── /app
  │    ├── layout.tsx
  │    ├── page.tsx
  │    ├── /api
  │    │    ├── /auth/[...nextauth]/route.ts  # OAuth SSO configuration
  │    │    ├── /casinos/[id]/claim/route.ts  # Headless claim triggers
  │    │    └── /transactions/route.ts        # Ledger APIs
  ├── /components
  │    └── ui/                                # Shadcn UI widgets
  ├── /lib
  │    ├── db.ts                              # Prisma Client singleton
  │    ├── security.ts                        # GCM crypto helpers
  │    └── /automation
  │         └── runner.ts                     # headful puppeteer collection worker
  ├── prisma/
  │    └── schema.prisma                      # Prisma definitions file
  ├── package.json
  └── tailwind.config.js`}
                </pre>
              </div>
            </div>
          )}

          {activeSubTab === 'prisma' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-850 pb-2">
                <h3 className="font-bold text-white flex items-center gap-1.5 text-xs font-mono">
                  <FileCode className="h-4 w-4 text-purple-400" /> schema.prisma (Models Config)
                </h3>

                <button
                  onClick={() => triggerCopy(prismaSchemaCode, 'prisma')}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-2.5 py-1 rounded flex items-center gap-1 font-mono transition"
                >
                  {copiedText === 'prisma' ? <ClipboardCheck className="h-4 w-4 text-[#4ADE80]" /> : <Clipboard className="h-4 w-4" />}
                  {copiedText === 'prisma' ? 'Copied' : 'Copy Schema'}
                </button>
              </div>

              <pre className="text-[10.5px] text-gray-300 font-mono leading-tight bg-black p-4 rounded overflow-x-auto max-h-[500px]">
                {prismaSchemaCode}
              </pre>
            </div>
          )}

          {activeSubTab === 'postgres' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-850 pb-2">
                <h3 className="font-bold text-white flex items-center gap-1.5 text-xs font-mono">
                  <Database className="h-4 w-4 text-emerald-400" /> schema.sql (Raw DDL Migration)
                </h3>

                <button
                  onClick={() => triggerCopy(postgresDdlCode, 'postgres')}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-2.5 py-1 rounded flex items-center gap-1 font-mono transition"
                >
                  {copiedText === 'postgres' ? <ClipboardCheck className="h-4 w-4 text-[#4ADE80]" /> : <Clipboard className="h-4 w-4" />}
                  {copiedText === 'postgres' ? 'Copied' : 'Copy DDL'}
                </button>
              </div>

              <pre className="text-[10.5px] text-gray-300 font-mono leading-tight bg-black p-4 rounded overflow-x-auto max-h-[500px]">
                {postgresDdlCode}
              </pre>
            </div>
          )}

          {activeSubTab === 'api' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-850 pb-2">
                <h3 className="font-bold text-white flex items-center gap-1.5 text-xs font-mono">
                  <Workflow className="h-4 w-4 text-sky-400" /> claim/route.ts (Next.js Router)
                </h3>

                <button
                  onClick={() => triggerCopy(nextApiCode, 'api')}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-2.5 py-1 rounded flex items-center gap-1 font-mono transition"
                >
                  {copiedText === 'api' ? <ClipboardCheck className="h-4 w-4 text-[#4ADE80]" /> : <Clipboard className="h-4 w-4" />}
                  {copiedText === 'api' ? 'Copied' : 'Copy Handler'}
                </button>
              </div>

              <pre className="text-[10.5px] text-gray-300 font-mono leading-tight bg-black p-4 rounded overflow-x-auto max-h-[500px]">
                {nextApiCode}
              </pre>
            </div>
          )}

          {activeSubTab === 'roadmap' && (
            <div className="space-y-6 text-xs">
              <div className="border-b border-gray-850 pb-3">
                <h3 className="font-bold text-white flex items-center gap-1.5">
                  <Milestone className="h-4.5 w-4.5 text-[#F4B860]" />
                  Engineering Scaffolding & Launch Roadmap
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-[#151922] border border-gray-850 rounded">
                  <span className="bg-[#F4B860] text-black font-extrabold w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs shrink-0">1</span>
                  <div>
                    <span className="font-bold text-white block uppercase">Phase 1: DB Provisioning & Next.js Bootstrap</span>
                    <p className="text-gray-400 mt-0.5">Initialize PostgreSQL Cloud instances (e.g. Supabase, Neon), run our SQL DDL schemas/migrations to build structures, and setup next-app routing blocks.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#151922] border border-gray-850 rounded">
                  <span className="bg-[#60A5FA] text-black font-extrabold w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs shrink-0">2</span>
                  <div>
                    <span className="font-bold text-white block uppercase">Phase 2: SSO Credentials & Auth Gateways</span>
                    <p className="text-gray-400 mt-0.5">Configure Google Developer OAuth credentials, bind NextAuth token routes inside backend, and establish secure bcrypt/GCM enclaves to encrypt login credentials.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#151922] border border-gray-850 rounded">
                  <span className="bg-emerald-400 text-black font-extrabold w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs shrink-0">3</span>
                  <div>
                    <span className="font-bold text-white block uppercase">Phase 3: Core Scraper Integrations & Captcha Solvers</span>
                    <p className="text-gray-400 mt-0.5">Develop secure background workers leveraging Puppeteer with slow browser behaviors. Hook custom DOM selector target parameters to isolate and update balances gracefully.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#151922] border border-gray-850 rounded">
                  <span className="bg-purple-400 text-black font-extrabold w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs shrink-0">4</span>
                  <div>
                    <span className="font-bold text-white block uppercase">Phase 4: Multiplatform Notification Systems</span>
                    <p className="text-gray-400 mt-0.5">Initialize Twilio SMS pipelines or web-push systems to broadcast daily claim successes, failing tasks (e.g. WAF locks), or approved redemptions directly to operator platforms.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
