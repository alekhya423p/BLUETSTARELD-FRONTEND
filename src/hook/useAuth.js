function useAuth() {

    var auth =false;
    auth = (localStorage.getItem('token')) ? true : false
    return auth;
}
  
export default useAuth;