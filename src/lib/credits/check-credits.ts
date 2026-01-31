import { db, userCredits, creditTransactions, subscriptions } from '@/lib/db';
import { eq, and, gte } from 'drizzle-orm';

export interface CreditCheckResult {
  allowed: boolean;
  hasSubscription: boolean;
  balance: number;
  creditsUsed?: number;
}

/**
 * 토큰 수 기반으로 필요한 크레딧 계산
 * 10,000 토큰 = 1 크레딧
 */
export function calculateCreditsNeeded(tokens: number): number {
  return Math.ceil(tokens / 10000);
}

/**
 * 텍스트 길이 기반 토큰 수 추정
 * 한글: 약 1.5 토큰/글자
 * 영문: 약 0.25 토큰/단어 (평균 4글자 = 1토큰)
 */
export function estimateTokens(text: string): number {
  const koreanChars = (text.match(/[ㄱ-ㅎ가-힣]/g) || []).length;
  const otherChars = text.length - koreanChars;

  // 기본 토큰 + 시스템 프롬프트 여유분 (500)
  const estimatedTokens = Math.ceil(koreanChars * 1.5 + otherChars * 0.3) + 500;

  // 입력 + 출력 고려 (x2)
  return estimatedTokens * 2;
}

/**
 * 활성 구독 확인
 */
export async function getActiveSubscription(userId: string) {
  const now = new Date();

  const result = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, 'active'),
        gte(subscriptions.currentPeriodEnd, now)
      )
    )
    .limit(1);

  return result[0] || null;
}

/**
 * 사용자 크레딧 조회
 */
export async function getUserCredits(userId: string) {
  const result = await db
    .select()
    .from(userCredits)
    .where(eq(userCredits.userId, userId))
    .limit(1);

  return result[0] || null;
}

/**
 * 크레딧 거래 기록
 */
async function logCreditTransaction(
  userId: string,
  amount: number,
  type: 'usage' | 'purchase' | 'subscription' | 'bonus',
  apiEndpoint?: string,
  tokensUsed?: number,
  description?: string
) {
  await db.insert(creditTransactions).values({
    userId,
    amount,
    type,
    apiEndpoint,
    tokensUsed,
    description,
  });
}

/**
 * 크레딧 체크 및 차감
 * AI API 호출 전에 사용
 */
export async function checkAndDeductCredits(
  userId: string,
  estimatedTokens: number,
  apiEndpoint: string
): Promise<CreditCheckResult> {
  // 1. 활성 구독 확인 → 있으면 무제한 사용
  const subscription = await getActiveSubscription(userId);

  if (subscription) {
    // 구독자는 크레딧 차감 없이 사용 기록만 남김
    await logCreditTransaction(
      userId,
      0,
      'subscription',
      apiEndpoint,
      estimatedTokens,
      '구독 사용'
    );

    return {
      allowed: true,
      hasSubscription: true,
      balance: Infinity,
      creditsUsed: 0,
    };
  }

  // 2. 크레딧 잔액 확인
  const credits = await getUserCredits(userId);

  if (!credits) {
    // 크레딧 레코드가 없으면 생성 (기존 사용자 호환)
    await db.insert(userCredits).values({
      userId,
      balance: 200, // 무료 크레딧 지급
    });

    return checkAndDeductCredits(userId, estimatedTokens, apiEndpoint);
  }

  const creditsNeeded = calculateCreditsNeeded(estimatedTokens);

  if (credits.balance < creditsNeeded) {
    return {
      allowed: false,
      hasSubscription: false,
      balance: credits.balance,
      creditsUsed: 0,
    };
  }

  // 3. 크레딧 차감
  const newBalance = credits.balance - creditsNeeded;

  await db
    .update(userCredits)
    .set({
      balance: newBalance,
      totalUsed: (credits.totalUsed || 0) + creditsNeeded,
      updatedAt: new Date(),
    })
    .where(eq(userCredits.userId, userId));

  // 4. 거래 기록
  await logCreditTransaction(
    userId,
    -creditsNeeded,
    'usage',
    apiEndpoint,
    estimatedTokens,
    `AI API 사용: ${apiEndpoint}`
  );

  return {
    allowed: true,
    hasSubscription: false,
    balance: newBalance,
    creditsUsed: creditsNeeded,
  };
}

/**
 * 크레딧 추가 (구매/보너스)
 */
export async function addCredits(
  userId: string,
  amount: number,
  type: 'purchase' | 'bonus',
  description?: string
) {
  const credits = await getUserCredits(userId);

  if (!credits) {
    await db.insert(userCredits).values({
      userId,
      balance: amount,
    });
  } else {
    await db
      .update(userCredits)
      .set({
        balance: credits.balance + amount,
        updatedAt: new Date(),
      })
      .where(eq(userCredits.userId, userId));
  }

  await logCreditTransaction(userId, amount, type, undefined, undefined, description);
}
