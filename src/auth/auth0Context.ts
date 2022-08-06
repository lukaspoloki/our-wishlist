import { BccUser } from "./auth";
import {
  getIdTokenClaimsOptions,
  GetTokenSilentlyOptions,
  GetTokenWithPopupOptions,
  IdToken,
  LogoutOptions,
  PopupLoginOptions,
  RedirectLoginOptions,
  RedirectLoginResult,
} from "@auth0/auth0-spa-js";

export interface Auth0Context {
  isAuthenticated: boolean;
  user: BccUser;
  loading: boolean;
  popupOpen: boolean;
  loginWithPopup(options: PopupLoginOptions): Promise<void>;
  handleRedirectCallback(): Promise<RedirectLoginResult>;
  getIdTokenClaims(o?: getIdTokenClaimsOptions): Promise<IdToken>;
  loginWithRedirect(o: RedirectLoginOptions): Promise<void>;
  getTokenSilently(o?: GetTokenSilentlyOptions): Promise<string | undefined>;
  getTokenWithPopup(o?: GetTokenWithPopupOptions): Promise<string | undefined>;
  getTokenWithMfa(): Promise<string>;
  logout(o?: LogoutOptions): void;
}
