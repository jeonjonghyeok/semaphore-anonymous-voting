import * as path from 'path';
import * as fs from 'fs';

import {
    FastSemaphore,
    IProof
} from "semaphore-lib";
import {
    VotingInputs,
    UserNullifier,
    Tree,
    schema
} from "./types";
import { Schema, model, connect, Decimal128 } from 'mongoose';

// mongodb config
connect('mongodb://localhost:27017/test',{ useUnifiedTopology: true, useNewUrlParser: true });

const VERIFIER_KEY_PATH = path.join('./circuitFiles', 'verification_key.json');
const verifierKey = JSON.parse(fs.readFileSync(VERIFIER_KEY_PATH, 'utf-8'));

let tree: any = null;

// Array that keeps the nullifier of users that voted (to prevent double voting)
const votedUsers: UserNullifier[] = [];

const TreeModel = model<Tree>('Tree',schema);

const doc = new TreeModel();

const init = () => {
    FastSemaphore.setHasher("poseidon");
    // 싱글톤
    const depth = 20;
    const leavesPerNode = 5;
    const zeroValue = 0;
    tree = FastSemaphore.createTree(depth, zeroValue, leavesPerNode) as Tree;
    console.log("tree = ",tree);
    doc.depth = depth;
    doc.leavesPerNode = leavesPerNode;
    doc.zeroValue = zeroValue;
    doc.leaves = tree.leaves;
    doc.root = tree.root;
    doc.zeros= tree.zeros;
    doc.filledSubtrees = tree.filledSubtrees;
    doc.filledPaths = tree.filledPaths;

    doc.save();
}

const register = (identityCommitment: BigInt): number => {
    if(tree.leaves.includes(identityCommitment)) throw new Error("User already registered");
    // 머클트리에 아이디 추가
    tree.insert(identityCommitment);
    console.log(identityCommitment);
    doc.root = tree.root;
    doc.nextIndex = tree.nextIndex;
    doc.filledSubtrees = tree.filledSubtrees;
    doc.leaves = tree.leaves;
    doc.save();
    // 머클트리애 아이디가 저장된 인덱스 값 리턴
    return tree.nextIndex - 1;
}

const isValid = (identityCommitment: BigInt): boolean => {
    console.log(tree.leaves);
    if(tree.leaves.includes(identityCommitment)) return true;
    return false;
}

// 머클트리 경로 반환
const getWitness = (leafIndex: number) => {
    return tree.genMerklePath(leafIndex);
}

const verifyVote = async (votingInputs: VotingInputs): Promise<boolean> => {

    // nullifier = 캠페인 명 + identityNullifier
    // 사용자를 식별할 수 있음
    if(votedUsers.includes(votingInputs.nullifier)) throw new Error("Double vote");

    // 투표 + 캠페인명 + 머클루트 + nullifier 로 해당 투표에 대한 증명을 만듦
    const proof: IProof = {
        proof: votingInputs.proof,
        publicSignals: [tree.root, votingInputs.nullifier, FastSemaphore.genSignalHash(votingInputs.vote), FastSemaphore.genExternalNullifier(votingInputs.campaignName)]
    };
    console.log("verifierKey= ",verifierKey, "proof= ",proof)
    // 키 값과 증명으로 검증
    const status = await FastSemaphore.verifyProof(verifierKey, proof);

    if(!status) {
        throw new Error("Invalid vote proof");
    }
    // 올바른 증명이면 투표 성공
    // votedUsers에 nullifier를 추가시킴.
    votedUsers.push(votingInputs.nullifier);
    return true;

}


export {
    init,
    register,
    getWitness,
    verifyVote,
    isValid
}