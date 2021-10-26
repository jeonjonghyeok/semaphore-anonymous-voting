// import { Schema, model, connect, Decimal128, SchemaTypes } from 'mongoose';

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
// interface Tree {
//     leavesPerNode: number,
//     depth: number,
//     zeroValue: number,
//     root: BigInt,
//     nextIndex: number,
//     leaves: BigInt[],
//     zeros: BigInt[],
//     value: BigInt,
//     filledSubtrees: BigInt[][],
//     filledPaths: any,
//     hashFunc: (leaves: BigInt[]) => BigInt
// }

// const schema = new Schema<Tree>({
//     leavesPerNode: Number,
//     depth: Number,
//     zeroValue: Number,
//     root: String,
//     nextIndex: Number,
//     leaves: [String],
//     zeros: [String],
//     value: String,
//     filledSubtrees: [[String]],
//     filledPaths: Object,
//     // hashFunc: { "type": "Function" }
// });


export {
    UserNullifier,
    VotingCampaign,
    VotingInputs,
    // Tree,
    // schema
}