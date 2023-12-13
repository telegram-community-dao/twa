import type { _GenerationPaywallSingleConfig } from '@tok/generation/defineConfig';

export type PaywallCustomPresetProps = Omit<
  _GenerationPaywallSingleConfig,
  'extends'
> & {
  cta: string
  timerText: string,
  endTime: number,
};

const defaultProduct = {
  id: 'id1',
  title: 'Product Title',
  price: 99.99,
  description: 'Product description',
  cta: {
    title: 'string'
  },
  timer: {
    title: 'string',
    timestamp: 1999999999 
  }
};

export const PaywallCustomPresetDefaultProps = {
  product: () => defaultProduct,
} as const;
