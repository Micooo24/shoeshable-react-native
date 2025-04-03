import { getDatabase } from './Database';

/**
 * Initialize all database tables
 */
export const initializeTables = async () => {
  try {
    const db = await getDatabase();
    
    // Initialize all tables in a single transaction
    await db.transaction(tx => {
      // Auth table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS auth (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          authToken TEXT NOT NULL,
          email TEXT NOT NULL
        );`,
        [],
        () => console.log('Auth table created successfully'),
        (_, error) => console.error('Error creating auth table:', error)
      );
      
      // Cart table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS cart (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          product_id TEXT NOT NULL,
          quantity INTEGER DEFAULT 1,
          brand TEXT,
          category TEXT,
          size TEXT,
          color TEXT,
          gender TEXT,
          createdAt TEXT,
          updatedAt TEXT,
          UNIQUE(user_id, product_id)
        );`,
        [],
        () => console.log('Cart table created successfully'),
        (_, error) => console.error('Error creating cart table:', error)
      );
    });
    
    console.log('All tables initialized successfully');
  } catch (error) {
    console.error('Error initializing tables:', error);
    throw error;
  }
};