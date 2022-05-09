enum ExtensionMessage {
  // extension -> extension messages
  LoginEvent,
  LogoutEvent,
  ConfigurationLoadedEvent,
  // termit-ui -> extension messages
  RunPageTextAnalysis,
  SaveAnnotaionResult,
  OpenToolbar,
  SetWaitingForAuth,
}

export default ExtensionMessage;
