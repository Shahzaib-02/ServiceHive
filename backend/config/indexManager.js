import mongoose from 'mongoose';

export class IndexManager {
  constructor() {
    this.indexes = new Map();
  }

  async createIndex(collection, indexSpec, indexName) {
    const key = `${collection}_${indexName}`;
    if (this.indexes.has(key)) {
      console.log(` Index ${key} already exists, skipping...`);
      return;
    }

    try {
      await mongoose.connection.db.collection(collection).createIndex(indexSpec, { name: indexName });
      this.indexes.set(key, true);
      // console.log(`✅ Created index ${key}`);
    } catch (error) {
      console.log(`❌ Failed to create index ${key}:`, error.message);
    }
  }

  async createAllIndexes() {
    // console.log('🔧 Creating database indexes...');
    
    // User indexes
    await this.createIndex('users', { email: 1 }, 'email_unique');
    
    // Service indexes
    await this.createIndex('services', { 
      providerId: 1, 
      category: 1, 
      group: 1, 
      isApproved: 1, 
      createdAt: -1 
    }, 'services_compound');
    
    await this.createIndex('services', { 
      title: 'text', 
      description: 'text' 
    }, 'services_search');
    
    await this.createIndex('services', { 
      basePrice: 1 
    }, 'services_price');
    
    // console.log('✅ All database indexes created successfully');
  }
}
