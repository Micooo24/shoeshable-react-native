import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true); // Set to false in production
SQLite.enablePromise(true);

let databaseInstance = null;

/**
 * Initialize and get the database connection
 * @returns {Promise<SQLite.SQLiteDatabase>} The database connection
 */
export const getDatabase = async () => {
  if (databaseInstance) {
    return databaseInstance;
  }

  try {
    databaseInstance = await SQLite.openDatabase({
      name: 'shoeshable.db',
      location: 'default',
    });

    console.log('Database initialized successfully');
    return databaseInstance;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

/**
 * Close the database connection when the app is shutting down
 */
export const closeDatabase = async () => {
  if (databaseInstance) {
    await databaseInstance.close();
    databaseInstance = null;
    console.log('Database closed successfully');
  }
};