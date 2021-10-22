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

    const witness = await getWitness(leafIndexUser1)
    console.log("witness=",witness)

    // 유저가 존재하는지 확인
    const isUser = await isValid(identityCommitmentUser1);
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

    // 투표 생성하기
    const options = ['cat','dog']
    const stats = {
        'cat': 0,
        'dog': 0
    }
    await registVote('animals', options, stats);
    console.log("create vote successfully!\n");

    // 투표하기
    try {
        await vote(identityUser1, leafIndexUser1, 'campaign1', 'no');
    } catch(e: any) {
        console.log(e.message)
    }
    // console.log("User 2 voted successfully!\n");
    // await vote(identityUser1, leafIndexUser1, 'campaign1', 'no');
    // console.log("-----------------------------------------------")
    // await vote(identityUser1, leafIndexUser1, 'animals', 'cat');



    // const identityUser2: Identity = FastSemaphore.genIdentity();
    // const identityCommitmentUser2: BigInt = FastSemaphore.genIdentityCommitment(identityUser2);

    // // Register  user 2 to the voting app
    // const leafIndexUser2 = await register(identityCommitmentUser2);
    // console.log("User 2 registered successfully!\n");

    // // Vote
    // await vote(identityUser2, leafIndexUser2, 'campaign1', 'no');

    // console.log("User 2 voted successfully!\n");

    // // Get campaign results
    const campaigns = await getCampaigns();
    console.log("Voting stats:");

    console.log(campaigns);



};

simulateVotingMultipleUsers();