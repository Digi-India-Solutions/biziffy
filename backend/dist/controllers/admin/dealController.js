"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDeals = exports.createDeal = void 0;
const dealModel_1 = __importDefault(require("../../models/dealModel"));
const createDeal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deal = new dealModel_1.default(req.body);
        yield deal.save();
        res.status(201).json({ message: "Deal created", deal });
    }
    catch (error) {
        res.status(500).json({ error: "Error creating deal" });
    }
});
exports.createDeal = createDeal;
const getAllDeals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deals = yield dealModel_1.default.find();
        res.json(deals);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching deals" });
    }
});
exports.getAllDeals = getAllDeals;
