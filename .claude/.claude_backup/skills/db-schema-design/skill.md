# db-schema-design Skill

## 목적
Drizzle ORM을 사용하여 Neon PostgreSQL 스키마를 설계하고 Row Level Security(RLS)를 적용한다.

## 스키마 설계

### 1. 사용자 (users)
```typescript
import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';

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
```

### 2. 연습 세션 (practice_sessions)
```typescript
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
  contentId: text('content_id'), // 연습한 콘텐츠 참조
  completedAt: timestamp('completed_at').defaultNow(),
});
```

### 3. 문서 (documents)
```typescript
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
```

### 4. 타이핑 콘텐츠 (typing_contents)
```typescript
export const typingContents = pgTable('typing_contents', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  type: text('type').notNull(), // 'sentence', 'word', 'home-row'
  locale: text('locale').notNull(),
  difficulty: text('difficulty').default('medium'), // 'easy', 'medium', 'hard'
  content: text('content').notNull(),
  category: text('category'), // 'daily', 'business', 'tech', etc.
  isAiGenerated: boolean('is_ai_generated').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### 5. 사용자 통계 (user_stats)
```typescript
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
```

## Row Level Security (RLS)

### 정책 설정
```sql
-- users 테이블
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_policy ON users
  USING (clerk_id = current_setting('app.clerk_id'));

-- practice_sessions 테이블
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY sessions_policy ON practice_sessions
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_id = current_setting('app.clerk_id')
  ));

-- documents 테이블
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY documents_policy ON documents
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_id = current_setting('app.clerk_id')
  ));
```

## 사용 Agent
- Architect: 스키마 설계
- Backend-Dev: 구현

## 체크리스트
- [ ] Drizzle 스키마 정의
- [ ] 마이그레이션 생성
- [ ] RLS 정책 적용
- [ ] 인덱스 최적화
- [ ] 관계 설정
