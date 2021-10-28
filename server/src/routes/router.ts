import express from "express";
import { FastSemaphore } from "semaphore-lib";
// import { connect } from "http2";
import { isValid, init, getWitness, register, verifyVote } from '../semaphore'
import { VotingCampaign, VotingInputs } from '../types'

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

const Router = {
    home(req, res) {
        res.send("Welcome to Anon voting campaigns v1!");
    },
    item(req,res, next) {
        try {
            const voteCampaign = votingCampaigns.find(campaign => campaign.name === req.body.campaignName);

            if (!voteCampaign) throw new Error("Invalid voting campaign");
            voteCampaign.stats[req.body.item] = 0;

            res.json({ 'voteCampaign': voteCampaign });
        } catch (e: any) {
            if (e.message === 'User already registered') {
                res.status(400)
            } else {
                res.status(500)
            }
            res.json({'error': e.message})
        }
    },
    isValid(req, res ) {
        try {
            const identityCommitment = BigInt(req.params.identity)
            res.json(isValid(identityCommitment));
        } catch (e: any) {
            res.status(500).json({'error':e.message})
        }
    },
    witness(req, res) {
        try {
            const index = parseInt(req.params.index, 10);

            const witness = getWitness(index);
            // serialize witness (BigInts)
            const result = {
                ...witness,
                root: witness.root.toString(),
                leaf: witness.root.toString(),
                pathElements: witness.pathElements.map(pathElement => pathElement.map(bigInt => bigInt.toString()))
            }
            res.json(result);
        } catch (e: any) {
            res.status(500).json({'error': e.message})
        }
    },
    register(req,res, next) {
        try {
            const identityCommitment = BigInt(req.body.identity);
            const index = register(identityCommitment);
            res.json({ 'index': index });
        } catch (e: any) {
            if (e.message === 'User already registered') {
                res.status(400)
            } else {
                res.status(500)
            }
            res.json({'error': e.message})
        }
    },
    async vote(req,res,next) {
        try {
            const votingInputs: VotingInputs = req.body;
            const voteCampaign = votingCampaigns.find(campaign => campaign.name === votingInputs.campaignName);

            if (!voteCampaign) throw new Error("Invalid voting campaign");
            if (!voteCampaign.options.includes(votingInputs.vote)) throw new Error("Invalid vote");

            if (typeof votingInputs.nullifier === 'string') {
                votingInputs.nullifier = BigInt(votingInputs.nullifier);
            }

            await verifyVote(votingInputs);

            voteCampaign.stats[votingInputs.vote] += 1;
            res.json({ 'success': true });

        } catch (e: any) {
            if (['Invalid voting campaign', 'Invalid vote','Invalid vote proof','Double vote'].includes(e.message)) {
                res.status(400);
            } else {
                res.status(500);
            }
            res.json({ 'error': e.message });
        }
    },
    getCampains(req,res) {
        res.json(votingCampaigns);
    },
    getCampain(req,res) {
        try {
            const name = req.params.name;

            const votingCampaign = votingCampaigns.find(campaign => campaign.name === name);
            if (!votingCampaigns) throw new Error("Invalid voting campaign name");

            res.json(votingCampaign);

        } catch (e: any) {
            if (e.message === "Invalid voting campaign name") {
                res.status(400);
            } else {
                res.status(500);
            }
            res.json({ 'error': e.message });
        }
    },
    registVote(req,res,next) {
        try {
            const campaign: VotingCampaign = {
                name: req.body.voteName,
                // options: ['yes', 'no'],
                options: req.body.voteOptions,
                // stats: {
                //     'yes': 0,
                //     'no': 0
                // }
                stats: req.body.voteStats,
            }
            votingCampaigns.push(campaign);
            console.log(votingCampaigns);
            res.json({ 'success': true });

        } catch (e: any) {
            if (e.message === 'Invalid voting campaign name') {
                res.status(400)
            } else {
                res.status(500)
            }
            res.json({'error': e.message})
        }
    }
}

export default Router;