import type { FastifyInstance } from 'fastify';

export default async function schemaRoutes(fastify: FastifyInstance) {
  // Get available test endpoints
  fastify.get('/endpoints', async (request, reply) => {
    return reply.send({
      endpoints: [
        {
          id: 'user',
          name: 'User Profile',
          path: '/api/schema-test/user',
          method: 'GET',
          description: 'Returns user profile data',
        },
        {
          id: 'product',
          name: 'Product Details',
          path: '/api/schema-test/product',
          method: 'GET',
          description: 'Returns product information',
        },
        {
          id: 'order',
          name: 'Order Data',
          path: '/api/schema-test/order',
          method: 'GET',
          description: 'Returns order with items',
        },
        {
          id: 'settings',
          name: 'User Settings',
          path: '/api/schema-test/settings',
          method: 'GET',
          description: 'Returns user preferences',
        },
      ],
    });
  });

  // User endpoint - standard valid response
  fastify.get<{
    Querystring: { variant?: string };
  }>('/user', async (request, reply) => {
    const { variant } = request.query;

    // Valid response
    if (!variant || variant === 'valid') {
      return reply.send({
        id: 1,
        email: 'john.doe@example.com',
        name: 'John Doe',
        age: 30,
        isActive: true,
        roles: ['user', 'editor'],
        profile: {
          bio: 'Software developer',
          location: 'San Francisco',
          website: 'https://johndoe.com',
        },
        createdAt: '2024-01-15T10:30:00Z',
      });
    }

    // Missing required field
    if (variant === 'missing-required') {
      return reply.send({
        id: 1,
        // email missing (required)
        name: 'John Doe',
        age: 30,
        isActive: true,
      });
    }

    // Wrong type
    if (variant === 'wrong-type') {
      return reply.send({
        id: '1', // should be number
        email: 'john.doe@example.com',
        name: 'John Doe',
        age: '30', // should be number
        isActive: 'yes', // should be boolean
      });
    }

    // Invalid format
    if (variant === 'invalid-format') {
      return reply.send({
        id: 1,
        email: 'not-an-email', // invalid email format
        name: 'John Doe',
        age: 30,
        isActive: true,
        profile: {
          website: 'not-a-url', // invalid URL format
        },
        createdAt: 'not-a-date', // invalid date format
      });
    }

    // Extra fields
    if (variant === 'extra-fields') {
      return reply.send({
        id: 1,
        email: 'john.doe@example.com',
        name: 'John Doe',
        age: 30,
        isActive: true,
        extraField: 'should not be here',
        anotherExtra: 123,
      });
    }

    // Null values
    if (variant === 'null-values') {
      return reply.send({
        id: 1,
        email: null, // should be string
        name: 'John Doe',
        age: null, // should be number
        isActive: true,
        roles: null, // should be array
      });
    }

    return reply.send({ id: 1, email: 'test@example.com', name: 'Test User' });
  });

  // Product endpoint
  fastify.get<{
    Querystring: { variant?: string };
  }>('/product', async (request, reply) => {
    const { variant } = request.query;

    if (!variant || variant === 'valid') {
      return reply.send({
        id: 101,
        name: 'Laptop',
        price: 999.99,
        inStock: true,
        categories: ['Electronics', 'Computers'],
        specifications: {
          brand: 'TechBrand',
          model: 'Pro 2024',
          warranty: 2,
        },
        tags: ['new', 'featured'],
      });
    }

    if (variant === 'missing-required') {
      return reply.send({
        id: 101,
        // name missing (required)
        price: 999.99,
      });
    }

    if (variant === 'wrong-type') {
      return reply.send({
        id: 101,
        name: 'Laptop',
        price: '999.99', // should be number
        inStock: 'yes', // should be boolean
        categories: 'Electronics', // should be array
      });
    }

    if (variant === 'empty-array') {
      return reply.send({
        id: 101,
        name: 'Laptop',
        price: 999.99,
        inStock: true,
        categories: [], // empty array (test edge case)
        tags: [],
      });
    }

    return reply.send({ id: 101, name: 'Test Product', price: 99.99 });
  });

  // Order endpoint - nested objects and arrays
  fastify.get<{
    Querystring: { variant?: string };
  }>('/order', async (request, reply) => {
    const { variant } = request.query;

    if (!variant || variant === 'valid') {
      return reply.send({
        orderId: 'ORD-2024-001',
        customerId: 42,
        status: 'pending',
        total: 1549.98,
        items: [
          {
            productId: 101,
            name: 'Laptop',
            quantity: 1,
            price: 999.99,
          },
          {
            productId: 102,
            name: 'Mouse',
            quantity: 2,
            price: 24.99,
          },
        ],
        shipping: {
          address: '123 Main St',
          city: 'San Francisco',
          zipCode: '94102',
          country: 'USA',
        },
        createdAt: '2024-11-18T10:00:00Z',
      });
    }

    if (variant === 'nested-missing') {
      return reply.send({
        orderId: 'ORD-2024-001',
        customerId: 42,
        status: 'pending',
        total: 1549.98,
        items: [
          {
            productId: 101,
            // name missing in nested object
            quantity: 1,
            price: 999.99,
          },
        ],
        shipping: {
          address: '123 Main St',
          // city missing in nested object
          zipCode: '94102',
        },
      });
    }

    if (variant === 'nested-wrong-type') {
      return reply.send({
        orderId: 'ORD-2024-001',
        customerId: 42,
        status: 'pending',
        total: 1549.98,
        items: [
          {
            productId: '101', // should be number
            name: 'Laptop',
            quantity: '1', // should be number
            price: 999.99,
          },
        ],
        shipping: {
          address: 123, // should be string
          city: 'San Francisco',
          zipCode: 94102, // should be string
        },
      });
    }

    if (variant === 'empty-items') {
      return reply.send({
        orderId: 'ORD-2024-001',
        customerId: 42,
        status: 'pending',
        total: 0,
        items: [], // empty items array
        shipping: {
          address: '123 Main St',
          city: 'San Francisco',
          zipCode: '94102',
        },
      });
    }

    return reply.send({ orderId: 'ORD-001', customerId: 1, status: 'pending', total: 0 });
  });

  // Settings endpoint - pattern matching
  fastify.get<{
    Querystring: { variant?: string };
  }>('/settings', async (request, reply) => {
    const { variant } = request.query;

    if (!variant || variant === 'valid') {
      return reply.send({
        userId: 1,
        theme: 'dark',
        language: 'en-US',
        notifications: {
          email: true,
          push: false,
          sms: false,
        },
        privacy: {
          profileVisible: true,
          showEmail: false,
        },
        phoneNumber: '+1-555-0123',
        timezone: 'America/Los_Angeles',
      });
    }

    if (variant === 'invalid-pattern') {
      return reply.send({
        userId: 1,
        theme: 'dark',
        language: 'invalid-locale', // should match pattern
        phoneNumber: '555-0123', // should match phone pattern
        timezone: 'InvalidTimezone',
      });
    }

    if (variant === 'invalid-enum') {
      return reply.send({
        userId: 1,
        theme: 'rainbow', // should be 'light' or 'dark'
        language: 'en-US',
      });
    }

    return reply.send({ userId: 1, theme: 'light', language: 'en-US' });
  });
}
