import { store } from "../store/store";
import { format, addHours } from "date-fns";

export function escapeRegExp(str: string): string {
  return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
}

/*
	JavaScript replace() function is able to replace only the first occurence of found string. 
	This function allows to replace all occurences in original string.
*/
export function replaceAll(originalString: string, find: string, replace: string): string {
  return originalString.replace(new RegExp(escapeRegExp(find), "g"), replace);
}

// more info about parameters for Intl.NumberFormat can be found here:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
export function internationalFormatNumber(
  value: number,
  parameters?: Intl.NumberFormatOptions,
  locale = "en-GB"
): string {
  if (!parameters) {
    parameters = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
  }

  return new Intl.NumberFormat(locale, parameters).format(value);
}

export function displayAmount(amount: number, currency?: string): string {
  let currentTenantCurrency = "";
  if (store.state.currentTenant.customSettings != undefined) {
    currentTenantCurrency = store.state.currentTenant.customSettings.currency;
  }
  const formattedAmount = internationalFormatNumber(amount, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).replaceAll(",", " ");
  if (currency) {
    return `${formattedAmount} ${currency}`;
  } else if (currentTenantCurrency) {
    return `${formattedAmount} ${currentTenantCurrency}`;
  } else {
    return formattedAmount;
  }
}

export function calculateDate(date: string): string {
  // Workaround for issue with overriding server dates client browser TZ
  // 1) remove offset from DateTimeOffset string
  // 2) Add that offset to slicedDate with date-fns
  const offset = date.slice(-6);
  const dateSliced = date.slice(0, -6);
  const addHoursDate = addHours(new Date(dateSliced), Number(offset.substring(0, 3)));
  return format(new Date(addHoursDate), "MM/dd/yyyy HH:mm");
}
