import {Platform} from 'react-native';

let baseURL = '';

{Platform.OS == 'android'
    ? baseURL = 'http://192.168.254.104:5000'
    : baseURL = 'http://localhost:3000'
}   

// {Platform.OS == 'android'
//     ? baseURL = 'http://192.168.254.103:5000'
//     : baseURL = 'http://localhost:3000'
// }   

// {Platform.OS == 'android'
//     ? baseURL = 'http://192.168.75.221:5000'
//     : baseURL = 'http://localhost:3000'
// }   

export default baseURL;