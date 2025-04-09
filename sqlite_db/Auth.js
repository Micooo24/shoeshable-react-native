import { getDatabase } from './Database';


export const saveToken = async (token, email) => {
  try {
    const db = await getDatabase();

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        // Clear the table to ensure only one user is logged in at a time
        tx.executeSql(
          'DELETE FROM auth;',
          [],
          () => console.log('Cleared auth table for new login'),
          (_, error) => {
            console.error('Error clearing auth table:', error);
            reject(error);
          }
        );

        // Insert the new token and email
        tx.executeSql(
          'INSERT INTO auth (authToken, email) VALUES (?, ?);',
          [token, email],
          () => {
            console.log(`Token saved for ${email}`);
            resolve(true);
          },
          (_, error) => {
            console.error('Error saving token:', error);
            reject(error);
          }
        );
      });
    });
  } catch (error) {
    console.error('Error in saveToken:', error);
    throw error;
  }
};


export const getToken = async () => {
  try {
    const db = await getDatabase();

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT authToken, email FROM auth LIMIT 1;',
          [],
          (_, { rows }) => {
            if (rows.length > 0) {
              const result = rows.item(0);
              console.log('Currently logged-in user:', result);
              resolve(result);
            } else {
              console.log('No user is currently logged in');
              resolve(null);
            }
          },
          (_, error) => {
            console.error('Error fetching token:', error);
            reject(error);
          }
        );
      });
    });
  } catch (error) {
    console.error('Error in getToken:', error);
    throw error;
  }
};


export const removeToken = async () => {
  try {
    const db = await getDatabase();

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM auth;',
          [],
          () => {
            console.log('Token and email removed for the currently logged-in user');
            resolve(true);
          },
          (_, error) => {
            console.error('Error removing token:', error);
            reject(error);
          }
        );
      });
    });
  } catch (error) {
    console.error('Error in removeToken:', error);
    throw error;
  }
};