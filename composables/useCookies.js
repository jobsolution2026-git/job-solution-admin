import moment from "moment";

const commonCookieOptions = {
    maxAge: 60 * 60 * 24 * 30,
    priority: 'high',
    secure: true,
    size: 20480
};

const useTokenCookie = () => useCookie('token', commonCookieOptions);
const useUserCookie = () => useCookie('user', commonCookieOptions);

export function accessToken() {
    const cookieToken = useTokenCookie();
    return cookieToken.value || null;
}

export function getUser() {
    const cookieUser = useUserCookie();
    return cookieUser.value || null;
}

export const setCookies = (name, value) => {
    const cookie = useCookie(name, commonCookieOptions);
    cookie.value = value;
};

export const setUser = (user) => {
    setCookies('user', user || '', commonCookieOptions);
    return true;
};

export const setAccessToken = (authorization) =>{
    setCookies('token', authorization || '', commonCookieOptions);

    return true;
}

export const resetAllCookies = () => {
    setCookies('token', '');
    setCookies('user', '');
    return true;
};
