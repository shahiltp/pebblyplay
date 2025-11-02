export interface CreateOrderParams {
  items: Array<{
    variantId: string;
    quantity: number;
  }>;
  currency: 'INR';
  email?: string;
  userId?: string;
}

export interface CreateOrderResult {
  providerOrderId: string;
  amountCents: number;
  // Additional provider-specific data
  [key: string]: any;
}

export interface PaymentProvider {
  /**
   * Create an order with the payment provider
   */
  createOrder(params: CreateOrderParams): Promise<CreateOrderResult>;
}

