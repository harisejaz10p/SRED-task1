import { model, Schema } from "mongoose";

/**
 * Github User Interface
 */
export interface IGithubUser extends Document {
    readonly username: string;
    readonly id: string;
    readonly email: string;
    readonly avatarUrl: string;
    readonly accessToken: string;
    readonly refreshToken: string;
    readonly createdAt: Date;
}

const UserSchema = new Schema<IGithubUser>({
    username: { type: String, required: true, unique: true },
    id: { type: String, required: true },
    email: { type: String, required: true },
    avatarUrl: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

/**
 * Github User Model
 */
export const GithubUserSchema = model<IGithubUser>('GithubUser', UserSchema, "github-integration");
