// TODO: decide if to use this at all or not
 
  /**
   * Extract the protocol and hostname (ie. host without port) from the URL.
   *
   * We don't use the URL constructor here because IE and early versions of Edge
   * do not support it and this code runs early in the life of the app before any
   * polyfills can be loaded.
   */
   function extractOrigin(url) {
    const match = url.match(/(https?):\/\/([^:/]+)/);
    if (!match) {
      return null;
    }
    return { protocol: match[1], hostname: match[2] };
  }
  
  /**
   * Return a parsed `js-hypothesis-config` object from the document, or `{}`.
   *
   * Find all `<script class="js-hypothesis-config">` tags in the given document,
   * parse them as JSON, and return the parsed object.
   *
   * If there are no `js-hypothesis-config` tags in the document then return
   * `{}`.
   *
   * If there are multiple `js-hypothesis-config` tags in the document then merge
   * them into a single returned object (when multiple scripts contain the same
   * setting names, scripts further down in the document override those further
   * up).
   *
   * @param {Document|Element} document - The root element to search.
   */
  export function parseJsonConfig(document) {
    const config = {};
    const settingsElements = document.querySelectorAll(
      "script.js-hypothesis-config"
    );
  
    for (let i = 0; i < settingsElements.length; i++) {
      let settings;
      try {
        settings = JSON.parse(settingsElements[i].textContent || "");
      } catch (err) {
        console.warn(
          "Could not parse settings from js-hypothesis-config tags",
          err
        );
        settings = {};
      }
      Object.assign(config, settings);
    }
  
    return config;
  }
  

  /**
 * List of allowed configuration keys per application context. Keys omitted
 * in a given context will be removed from the relative configs when calling
 * getConfig.
 *
 * @param {AppContext} [appContext] - The name of the app.
 */
 function configurationKeys(appContext) {
    const contexts = {
      annotator: ["clientUrl", "subFrameIdentifier"],
      sidebar: [
        "appType",
        "annotations",
        "branding",
        "enableExperimentalNewNoteButton",
        "externalContainerSelector",
        "focus",
        "group",
        "onLayoutChange",
        "openSidebar",
        "query",
        "requestConfigFromFrame",
        "services",
        "showHighlights",
        "sidebarAppUrl",
        "theme",
        "usernameUrl",
      ],
      notebook: [
        "branding",
        "group",
        "notebookAppUrl",
        "requestConfigFromFrame",
        "services",
        "theme",
        "usernameUrl",
      ],
    };
  
    switch (appContext) {
      case "annotator":
        return contexts.annotator;
      case "sidebar":
        return contexts.sidebar;
      case "notebook":
        return contexts.notebook;
      case "all":
        // Complete list of configuration keys used for testing.
        return [...contexts.annotator, ...contexts.sidebar, ...contexts.notebook];
      default:
        throw new Error(`Invalid application context used: "${appContext}"`);
    }
  }
  
  /** @type {ValueGetter} */
  function getHostPageSetting(settings, name) {
    return settings.hostPageSetting(name);
  }
  
  /**
   * Definitions of configuration keys
   * @type {ConfigDefinitionMap}
   */
  const configDefinitions = {
    annotations: {
      allowInBrowserExt: true,
      defaultValue: null,
      getValue: (settings) => settings.annotations,
    },
    appType: {
      allowInBrowserExt: true,
      defaultValue: null,
      getValue: getHostPageSetting,
    },
    branding: {
      defaultValue: null,
      allowInBrowserExt: false,
      getValue: getHostPageSetting,
    },
    // URL of the client's boot script. Used when injecting the client into
    // child iframes.
    clientUrl: {
      allowInBrowserExt: true,
      defaultValue: null,
      getValue: (settings) => settings.clientUrl,
    },
    enableExperimentalNewNoteButton: {
      allowInBrowserExt: false,
      defaultValue: null,
      getValue: getHostPageSetting,
    },
    group: {
      allowInBrowserExt: true,
      defaultValue: null,
      getValue: (settings) => settings.group,
    },
    focus: {
      allowInBrowserExt: false,
      defaultValue: null,
      getValue: getHostPageSetting,
    },
    theme: {
      allowInBrowserExt: false,
      defaultValue: null,
      getValue: getHostPageSetting,
    },
    usernameUrl: {
      allowInBrowserExt: false,
      defaultValue: null,
      getValue: getHostPageSetting,
    },
    onLayoutChange: {
      allowInBrowserExt: false,
      defaultValue: null,
      getValue: getHostPageSetting,
    },
    openSidebar: {
      allowInBrowserExt: true,
      defaultValue: false,
      coerce: () => false,
      getValue: getHostPageSetting,
    },
    query: {
      allowInBrowserExt: true,
      defaultValue: null,
      getValue: (settings) => settings.query,
    },
    requestConfigFromFrame: {
      allowInBrowserExt: false,
      defaultValue: null,
      getValue: getHostPageSetting,
    },
    services: {
      allowInBrowserExt: false,
      defaultValue: null,
      getValue: getHostPageSetting,
    },
    showHighlights: {
      allowInBrowserExt: false,
      defaultValue: "always",
      getValue: (settings) => settings.showHighlights,
    },
    notebookAppUrl: {
      allowInBrowserExt: true,
      defaultValue: null,
      getValue: (settings) => settings.notebookAppUrl,
    },
    sidebarAppUrl: {
      allowInBrowserExt: true,
      defaultValue: null,
      getValue: (settings) => settings.sidebarAppUrl,
    },
    // Sub-frame identifier given when a frame is being embedded into
    // by a top level client
    subFrameIdentifier: {
      allowInBrowserExt: true,
      defaultValue: null,
      getValue: getHostPageSetting,
    },
    externalContainerSelector: {
      allowInBrowserExt: false,
      defaultValue: null,
      getValue: getHostPageSetting,
    },
  };
  
  /**
   * Return the configuration for a given application context.
   *
   * @param {AppContext} [appContext] - The name of the app.
   */
  export function getConfig(appContext = "annotator", window_ = window) {
    // const settings = settingsFrom(window_);
    const settings = {};
    const config = {};
    // Filter the config based on the application context as some config values
    // may be inappropriate or erroneous for some applications.
    let filteredKeys = configurationKeys(appContext);
    filteredKeys.forEach((name) => {
      const configDef = configDefinitions[name];
      const hasDefault = configDef.defaultValue !== undefined; // A default could be null
  
      // Only allow certain values in the browser extension context
      if (!configDef.allowInBrowserExt) {
        // If the value is not allowed here, then set to the default if provided, otherwise ignore
        // the key:value pair
        if (hasDefault) {
          config[name] = configDef.defaultValue;
        }
        return;
      }
    });
  
    return config;
  }