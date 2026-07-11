// ======================================================
// Local Storage
// Handles browser localStorage operations
// ======================================================

const STORAGE_KEY = "lease-portfolio-v1";

const LocalStorage = {

    /**
     * Loads the workbook from browser storage.
     *
     * Returns:
     * {
     *     leases: [...]
     * }
     *
     * Returns null if nothing exists.
     */
    load() {

        try {

            const raw = localStorage.getItem(STORAGE_KEY);

            if (!raw) {

                return null;

            }

            return JSON.parse(raw);

        }
        catch (error) {

            console.error(
                "Failed to load Local Storage.",
                error
            );

            return null;

        }

    },



    /**
     * Saves the workbook to browser storage.
     */
    save(workbook) {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(workbook)
            );

            return true;

        }
        catch (error) {

            console.error(
                "Failed to save Local Storage.",
                error
            );

            return false;

        }

    },



    /**
     * Removes the workbook.
     */
    remove() {

        try {

            localStorage.removeItem(STORAGE_KEY);

            return true;

        }
        catch (error) {

            console.error(
                "Failed to remove Local Storage.",
                error
            );

            return false;

        }

    },



    /**
     * Returns true if a workbook exists.
     */
    exists() {

        return localStorage.getItem(STORAGE_KEY) !== null;

    }

};