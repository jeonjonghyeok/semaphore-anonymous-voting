import express from "express";
// import { connect } from "http2";
import { init, getWitness, register, verifyVote } from '../semaphore'
import { VotingCampaign, VotingInputs } from '../types'
import Router from './router';

const router = express.Router();

// init semaphore
init();

// init voting
const votingCampaigns: VotingCampaign[] = [];
const campaign1: VotingCampaign = {
    name: 'campaign1',
    options: ['yes', 'no'],
    stats: {
        'yes': 0,
        'no': 0
    }
}
votingCampaigns.push(campaign1);

router.get("/", Router.home);
router.get("/witness/:index", Router.witness);
router.post("/register", Router.register);
router.get("/isValid/:identity", Router.isValid);
router.post("/vote", Router.vote);
router.get("/campaigns", Router.getCampains);
router.get("/campaign/:name", Router.getCampain);
router.post("/registVote", Router.registVote);

export default router;