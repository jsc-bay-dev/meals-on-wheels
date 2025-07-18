import { CreateUserParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    platform: "com.jsc.mealsonwheels",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
    userCollectionId: '6876ff5b0032570fd232',
    categoriesCollectionId: '6879ac6c001408e96189',
    menuCollectionId: '6879ad65002bf7f5ad79',
    customizationsCollectionId: '6879aee2001d91c490c6',
    menuCustomizationsCollectionId: '6879afd2000c83ea4daa'
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)


export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);

export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {
        console.log('Creating user with config:', {
            endpoint: appwriteConfig.endpoint,
            projectId: appwriteConfig.projectId,
            databaseId: appwriteConfig.databaseId,
            userCollectionId: appwriteConfig.userCollectionId
        });
        
        const newAccount = await account.create(ID.unique(), email, password, name)
        
        if (!newAccount) throw Error;


        const avatarUrl = avatars.getInitialsURL(name);
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                email, name: name, accountId: newAccount.$id, avatar: avatarUrl
            }

        )
        return newUser;
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error(error as string)
    }
}

export const SignIn = async ({ email, password }: SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
    } catch (error) {
        throw new Error(error as string)
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) return null;
        
        const currentUser = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.userCollectionId, [Query.equal('accountId', currentAccount.$id)]);
        
        if (!currentUser) return null;

        return currentUser.documents[0];
    } catch (error) {
        // If user is not authenticated (guest), return null instead of throwing
        console.log('getCurrentUser: No authenticated user found', error);
        return null;
    }
}