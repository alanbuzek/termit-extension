import Constants from "./Constants";
import User, { EMPTY_USER } from "../model/User";
import BrowserApi from "../../shared/BrowserApi";

export default class SecurityUtils {
  public static saveToken(jwt: string) {
    return BrowserApi.storage.set(Constants.STORAGE_JWT_KEY, jwt);
  }

  public static loadToken(): Promise<string> {
    return BrowserApi.storage.get(Constants.STORAGE_JWT_KEY, "");
  }

  public static clearToken(): void {
    return BrowserApi.storage.remove(Constants.STORAGE_JWT_KEY);
  }

  public static isLoggedIn(currentUser?: User): boolean {
    const currentUserChecked =
      currentUser || BrowserApi.storage.get(Constants.STORAGE.USER);
    return !!currentUserChecked && currentUserChecked !== EMPTY_USER;
  }
}
