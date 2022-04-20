import Constants from "./Constants";
import User, { EMPTY_USER } from "../model/User";
import BrowserStorage from "./BrowserStorage";
import VocabularyUtils from "./VocabularyUtils";
import Utils from "./Utils";

export default class SecurityUtils {
  public static saveToken(jwt: string): void {
    // BrowserStorage.set(Constants.STORAGE_JWT_KEY, jwt);
  }

  public static loadToken(): string {
    // return BrowserStorage.get(Constants.STORAGE_JWT_KEY, "")!;
    // TODO
    return 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXJtaXQtYWRtaW5Aa2Jzcy5mZWxrLmN2dXQuY3oiLCJqdGkiOiJodHRwOi8vb250by5mZWwuY3Z1dC5jei9vbnRvbG9naWVzL2FwcGxpY2F0aW9uL3Rlcm1pdC9zeXN0ZW0tYWRtaW4tdXNlciIsImlhdCI6MTY1MDQ0ODAxNywiZXhwIjoxNjUwNTM0NDE3LCJyb2xlIjoiUk9MRV9GVUxMX1VTRVItUk9MRV9BRE1JTi1ST0xFX1JFU1RSSUNURURfVVNFUiJ9.zZt_AAx9-T5G7VYm_kYegGMYv0bku99-JO8cv12ILFs';
  }

  public static clearToken(): void {
    // BrowserStorage.remove(Constants.STORAGE_JWT_KEY);
  }

  public static isLoggedIn(currentUser?: User | null): boolean {
    return !!currentUser && currentUser !== EMPTY_USER;
  }

  public static isEditor(currentUser?: User | null): boolean {
    return (
      SecurityUtils.isLoggedIn(currentUser) &&
      Utils.sanitizeArray(currentUser!.types).indexOf(
        VocabularyUtils.USER_RESTRICTED
      ) === -1
    );
  }
}
