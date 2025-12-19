import db from "../config/db.js";

//Model for creating a new institution in the database
export const creatNewInstitution = async (uid, name, email, type, sub, services, address, regNumber, numberOfMembers, bankInfo, date) =>{
    const query = "INSERT INTO institutions(unique_id, name, email_address, institution_type, institution_sub, services, address, registration_number,  number_of_members, bank_information,  date_created) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *"
    const values = [uid, name, email, type, sub, services, address, regNumber, numberOfMembers, bankInfo, date];
    const result = await db.query(query, values);
    return result.rows[0];
};

//Model for getting all institutions from the database
export const findAllInstitutions = async () =>{
    const result = await db.query("SELECT * FROM institutions");
    return result.rows;
}

//Model for getting a specific institution from the database by id
export const findInstitutionById = async (id) => {
    const query = "SELECT * FROM institutions WHERE id = $1";
    const values = [id];
    const result = await db.query(query, values);
    return result.rows[0];
}