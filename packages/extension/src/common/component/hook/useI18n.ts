import { useCallback } from "react";
import { FormatDateOptions, useIntl } from "react-intl";

interface HasI18n {
  i18n(id?: string): string;

  formatMessage(msgId: string, values: {} | undefined): string;

  formatDate(
    value: string | number | Date,
    options?: FormatDateOptions
  ): string;
  
  formatTime(
    value: string | number | Date,
    options?: FormatDateOptions
  ): string;

  locale: string;
}

/**
 * React Hook providing basic i18n functions.
 */
export function useI18n(): HasI18n {
  const intl = useIntl();
  const i18n = useCallback(
    (msgId: string) => (intl.messages[msgId] as string) || "{" + msgId + "}",
    [intl]
  );
  const formatMessage = useCallback(
    (msgId: string, values: {} | undefined = {}) =>
      intl.formatMessage({ id: msgId }, values),
    [intl]
  );
  return {
    i18n,
    formatMessage,
    formatDate: intl.formatDate,
    formatTime: intl.formatTime,
    locale: intl.locale,
  };
}
