import express from "express";
// import { connect } from "http2";
import { init, getWitness, register, verifyVote } from '../semaphore'
import Router from './router';

const router = express.Router();

// init semaphore
init();

router.get("/", Router.home);
router.get("/witness/:index", Router.witness);
router.post("/register", Router.register);
router.post("/vote", Router.vote);
router.get("/campaigns", Router.getCampains);
router.get("/campaign/:name", Router.getCampain);

// new api
router.get("/isValid/:identity", Router.isValid);
router.post("/registVote", Router.registVote);
router.post("/item",Router.item);
router.post("/login",Router.login);

export default router;