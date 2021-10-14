import { Schema, model, connect, Decimal128 } from 'mongoose';

type UserNullifier = BigInt | string;

interface VotingCampaign {
    name: string;
    options: string[];
    stats: object;
}

interface VotingInputs {
    proof: string;
    nullifier: UserNullifier;
    vote: string;
    campaignName: string;
}
interface Tree {
    leaves: Decimal128[],
    zeros: Decimal128[],
    filledSubtrees: Decimal128[][],
    leavesPerNode: number,
    depth: number,
    nextIndex: number,
    zeroValue: string,
    root: Decimal128,
    filledPaths: object,
}

const schema = new Schema<Tree>({
    leaves: [String],
    zeros: [String],
    filledSubtrees: [[String]],
    leavesPerNode: Number,
    depth: Number,
    nextIndex: Number,
    zeroValue: String,
    root: String,
    filledPaths: Object
});


export {
    UserNullifier,
    VotingCampaign,
    VotingInputs,
    Tree,
    schema
}