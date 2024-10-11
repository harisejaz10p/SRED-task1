import { model, Schema } from "mongoose";
import { GitHubUserCollectionName } from "../constants/constants";

/**
 * Github User Interface
 */
export interface IGithubUser extends Document {
    readonly username: string;
    readonly id: string;
    readonly email: string;
    readonly avatarUrl: string;
    readonly accessToken: string;
    readonly createdAt: Date;
}

const UserSchema = new Schema<IGithubUser>({
    username: { type: String, required: true, unique: true },
    id: { type: String, required: true },
    email: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    accessToken: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

/**
 * Github User Model
 */
export const GithubUserSchema = model<IGithubUser>('GithubUser', UserSchema, GitHubUserCollectionName);
