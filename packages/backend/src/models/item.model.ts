import { db } from '../db/database.js';
import type { Item } from '../types/models.js';

export const itemModel = {
  findById(id: number): Item | undefined {
    return db
      .prepare(
        `
      SELECT id, name, description, price, category, stock,
             image_url as imageUrl, created_at as createdAt, updated_at as updatedAt
      FROM items WHERE id = ?
    `
      )
      .get(id) as Item | undefined;
  },

  findAll(params?: {
    page?: number;
    limit?: number;
    category?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }): { items: Item[]; total: number } {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = (page - 1) * limit;
    const order = params?.order || 'asc';
    const sort = params?.sort || 'id';

    let query = `
      SELECT id, name, description, price, category, stock,
             image_url as imageUrl, created_at as createdAt, updated_at as updatedAt
      FROM items
    `;
    let countQuery = 'SELECT COUNT(*) as count FROM items';
    const queryParams: any = {};

    if (params?.category) {
      query += ' WHERE category = @category';
      countQuery += ' WHERE category = @category';
      queryParams.category = params.category;
    }

    query += ` ORDER BY ${sort} ${order.toUpperCase()} LIMIT @limit OFFSET @offset`;
    queryParams.limit = limit;
    queryParams.offset = offset;

    const items = db.prepare(query).all(queryParams) as Item[];
    const { count } = db.prepare(countQuery).get(queryParams) as { count: number };

    return { items, total: count };
  },

  create(data: {
    name: string;
    description?: string;
    price: number;
    category: string;
    stock?: number;
    imageUrl?: string;
  }): Item {
    const stmt = db.prepare(`
      INSERT INTO items (name, description, price, category, stock, image_url)
      VALUES (@name, @description, @price, @category, @stock, @imageUrl)
    `);

    const result = stmt.run({
      name: data.name,
      description: data.description || null,
      price: data.price,
      category: data.category,
      stock: data.stock || 0,
      imageUrl: data.imageUrl || null,
    });

    return this.findById(Number(result.lastInsertRowid))!;
  },

  update(
    id: number,
    data: Partial<Pick<Item, 'name' | 'description' | 'price' | 'category' | 'stock' | 'imageUrl'>>
  ): Item | undefined {
    const updates: string[] = [];
    const params: any = { id };

    if (data.name !== undefined) {
      updates.push('name = @name');
      params.name = data.name;
    }
    if (data.description !== undefined) {
      updates.push('description = @description');
      params.description = data.description;
    }
    if (data.price !== undefined) {
      updates.push('price = @price');
      params.price = data.price;
    }
    if (data.category !== undefined) {
      updates.push('category = @category');
      params.category = data.category;
    }
    if (data.stock !== undefined) {
      updates.push('stock = @stock');
      params.stock = data.stock;
    }
    if (data.imageUrl !== undefined) {
      updates.push('image_url = @imageUrl');
      params.imageUrl = data.imageUrl;
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    db.prepare(`UPDATE items SET ${updates.join(', ')} WHERE id = @id`).run(params);

    return this.findById(id);
  },

  delete(id: number): boolean {
    const result = db.prepare('DELETE FROM items WHERE id = ?').run(id);
    return result.changes > 0;
  },

  getCategories(): string[] {
    const results = db.prepare('SELECT DISTINCT category FROM items ORDER BY category').all() as {
      category: string;
    }[];
    return results.map((r) => r.category);
  },
};
