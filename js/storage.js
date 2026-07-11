// ======================================================
// Storage Manager
// Orchestrates Cloud Storage and Local Storage
// ======================================================

const Storage = {

    /**
     * Loads the workbook.
     *
     * Priority:
     * 1. Cloud
     * 2. Local Storage
     */
    async load() {

        //
        // Try Cloud
        //
        try {

            if (await CloudStorage.isAvailable()) {

                const workbook =
                    await CloudStorage.load();

                if (workbook) {

                    console.log(
                        "Workbook loaded from Cloud."
                    );

                    return workbook;

                }

            }

        }
        catch (error) {

            console.warn(
                "Cloud load failed.",
                error
            );

        }

        //
        // Fallback to Local Storage
        //
        try {

            const workbook =
                LocalStorage.load();

            if (workbook) {

                console.log(
                    "Workbook loaded from Local Storage."
                );

                return workbook;

            }

        }
        catch (error) {

            console.warn(
                "Local Storage load failed.",
                error
            );

        }

        //
        // Nothing found
        //
        return {

            leases: []

        };

    },



    /**
     * Saves the workbook.
     *
     * Cloud failures should never
     * stop Local Storage.
     */
    async save(workbook) {

        let cloudSaved = false;

        let localSaved = false;

        //
        // Save to Cloud
        //
        try {

            if (await CloudStorage.isAvailable()) {

                await CloudStorage.save(workbook);

                cloudSaved = true;

            }

        }
        catch (error) {

            console.warn(
                "Cloud save failed.",
                error
            );

        }

        //
        // Save locally
        //
        try {

            LocalStorage.save(workbook);

            localSaved = true;

        }
        catch (error) {

            console.warn(
                "Local Storage save failed.",
                error
            );

        }

        return {

            success: cloudSaved || localSaved,

            cloudSaved,

            localSaved

        };

    },



    /**
     * Deletes the workbook.
     */
    async remove() {

        try {

            if (await CloudStorage.isAvailable()) {

                await CloudStorage.remove();

            }

        }
        catch (error) {

            console.warn(
                "Cloud delete failed.",
                error
            );

        }

        try {

            LocalStorage.remove();

        }
        catch (error) {

            console.warn(
                "Local Storage delete failed.",
                error
            );

        }

    }

};