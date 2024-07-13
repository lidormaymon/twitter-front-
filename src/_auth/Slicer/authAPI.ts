import axios from "axios";
import { API_SERVER } from "../../lib/api";




export function loginAPI(username:string, password:string){
    const creds = {username, password}
    console.log(creds);
    
    return axios.post(API_SERVER + 'login/' , creds)
}

export const googleLoginAPI = (token:string) => {
    return 
}

export function checkCredsValid (token:any) {
    return axios.get(API_SERVER + 'user/', {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

export function register(username: string, password: string, email: string, display_name: string, image: File) {
  const userData = new FormData();
  userData.append('username', username);
  userData.append('password', password);
  userData.append('email', email);
  userData.append('display_name', display_name);
  if (image === null) {
    let image = ''
    userData.append('image', image)
  } else userData.append('image', image)

  return axios.post(API_SERVER + 'register/', userData);
}

export const activateAccountAPI = (user_id:number) => {
    return axios.put(API_SERVER + `user/${user_id}/`, { email_verified: true } )
}

export const chkRefreshToken = (refresh:string) => {   
    const data = {
        "refresh":refresh
    }
    console.log(refresh);
    
    return axios.post(API_SERVER + 'refresh/' , data)
}

export const getUsersData = () => {
    return axios.get(API_SERVER + 'user/' )
}

export const fetchUserPostsAPI = (user_id:number) => {
    console.log(user_id);
    
    return axios.post(API_SERVER + `user-posts/`, { user_id})
}

export const  searchUsersAPI = (searchQuery: string) => {
  return axios.get(API_SERVER + 'search-users/?query=' + searchQuery);
}

export const editUserAPI = (user_id:number,  display_name:string, bio:string, image:File) => {
    const userData = new FormData()
    userData.append('display_name', display_name);
    if (image !== null) {
        userData.append('profile_image', image);
    }else userData.append('image', '')
    userData.append('bio', bio)
    console.log(userData);
    

    return axios.put(API_SERVER + `user/${user_id}/`, userData)
}

export const changePwdAPI =  async (oldPWD:string, newPWD:string, user_id:number, username:string) => {
    const response = await loginAPI(username, oldPWD)
    console.log(response);
    if (response.status === 200) {
        return axios.put(API_SERVER + `user/${user_id}/`, {password:newPWD})
    }else return 'Wrong password'
    
}

export const verifiedAPI = (user_id:number, isVerfied:boolean) => {
    if (isVerfied) {
        return axios.put(API_SERVER + `user/${user_id}/`, {is_verified:false})
    }else {
        return axios.put(API_SERVER + `user/${user_id}/`, {is_verified:true})
    }
}