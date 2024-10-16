import mongoose, { Schema, Document } from 'mongoose';

interface IRepo extends Document {
    readonly name: string;
    readonly id: number;
    readonly slug: string;
    readonly organization: string;
    readonly included: boolean;
    readonly userLogin: string;
    readonly html_url: string;
}

const RepoSchema = new Schema<IRepo>({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    organization: { type: String, required: true },
    included: { type: Boolean, default: false },
    userLogin: { type: String, required: true },
    html_url: { type: String, default: "" },
});

/**
 * Export the repo model.
 */
export const Repo = mongoose.model<IRepo>('Repo', RepoSchema);

/**
 * Interface for the repo model.
 */
export interface IRepoModel {
    readonly id: number;
    readonly name: string;
    readonly slug: string;
    readonly organization: string;
    readonly included: boolean;
    readonly userLogin: string;
    readonly html_url: string;
}