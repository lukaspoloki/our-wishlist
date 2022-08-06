import createAuth0Client, {
  Auth0Client,
  Auth0ClientOptions,
  GetIdTokenClaimsOptions,
  GetTokenSilentlyOptions,
  GetTokenWithPopupOptions,
  IdToken,
  LogoutOptions,
  RedirectLoginOptions,
  User,
} from "@auth0/auth0-spa-js";
import { App, computed, reactive, watchEffect } from "vue";
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import authConfig from "./authConfig.json";

let client: Auth0Client;

export type auth0AppState = {
  targetUrl: string;
};

export type BccUser = User & {
  birthdate: Date;
};

export type auth0Callback = (appState: auth0AppState) => void;

export const getAuthClient = (): Auth0Client => client;

const state = reactive({
  loading: true,
  isAuthenticated: false,
  user: {} as BccUser | undefined,
  popupOpen: false,
  error: "",
});

async function loginWithPopup(): Promise<void> {
  state.popupOpen = true;

  try {
    await client.loginWithPopup();
  } catch (e) {
    console.error(e);
  } finally {
    state.popupOpen = false;
  }

  state.user = await client.getUser();
  state.isAuthenticated = true;
}

async function handleRedirectCallback(): Promise<void> {
  state.loading = true;

  try {
    await client.handleRedirectCallback();
    state.user = await client.getUser();
    state.isAuthenticated = true;
  } catch (e) {
    state.error = JSON.stringify(e);
  } finally {
    state.loading = false;
  }
}

function loginWithRedirect(o: RedirectLoginOptions): Promise<void> {
  return client.loginWithRedirect(o);
}

function getIdTokenClaims(o: GetIdTokenClaimsOptions): Promise<IdToken | undefined> {
  return client.getIdTokenClaims(o);
}

function getTokenSilently(o: GetTokenSilentlyOptions): Promise<string> {
  return client.getTokenSilently(o);
}

function getTokenWithPopup(o: GetTokenWithPopupOptions): Promise<string> {
  return client.getTokenWithPopup(o);
}

async function getTokenIgnoreCache(): Promise<string> {
  return await client.getTokenWithPopup({
    ignoreCache: true,
    scope: `${authConfig.scope}`,
    audience: authConfig.audience,
    useRefreshTokens: true,
  });
}

async function getTokenWithMfa(): Promise<string> {
  return await client.getTokenWithPopup({
    ignoreCache: true,
    scope: `${authConfig.scope} mfa`,
    audience: authConfig.audience,
    useRefreshTokens: true,
  });
}

function logout(o: LogoutOptions): void | Promise<void> {
  return client.logout(o);
}

export const authPlugin = {
  isAuthenticated: computed(() => state.isAuthenticated),
  loading: computed(() => state.loading),
  user: computed(() => state.user),
  getIdTokenClaims,
  getTokenSilently,
  getTokenWithPopup,
  getTokenWithMfa,
  getTokenIgnoreCache,
  handleRedirectCallback,
  loginWithRedirect,
  loginWithPopup,
  logout,
};

export const routeGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): NavigationGuardNext | void => {
  const { isAuthenticated, loading, loginWithRedirect } = authPlugin;
  const verify = () => {
    if (isAuthenticated.value && state.user) {
      const userChurchId = state.user["https://login.bcc.no/claims/churchId"];

      if (userChurchId === null || userChurchId === undefined || userChurchId === "" || userChurchId === 0) {
        console.error("No churchId found");
        loginWithRedirect({ appState: { targetUrl: "/" } });
      }
      if (!authConfig.possibleChurchesIds.includes(userChurchId)) {
        return next("errorChurch");
      }
      const userAge = getUserAge(state.user.birthdate);
      if (userAge < 18) {
        return next("errorAge");
      } else {
        return next();
      }
    } else {
      loginWithRedirect({ appState: { targetUrl: to.fullPath } });
    }
  };

  if (!loading.value) {
    return verify();
  }

  watchEffect(() => {
    if (loading.value === false) {
      return verify();
    }
  });
};

export const setupAuth = async (
  options: Auth0ClientOptions,
  callbackRedirect: auth0Callback
): Promise<{
  install: (app: App) => void;
}> => {
  client = await createAuth0Client({
    ...options,
  });

  try {
    if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
      const appState: auth0AppState = await (await client.handleRedirectCallback()).appState;
      callbackRedirect(appState);
    }
  } catch (e) {
    state.error = JSON.stringify(e);
  } finally {
    state.isAuthenticated = await client.isAuthenticated();
    state.user = await client.getUser();
    state.loading = false;
  }

  return {
    install: (app: App) => {
      app.config.globalProperties.$auth = authPlugin;
      if (state.user && app.config.globalProperties.$gtag) {
        app.config.globalProperties.$gtag.set("user_properties", {
          churchName: state.user["https://login.bcc.no/claims/churchName"],
          appType: "BudgetApp Client",
        });
      }
    },
  };
};

function getUserAge(birthdate: Date): number {
  try {
    if (birthdate) {
      const userBirthdate = Date.parse(birthdate.toString());
      const difference = Date.now() - userBirthdate;
      const ageDateTime = new Date(difference);

      return Math.abs(ageDateTime.getUTCFullYear() - 1970);
    }
    return 0;
  } catch (e) {
    console.error("Birthday date parsing exception: " + e);
    return 0;
  }
}
