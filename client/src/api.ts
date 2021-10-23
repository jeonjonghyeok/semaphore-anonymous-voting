import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';
import {
    FastSemaphore,
    IProof, Identity
} from "semaphore-lib";

const PROVER_KEY_PATH: string = path.join('./circuitFiles', 'semaphore_final.zkey');
const CIRCUIT_PATH: string = path.join('./circuitFiles', 'semaphore.wasm');

const API_BASE_URL = 'http://localhost:8080'


FastSemaphore.setHasher('poseidon');



const isValid = async (identityCommitment: BigInt) => {
    const result = await axios.get(`${API_BASE_URL}/isValid/${identityCommitment}`);
    return result.data;
};

const register = async (identityCommitment: BigInt) => {
    const result = await axios.post(`${API_BASE_URL}/register`, {'identity': identityCommitment.toString()})
    return result.data.index;
};

// 투표할 수 있는 캠페인 리스트 불러오기
const getCampaigns = async (): Promise<object> => {
    const result = await axios.get(`${API_BASE_URL}/campaigns`);
    return result.data;
};

// External Nullifier: 캠페인 명
// Nullifier: 투표한 사람
// 캠페인 명을 다른 값으로 대체하면 될 것 같습니다.
const vote = async (identity: Identity, leafIndex: number, campaignName: string, voteOption: string) => {
    console.log("vote call");
    const witness = await getWitness(leafIndex);
    const externalNullifier = FastSemaphore.genExternalNullifier(campaignName);
    const fullProof = await FastSemaphore.genProofFromBuiltTree(identity, witness, externalNullifier , voteOption, CIRCUIT_PATH, PROVER_KEY_PATH);
    const nullifierHash: BigInt = FastSemaphore.genNullifierHash(externalNullifier, identity.identityNullifier, 20);

    const voteParameters = {
        proof: fullProof.proof,
        nullifier: nullifierHash.toString(),
        vote: voteOption,
        campaignName
    }
    console.log("voteParameters=",voteParameters);

    await axios.post(`${API_BASE_URL}/vote`, voteParameters)
};
const registVote = async (voteName: string, voteOptions: string[], voteStats: object) => {
    console.log("registVote call")
    const registVoteParameters = {
        voteName,
        voteOptions,
        voteStats
    }
    console.log("registVoteParams=",registVoteParameters);

    await axios.post(`${API_BASE_URL}/registVote`, registVoteParameters);
};

// 머클트리의 index를 가지고 경로값을 불러옴.
const getWitness = async (leafIndex: number): Promise<object> => {
    const result = await axios.get(`${API_BASE_URL}/witness/${leafIndex}`);

    const witness = result.data;
    // deserialize witness
    const pathElements: [[]] = witness.pathElements;
    witness.pathElements = pathElements.map(pathElement => pathElement.map(num => BigInt(num)));
    witness.leaf = witness.leaf.toString();
    witness.root = witness.root.toString();
    return witness;
}

export {
    register,
    getCampaigns,
    vote,
    getWitness,
    isValid,
    registVote
}

