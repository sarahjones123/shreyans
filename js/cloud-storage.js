// ======================================================
// Cloud Storage
// Handles all Supabase database operations
// ======================================================

const TABLE_NAME = "lease_portfolios";

const CloudStorage = {

    /**
     * Returns the currently authenticated user.
     */
    async getCurrentUser() {

        const {
            data: { user },
            error
        } = await window.supabaseClient.auth.getUser();

        if (error) {
            throw error;
        }

        if (!user) {
            throw new Error("User is not authenticated.");
        }

        return user;

    },

    /**
     * Loads the user's workbook from Supabase.
     *
     * Returns:
     * {
     *     leases: [...]
     * }
     *
     * Returns null if nothing exists.
     */
    async load() {

        const user = await this.getCurrentUser();

        const { data, error } =
            await window.supabaseClient
                .from(TABLE_NAME)
                .select("portfolio_data")
                .eq("user_id", user.id)
                .maybeSingle();

        if (error) {

            console.error("Cloud load failed.", error);

            throw error;

        }

        if (!data) {

            return null;

        }

        return data.portfolio_data;

    },

    /**
     * Saves the workbook to Supabase.
     *
     * @param {Object} workbook
     */
    async save(workbook) {

        const user = await this.getCurrentUser();

        const payload = {

            user_id: user.id,

            portfolio_name: "Lease Portfolio",

            portfolio_data: workbook,

            updated_at: new Date().toISOString()

        };

        const { data, error } =
            await window.supabaseClient
                .from(TABLE_NAME)
                .upsert(
                    payload,
                    {
                        onConflict: "user_id"
                    }
                )
                .select()
                .single();

        if (error) {

            console.error("Cloud save failed.", error);

            throw error;

        }

        return data;

    },

    /**
     * Deletes the user's workbook.
     */
    async remove() {

        const user = await this.getCurrentUser();

        const { error } =
            await window.supabaseClient
                .from(TABLE_NAME)
                .delete()
                .eq("user_id", user.id);

        if (error) {

            console.error("Cloud delete failed.", error);

            throw error;

        }

    },

    /**
     * Returns true if a workbook exists.
     */
    async exists() {

        const user = await this.getCurrentUser();

        const { count, error } =
            await window.supabaseClient
                .from(TABLE_NAME)
                .select("*", {
                    head: true,
                    count: "exact"
                })
                .eq("user_id", user.id);

        if (error) {

            throw error;

        }

        return count > 0;

    },

    /**
 * Checks whether the cloud service is reachable.
 */
async isAvailable() {

    try {

        await window.supabaseClient.auth.getSession();

        return true;

    } catch (error) {

        console.warn("Supabase unavailable.", error);

        return false;

    }

}

};

console.log("CloudStorage loaded");
console.log(CloudStorage);