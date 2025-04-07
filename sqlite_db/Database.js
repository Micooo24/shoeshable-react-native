import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true); 
SQLite.enablePromise(true);

let databaseInstance = null;

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

export const closeDatabase = async () => {
  if (databaseInstance) {
    await databaseInstance.close();
    databaseInstance = null;
    console.log('Database closed successfully');
  }
};