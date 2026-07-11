// ======================================================
// Supabase Storage
// One workbook per authenticated user
// ======================================================

const TABLE_NAME = "lease_portfolios";

/**
 * Returns the authenticated user.
 */
async function getCurrentUser() {

    const {
        data: { user },
        error
    } = await window.supabaseClient.auth.getUser();

    if (error) {
        throw error;
    }

    if (!user) {
        throw new Error("No authenticated user.");
    }

    return user;
}


/**
 * Saves the workbook to Supabase.
 *
 * workbook example:
 *
 * {
 *     leases: [...]
 * }
 */
async function saveCloudState(workbook) {

    const user = await getCurrentUser();

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

        console.error("Failed to save workbook.", error);

        throw error;

    }

    console.log("Workbook saved successfully.");

    return data;

}


/**
 * Loads the user's workbook.
 *
 * Returns:
 *
 * {
 *     leases: [...]
 * }
 *
 * Returns null if no workbook exists.
 */
async function loadCloudState() {

    const user = await getCurrentUser();

    const { data, error } =
        await window.supabaseClient
            .from(TABLE_NAME)
            .select("portfolio_data")
            .eq("user_id", user.id)
            .maybeSingle();

    if (error) {

        console.error("Failed to load workbook.", error);

        throw error;

    }

    if (!data) {

        console.log("No workbook found.");

        return null;

    }

    console.log("Workbook loaded.");

    return data.portfolio_data;

}


/**
 * Deletes the user's workbook.
 */
async function deleteCloudState() {

    const user = await getCurrentUser();

    const { error } =
        await window.supabaseClient
            .from(TABLE_NAME)
            .delete()
            .eq("user_id", user.id);

    if (error) {

        console.error("Failed to delete workbook.", error);

        throw error;

    }

    console.log("Workbook deleted.");

}


/**
 * Returns true if the user has a workbook.
 */
async function cloudStateExists() {

    const user = await getCurrentUser();

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

}