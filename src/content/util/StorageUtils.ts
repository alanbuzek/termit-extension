import Constants from '../../termit-ui-common/util/Constants';
import BrowserApi from '../../shared/BrowserApi';

/**
 * Utility functions operating on Browser storage
 */
const StorageUtils = {
  clearWholeStorage() {
    return BrowserApi.storage.clear();
  },
  async clearStorageOnLogout() {
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
  },
};

export default StorageUtils;
