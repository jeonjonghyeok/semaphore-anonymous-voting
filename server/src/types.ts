import { Schema, model, connect, Decimal128, SchemaTypes } from 'mongoose';

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


// tree
type Leaf = BigInt

interface IncrementalQuinTree {
    leavesPerNode: number
    depth: number
    zeroValue: BigInt
    root: BigInt
    nextIndex: number
    leaves: Leaf[]
    zeros: BigInt[]
    filledSubtrees: BigInt[][]
    filledPaths: any
    hashFunc: (leaves: BigInt[]) => BigInt

}

const schema = new Schema<IncrementalQuinTree>({
    leavesPerNode: Number,
    depth: Number,
    zeroValue: BigInt,
    root: BigInt,
    nextIndex: Number,
    leaves: [BigInt],
    zeros: [BigInt],
    filledSubtrees: [[BigInt]],
    filledPaths: Object,
    // hashFunc: { "type": "Function" }
});


export {
    UserNullifier,
    VotingCampaign,
    VotingInputs,
    IncrementalQuinTree,
    // schema
}