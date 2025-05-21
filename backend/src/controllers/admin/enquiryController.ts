import { Request, Response } from "express";
import Enquiry from "../../models/enquiryModel";

// GET all enquiries
export const getAllEnquiries = async (req: Request, res: Response) => {
  try {
    const enquiries = await Enquiry.find().populate('user');
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch enquiries" });
  }
};

// POST create a new enquiry
export const createEnquiry = async (req: Request, res: Response) => {
  try {
    const { user, phone, name, requirement } = req.body;
    // console.log("BODY:-", req.body)
    const newEnquiry = new Enquiry({ user, phone, name, requirement });
    await newEnquiry.save();
    res.status(201).json(newEnquiry);
  } catch (error) {
    console.log("error:-", error)
    res.status(500).json({ message: "Failed to create enquiry" });
  }
};
