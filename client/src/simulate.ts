// Single user vote

import {registVote,isValid, register, vote, getCampaigns, getWitness} from './api'
import {
    FastSemaphore,
    Identity
} from "semaphore-lib";


const simulateVotingMultipleUsers = async () => {

    const identityUser1: Identity = FastSemaphore.genIdentity();
    const identityCommitmentUser1: BigInt = FastSemaphore.genIdentityCommitment(identityUser1);

    // Register user 1 to the voting app
    const leafIndexUser1 = await register(identityCommitmentUser1);
    console.log("User 1 registered successfully!\n");

    // const witness = await getWitness(leafIndexUser1)
    // console.log(witness)

    // 유저가 존재하는지 확인
    console.log(identityCommitmentUser1);
    const isUser = await isValid(identityCommitmentUser1);
    console.log(identityCommitmentUser1);
    if (isUser) {
        console.log("유저 존재");
    } else {
        console.log("유저가 존재하지 않음.");
    }


    // Try to double register
    // try {
    //     await register(identityCommitmentUser1);
    // } catch (e) {
    //     console.log("Double registrations are not allowed!\n");
    // }

    // Vote user 1
    const options = ['cat','dog']
    const stats = {
        'cat': Number,
        'dog': Number
    }
    await registVote('like animals', options, stats);
    console.log("User 1 voted successfully!\n");

    // // Try to double vote
    // try {
    //     await vote(identityUser1, leafIndexUser1, 'campaign1', 'no');
    // } catch (e) {
    //     console.log("Double voting is not allowed!\n");
    // }


    // const identityUser2: Identity = FastSemaphore.genIdentity();
    // const identityCommitmentUser2: BigInt = FastSemaphore.genIdentityCommitment(identityUser2);

    // // Register  user 2 to the voting app
    // const leafIndexUser2 = await register(identityCommitmentUser2);
    // console.log("User 2 registered successfully!\n");

    // // Vote
    // await vote(identityUser2, leafIndexUser2, 'campaign1', 'no');

    // console.log("User 2 voted successfully!\n");

    // // Get campaign results
    // const campaigns = await getCampaigns();
    // console.log("Voting stats:");

    // console.log(campaigns);



};

simulateVotingMultipleUsers();