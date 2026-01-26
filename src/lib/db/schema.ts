import { pgTable, text, timestamp, integer, real, boolean, serial } from 'drizzle-orm/pg-core';

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

// 문서 테이블
export const documents = pgTable('documents', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  originalText: text('original_text'),
  summary: text('summary'),
  fileUrl: text('file_url'),
  fileType: text('file_type'), // 'pdf', 'txt', 'docx'
  locale: text('locale').default('ko'),
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
