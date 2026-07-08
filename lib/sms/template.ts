export const TEMPLATES = {
  NEW_ORDER: `Hi {{user_name}},
Your order for {{customer_name}} has been received.

Order: #{{order_id}}
Items: {{item_count}}
Order Total: {{order_total}}

We'll begin preparing your order shortly. Contact your sales rep if you need to make any changes.
Thank you for choosing Jimenez Produce.`,

  NEW_ORDER_ADMIN: `New order received from {{customer_name}}.

Order: #{{order_id}}
Items: {{item_count}}
Order Total: {{order_total}}

Please review and process the order.`,

  ORDER_COMPLETED_ADMIN: `Order #{{order_id}} has been marked as completed.

Customer: {{customer_name}}
Items: {{item_count}}
Order Total: {{order_total}}

The order is now closed.`,
};
