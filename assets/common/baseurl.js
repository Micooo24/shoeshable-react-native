import {Platform} from 'react-native';

let baseURL = '';

{Platform.OS == 'android'
    ? baseURL = 'http://192.168.254.115:8081'
    : baseURL = 'http://localhost:3000'
}   

export default baseURL;