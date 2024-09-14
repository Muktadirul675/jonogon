import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import axios from "axios";
import https from 'https'

// These two values should be a bit less than actual token lifetimes
const BACKEND_ACCESS_TOKEN_LIFETIME = 23 * 60 * 60;            // 45 minutes
const BACKEND_REFRESH_TOKEN_LIFETIME = 6 * 24 * 60 * 60;  // 6 days

const getCurrentEpochTime = () => {
    return Math.floor(new Date().getTime() / 1000);
};

const SIGN_IN_HANDLERS: any = {
    "credentials": async (user: any, account: any, profile: any, email: any, credentials: any) => {
        return true;
    },
    "google": async (user: any, account: any, profile: any, email: any, credentials: any) => {
        // console.log('Account : ', account)
        try {
            const { data } = await axios.post(process.env.NEXTAUTH_BACKEND_URL + 'auth/google/', {
                access_token: account['id_token'],
                id_token: account['id_token'],
            },
            )
            // const response = await axios({
            //     method: "post",
            //     url: process.env.NEXTAUTH_BACKEND_URL + "auth/google/",
            //     data: {
            //         acces: account["id_token"]
            //     },
            // });
            // console.log(response.data)
            account["meta"] = data;
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
};
const SIGN_IN_PROVIDERS = Object.keys(SIGN_IN_HANDLERS);

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: {
        strategy: "jwt",
        maxAge: BACKEND_REFRESH_TOKEN_LIFETIME,
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            // The data returned from this function is passed forward as the
            // `user` variable to the signIn() and jwt() callback
            async authorize(credentials, req) {
                try {
                    const response = await axios({
                        url: process.env.NEXTAUTH_BACKEND_URL + "auth/login/",
                        method: "post",
                        data: credentials,
                    });
                    const data = response.data;
                    // console.log('Auth data: ', data)
                    if (data) return data;
                } catch (error) {
                    console.error(error);
                }
                return null;
            },
        }),
        Google,
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            if (!SIGN_IN_PROVIDERS.includes((account as any).provider)) return false;
            return SIGN_IN_HANDLERS[(account as any).provider](
                user, account, profile, email, credentials
            );
        },
        async jwt({ user, token, account }: { user: any, token: any, account: any }) {
            // If `user` and `account` are set that means it is a login event
            if (user && account) {
                let backendResponse = account.provider === "credentials" ? user : account.meta;
                // console.log("Backemd response: ", backendResponse)
                token["user"] = (backendResponse as any).user;
                token["access_token"] = (backendResponse as any).access;
                token["refresh_token"] = (backendResponse as any).refresh;
                token["ref"] = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
                const { data: profile } = await axios.get(`${process.env.NEXTAUTH_BACKEND_URL}auth/profile/`, {
                    headers: {
                        Authorization: `Bearer ${token['access_token']}`
                    }
                })
                token['user']['profile'] = profile
                // console.log("Profile data: ", token.bio, token.picture)
                return token;
            }
            // Refresh the backend token if necessary
            if (getCurrentEpochTime() > token["ref"]) {
                const response = await axios.post(process.env.NEXTAUTH_BACKEND_URL + "auth/token/refresh/", {
                    refresh: token["refresh_token"],
                },
                    {
                        headers: {
                            Authorization: `Bearer ${token['access_token']}`
                        }
                    })
                // const response = await axios({
                //     method: "post",
                //     url: ,
                //     data: {
                //         refresh: token["refresh_token"],
                //     },
                //     headers:{
                //         Authorization: `Bearer ${token['access_token']}`
                //     }
                // });
                token["access_token"] = response.data.access;
                token["refresh_token"] = response.data.refresh;
                token["ref"] = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
            }
            return token;
        },
        // Since we're using Django as the backend we have to pass the JWT
        // token to the client instead of the `session`.
        async session({ token }: { token: any }) {
            return token;
        },
    }
})