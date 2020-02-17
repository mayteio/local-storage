"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const local_storage_events_1 = require("./local-storage-events");
const react_1 = require("react");
function tryParse(value) {
    try {
        return JSON.parse(value);
    }
    catch (_a) {
        return value;
    }
}
/**
 * React hook to enable updates to state via localStorage.
 * This updates when the {writeStorage} function is used, when the returned function
 * is called, or when the "storage" event is fired from another tab in the browser.
 * This function takes an optional default value to start off with.
 *
 * @example
 * ```js
 * const MyComponent = () => {
 *   const [myStoredItem, setMyStoredItem] = useLocalStorage('myStoredItem');
 *   return (
 *     <p>{myStoredItem}</p>
 *   );
 * };
 * ```
 *
 * @export
 * @template TValue The type of the given initial value.
 * @param {string} key The key in the localStorage that you wish to watch.
 * @param {TValue} initialValue Optional initial value to start with.
 * @returns {[TValue | null, Dispatch<TValue>, Dispatch<void>]} An array containing the value
 * associated with the key in position 0, a function to set the value in position 1,
 * and a function to delete the value from localStorage in position 2.
 */
function useLocalStorage(key, initialValue) {
    const [localState, updateLocalState] = react_1.useState(tryParse(localStorage.getItem(key)) || initialValue);
    const onLocalStorageChange = react_1.useCallback((event) => {
        if (local_storage_events_1.isTypeOfLocalStorageChanged(event)) {
            if (event.detail.key === key) {
                updateLocalState(event.detail.value);
            }
        }
        else {
            if (event.key === key) {
                if (event.newValue) {
                    updateLocalState(tryParse(event.newValue));
                }
            }
        }
    }, [updateLocalState]);
    react_1.useEffect(() => {
        updateLocalState(tryParse(localStorage.getItem(key)) || initialValue);
    }, [key]);
    react_1.useEffect(() => {
        // The custom storage event allows us to update our component
        // when a change occurs in localStorage outside of our component
        window.addEventListener(local_storage_events_1.LocalStorageChanged.eventName, (e) => onLocalStorageChange(e));
        // The storage event only works in the context of other documents (eg. other browser tabs)
        window.addEventListener('storage', e => onLocalStorageChange(e));
        // We need to check if there is a stored value because we do not wish to overwrite it.
        const storedValue = localStorage.getItem(key);
        const canWrite = !(storedValue && tryParse(storedValue) !== storedValue);
        // Write initial value to the local storage if it's not present or contains invalid JSON data.
        if (initialValue !== undefined && canWrite) {
            local_storage_events_1.writeStorage(key, initialValue);
        }
        return () => {
            window.removeEventListener(local_storage_events_1.LocalStorageChanged.eventName, (e) => onLocalStorageChange(e));
            window.removeEventListener('storage', e => onLocalStorageChange(e));
        };
    }, [key]);
    const writeState = react_1.useCallback((value) => local_storage_events_1.writeStorage(key, value), [key]);
    const deleteState = react_1.useCallback(() => local_storage_events_1.deleteFromStorage(key), [key]);
    return [localState === null ? initialValue : localState, writeState, deleteState];
}
exports.useLocalStorage = useLocalStorage;
//# sourceMappingURL=use-localstorage.js.map