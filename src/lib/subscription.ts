export type PlanId = 'trial' | 'monthly' | 'annual';
export type SubStatus =
  | 'active'
  | 'expired'
  | 'past_due'
  | 'paused'
  | 'canceled'
  | 'incomplete';

export interface Subscription {
  plan_id: PlanId | string;
  status: SubStatus | string;
  current_period_end: number | null;
}

export type SubState =
  | 'trial-active'
  | 'trial-expired'
  | 'paid-active'
  | 'paid-canceled'
  | 'paid-past-due'
  | 'billing-issue'
  | 'none';

export interface InterpretedSubscription {
  state: SubState;
  plan_id: string;
  status: string;
  current_period_end: number | null;
  daysRemaining: number | null;
  isPaid: boolean;
  isTrial: boolean;
  hasAccess: boolean;
}

export function interpretSubscription(
  sub: Subscription | null | undefined,
  now: number = Math.floor(Date.now() / 1000),
): InterpretedSubscription {
  if (!sub) {
    return {
      state: 'none',
      plan_id: '',
      status: '',
      current_period_end: null,
      daysRemaining: null,
      isPaid: false,
      isTrial: false,
      hasAccess: false,
    };
  }

  const { plan_id, status, current_period_end } = sub;
  const daysRemaining =
    current_period_end != null
      ? Math.max(0, Math.ceil((current_period_end - now) / 86400))
      : null;

  let state: SubState = 'none';
  if (plan_id === 'trial') {
    state = status === 'active' ? 'trial-active' : 'trial-expired';
  } else if (plan_id === 'monthly' || plan_id === 'annual') {
    if (status === 'active') state = 'paid-active';
    else if (status === 'canceled') state = 'paid-canceled';
    else if (status === 'past_due') state = 'paid-past-due';
    else state = 'billing-issue';
  }

  const hasAccess =
    state === 'trial-active' ||
    state === 'paid-active' ||
    state === 'paid-canceled' ||
    state === 'paid-past-due';

  return {
    state,
    plan_id,
    status,
    current_period_end,
    daysRemaining,
    isPaid: state === 'paid-active' || state === 'paid-canceled' || state === 'paid-past-due',
    isTrial: plan_id === 'trial',
    hasAccess,
  };
}

export function planLabel(planId: string): string {
  if (planId === 'monthly') return 'Monthly';
  if (planId === 'annual') return 'Annual';
  if (planId === 'trial') return 'Trial';
  return planId.charAt(0).toUpperCase() + planId.slice(1);
}
