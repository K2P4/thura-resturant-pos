import { supabase } from "./supabase";

export async function getProducts() {
    const { data, error } = await supabase
        .from("products")
        .select("*, categories(*)")
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error("Products could not be loaded");
    }

    return data;
}

export async function createProduct(newProduct) {
    const { data, error } = await supabase
        .from("products")
        .insert([newProduct])
        .select();

    if (error) {
        throw new Error("Product could not be created");
    }

    return data;
}

export async function updateProduct({ id, ...updatedProduct }) {
    const { data, error } = await supabase
        .from("products")
        .update(updatedProduct)
        .eq("id", id)
        .select();

    if (error) {
        throw new Error("Product could not be updated");
    }

    return data;
}

export async function deleteProduct(id) {
    const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error("Product could not be deleted");
    }

    return data;
}
