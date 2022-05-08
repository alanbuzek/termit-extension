import Constants from "../../common/util/Constants";
import BrowserApi from "../../shared/BrowserApi";

export const cleanWholeStorage = () => {
  return BrowserApi.storage.clear();
};

export const cleanOnLogout = async () => {
  const termitInstance = await BrowserApi.storage.get(
    Constants.STORAGE.TERMIT_INSTANCE
  );

  BrowserApi.storage.clear();

  // preserve instance info
  if (termitInstance) {
    await BrowserApi.storage.set(
      Constants.STORAGE.TERMIT_INSTANCE,
      termitInstance
    );
  }
};
