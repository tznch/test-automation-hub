import { db } from '../db/database.js';
import type { Order, OrderItem } from '../types/models.js';

export const orderModel = {
  findById(id: number): (Order & { items: OrderItem[] }) | undefined {
    const order = db
      .prepare(
        `
      SELECT id, user_id as userId, status, total,
             created_at as createdAt, updated_at as updatedAt
      FROM orders WHERE id = ?
    `
      )
      .get(id) as Order | undefined;

    if (!order) return undefined;

    const items = db
      .prepare(
        `
      SELECT id, order_id as orderId, item_id as itemId, quantity, price
      FROM order_items WHERE order_id = ?
    `
      )
      .all(id) as OrderItem[];

    return { ...order, items };
  },

  findByUserId(userId: number): (Order & { items: OrderItem[] })[] {
    const orders = db
      .prepare(
        `
      SELECT id, user_id as userId, status, total,
             created_at as createdAt, updated_at as updatedAt
      FROM orders WHERE user_id = ? ORDER BY created_at DESC
    `
      )
      .all(userId) as Order[];

    return orders.map((order) => {
      const items = db
        .prepare(
          `
        SELECT id, order_id as orderId, item_id as itemId, quantity, price
        FROM order_items WHERE order_id = ?
      `
        )
        .all(order.id) as OrderItem[];

      return { ...order, items };
    });
  },

  findAll(): (Order & { items: OrderItem[] })[] {
    const orders = db
      .prepare(
        `
      SELECT id, user_id as userId, status, total,
             created_at as createdAt, updated_at as updatedAt
      FROM orders ORDER BY created_at DESC
    `
      )
      .all() as Order[];

    return orders.map((order) => {
      const items = db
        .prepare(
          `
        SELECT id, order_id as orderId, item_id as itemId, quantity, price
        FROM order_items WHERE order_id = ?
      `
        )
        .all(order.id) as OrderItem[];

      return { ...order, items };
    });
  },

  create(data: {
    userId: number;
    items: { itemId: number; quantity: number; price: number }[];
  }): Order & { items: OrderItem[] } {
    const total = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderStmt = db.prepare(`
      INSERT INTO orders (user_id, status, total)
      VALUES (@userId, 'pending', @total)
    `);

    const result = orderStmt.run({ userId: data.userId, total });
    const orderId = Number(result.lastInsertRowid);

    const itemStmt = db.prepare(`
      INSERT INTO order_items (order_id, item_id, quantity, price)
      VALUES (@orderId, @itemId, @quantity, @price)
    `);

    data.items.forEach((item) => {
      itemStmt.run({
        orderId,
        itemId: item.itemId,
        quantity: item.quantity,
        price: item.price,
      });
    });

    return this.findById(orderId)!;
  },

  updateStatus(
    id: number,
    status: 'pending' | 'processing' | 'completed' | 'cancelled'
  ): Order | undefined {
    db.prepare(
      `
      UPDATE orders SET status = @status, updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `
    ).run({ id, status });

    const order = db
      .prepare(
        `
      SELECT id, user_id as userId, status, total,
             created_at as createdAt, updated_at as updatedAt
      FROM orders WHERE id = ?
    `
      )
      .get(id) as Order | undefined;

    return order;
  },

  delete(id: number): boolean {
    const result = db.prepare('DELETE FROM orders WHERE id = ?').run(id);
    return result.changes > 0;
  },
};
