import { findAllInstitutions, findInstitutionById } from "../models/institution_models.js";

//Controller that allows to get all institutions
export const getInstitutions = async (req, res, next) =>{
    try{
        const institutions = await findAllInstitutions();
        
        res.json(institutions);
    } catch (err){
        next(err);
    }
}

//Controller that allows to get an institutions based on its id
export const getInstitution = async (req, res, next) =>{
    try{
        const id = parseInt(req.params.id);
        const institution = await findInstitutionById(id);
        if(!institution) return res.status(404).json({ message :"User not found"});
        
        res.json(institution);
    } catch (err){
        next(err);
    }
}

