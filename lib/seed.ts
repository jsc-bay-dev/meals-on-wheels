import { ID } from "react-native-appwrite";
import { appwriteConfig, databases, storage } from "./appwrite";
import dummyData from "./data";

interface Category {
    name: string;
    description: string;
}

interface Customization {
    name: string;
    price: number;
    type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    category_name: string;
    customizations: string[]; // list of customization names
}

interface DummyData {
    categories: Category[];
    customizations: Customization[];
    menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
    const list = await databases.listDocuments(
        appwriteConfig.databaseId,
        collectionId
    );

    await Promise.all(
        list.documents.map((doc) =>
            databases.deleteDocument(appwriteConfig.databaseId, collectionId, doc.$id)
        )
    );
}

async function clearStorage(): Promise<void> {
    const list = await storage.listFiles(appwriteConfig.bucketId);

    await Promise.all(
        list.files.map((file) =>
            storage.deleteFile(appwriteConfig.bucketId, file.$id)
        )
    );
}

async function uploadImageToStorage(imageUrl: string) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const fileObj = {
        name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
        type: blob.type,
        size: blob.size,
        uri: imageUrl,
    };

    const file = await storage.createFile(
        appwriteConfig.bucketId,
        ID.unique(),
        fileObj
    );

    return storage.getFileViewURL(appwriteConfig.bucketId, file.$id);
}

async function seed(): Promise<void> {
    try {
        // 1. Clear all
        console.log('🧹 Clearing existing data...');
        await clearAll(appwriteConfig.categoriesCollectionId);
        await clearAll(appwriteConfig.customizationsCollectionId);
        await clearAll(appwriteConfig.menuCollectionId);
        await clearAll(appwriteConfig.menuCustomizationsCollectionId);
        await clearStorage();

        // 2. Create Categories
        console.log('📁 Creating categories...');
        const categoryMap: Record<string, string> = {};
        for (const cat of data.categories) {
            try {
                console.log('Creating category:', cat);
                const doc = await databases.createDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.categoriesCollectionId,
                    ID.unique(),
                    cat
                );
                categoryMap[cat.name] = doc.$id;
                console.log('✅ Category created:', cat.name);
            } catch (error) {
                console.error('❌ Failed to create category:', cat, error);
                throw error;
            }
        }

        // 3. Create Customizations
        console.log('🔧 Creating customizations...');
        const customizationMap: Record<string, string> = {};
        for (const cus of data.customizations) {
            try {
                console.log('Creating customization:', cus);
                const doc = await databases.createDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.customizationsCollectionId,
                    ID.unique(),
                    {
                        name: cus.name,
                        price: cus.price,
                        type: cus.type,
                    }
                );
                customizationMap[cus.name] = doc.$id;
                console.log('✅ Customization created:', cus.name);
            } catch (error) {
                console.error('❌ Failed to create customization:', cus, error);
                throw error;
            }
        }

        // 4. Create Menu Items
        console.log('🍕 Creating menu items...');
        const menuMap: Record<string, string> = {};
        for (const item of data.menu) {
            try {
                console.log('Creating menu item:', item.name);
                const uploadedImage = await uploadImageToStorage(item.image_url);

                const menuData = {
                    name: item.name,
                    description: item.description,
                    image_url: uploadedImage,
                    price: item.price,
                    rating: item.rating,
                    calories: item.calories,
                    protein: item.protein,
                    categories: categoryMap[item.category_name],
                };
                
                console.log('Menu data to create:', menuData);
                const doc = await databases.createDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.menuCollectionId,
                    ID.unique(),
                    menuData
                );

                menuMap[item.name] = doc.$id;
                console.log('✅ Menu item created:', item.name);

                // 5. Create menu_customizations
                console.log('🔗 Creating menu customizations for:', item.name);
                for (const cusName of item.customizations) {
                    try {
                        const menuCustomData = {
                            menu: doc.$id,
                            customizations: customizationMap[cusName],
                        };
                        console.log('Menu customization data:', menuCustomData);
                        await databases.createDocument(
                            appwriteConfig.databaseId,
                            appwriteConfig.menuCustomizationsCollectionId,
                            ID.unique(),
                            menuCustomData
                        );
                        console.log('✅ Menu customization created:', cusName);
                    } catch (error) {
                        console.error('❌ Failed to create menu customization:', cusName, error);
                        throw error;
                    }
                }
            } catch (error) {
                console.error('❌ Failed to create menu item:', item.name, error);
                throw error;
            }
        }

        console.log("✅ Seeding complete.");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        throw error;
    }
}

export default seed;