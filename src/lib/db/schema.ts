import { pgTable, text, timestamp, integer, real, boolean, serial, jsonb } from 'drizzle-orm/pg-core';

// 사용자 테이블
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  clerkId: text('clerk_id').unique().notNull(),
  email: text('email').unique(),
  name: text('name'),
  preferredLocale: text('preferred_locale').default('ko'),
  theme: text('theme').default('junior'), // 'junior' | 'senior'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 연습 세션 테이블
export const practiceSessions = pgTable('practice_sessions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id).notNull(),
  type: text('type').notNull(), // 'home-row', 'words', 'sentences', 'listen-write', 'speak', 'document'
  locale: text('locale').default('ko'),
  wpm: integer('wpm'),
  accuracy: real('accuracy'),
  duration: integer('duration'), // seconds
  charactersTyped: integer('characters_typed'),
  errorsCount: integer('errors_count'),
  contentId: text('content_id'),
  completedAt: timestamp('completed_at').defaultNow(),
});

// 구조화된 학습 데이터 타입
export interface StructuredContent {
  words: Array<{
    word: string;
    meaning: string;
    example: string;
  }>;
  sentences: Array<{
    original: string;
    translation: string;
  }>;
}

// 문서 테이블
export const documents = pgTable('documents', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  originalText: text('original_text'),
  summary: text('summary'),
  structured: jsonb('structured').$type<StructuredContent>(), // 단어/문장 + 번역 데이터
  fileUrl: text('file_url'),
  fileType: text('file_type'), // 'pdf', 'txt', 'docx'
  locale: text('locale').default('ko'),
  source: text('source').default('manual'), // 'manual', 'upload', 'ai', 'url'
  createdAt: timestamp('created_at').defaultNow(),
});

// 타이핑 콘텐츠 테이블
export const typingContents = pgTable('typing_contents', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  type: text('type').notNull(), // 'sentence', 'word', 'home-row'
  locale: text('locale').notNull(),
  difficulty: text('difficulty').default('medium'), // 'easy', 'medium', 'hard'
  content: text('content').notNull(),
  category: text('category'),
  isAiGenerated: boolean('is_ai_generated').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// 사용자 통계 테이블
export const userStats = pgTable('user_stats', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id).unique().notNull(),
  totalSessions: integer('total_sessions').default(0),
  totalTime: integer('total_time').default(0), // seconds
  averageWpm: real('average_wpm'),
  averageAccuracy: real('average_accuracy'),
  currentStreak: integer('current_streak').default(0),
  longestStreak: integer('longest_streak').default(0),
  lastPracticeAt: timestamp('last_practice_at'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 사용자 진행 상황 (홈로우 키 레벨 등)
export const userProgress = pgTable('user_progress', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  skillType: text('skill_type').notNull(), // 'home-row', 'top-row', 'bottom-row', etc.
  level: integer('level').default(1),
  completedAt: timestamp('completed_at'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ===== 관리자 시스템 =====
export const adminUsers = pgTable('admin_users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id).unique().notNull(),
  role: text('role').notNull().default('admin'), // 'super_admin', 'admin'
  createdAt: timestamp('created_at').defaultNow(),
});

// ===== AI 크레딧 시스템 =====

// 사용자 크레딧 잔액
export const userCredits = pgTable('user_credits', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id).unique().notNull(),
  balance: integer('balance').default(200).notNull(), // 무료 크레딧
  totalUsed: integer('total_used').default(0),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 크레딧 거래 내역
export const creditTransactions = pgTable('credit_transactions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id).notNull(),
  amount: integer('amount').notNull(), // 음수=사용, 양수=충전
  type: text('type').notNull(), // 'usage', 'purchase', 'subscription', 'bonus'
  apiEndpoint: text('api_endpoint'),
  tokensUsed: integer('tokens_used'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 구독 정보
export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id).unique().notNull(),
  plan: text('plan').notNull().default('monthly'), // 'monthly'
  status: text('status').notNull().default('active'), // 'active', 'cancelled', 'expired'
  priceKrw: integer('price_krw').notNull().default(1000),
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  tossBillingKey: text('toss_billing_key'),
  cancelledAt: timestamp('cancelled_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 결제 내역
export const payments = pgTable('payments', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id).notNull(),
  type: text('type').notNull(), // 'subscription', 'credit_pack'
  amountKrw: integer('amount_krw').notNull(),
  creditsAdded: integer('credits_added'), // 크레딧팩 구매 시
  status: text('status').notNull().default('pending'), // 'pending', 'completed', 'failed', 'refunded'
  tossPaymentKey: text('toss_payment_key'),
  tossOrderId: text('toss_order_id'),
  createdAt: timestamp('created_at').defaultNow(),
  completedAt: timestamp('completed_at'),
});

// ===== 상세 통계 =====

// 키스트로크 에러 (개별 에러 기록)
export const keystrokeErrors = pgTable('keystroke_errors', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').references(() => practiceSessions.id),
  userId: text('user_id').references(() => users.id).notNull(),
  targetKey: text('target_key').notNull(),
  typedKey: text('typed_key').notNull(),
  position: integer('position').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 키별 통계 (집계용)
export const keyStatistics = pgTable('key_statistics', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id).notNull(),
  key: text('key').notNull(),
  totalAttempts: integer('total_attempts').default(0),
  errorCount: integer('error_count').default(0),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 일별 통계 스냅샷
export const dailyStats = pgTable('daily_stats', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id).notNull(),
  date: text('date').notNull(), // 'YYYY-MM-DD'
  sessionsCount: integer('sessions_count').default(0),
  totalTime: integer('total_time').default(0), // seconds
  totalCharacters: integer('total_characters').default(0),
  errorCount: integer('error_count').default(0),
  avgWpm: real('avg_wpm'),
  avgAccuracy: real('avg_accuracy'),
});

// 타입 추출
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type PracticeSession = typeof practiceSessions.$inferSelect;
export type NewPracticeSession = typeof practiceSessions.$inferInsert;
export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
export type TypingContent = typeof typingContents.$inferSelect;
export type UserStats = typeof userStats.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;

// 신규 테이블 타입
export type AdminUser = typeof adminUsers.$inferSelect;
export type UserCredit = typeof userCredits.$inferSelect;
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type KeystrokeError = typeof keystrokeErrors.$inferSelect;
export type KeyStatistic = typeof keyStatistics.$inferSelect;
export type DailyStat = typeof dailyStats.$inferSelect;
